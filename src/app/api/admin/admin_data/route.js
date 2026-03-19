// Import Next.js response helper
import { NextResponse } from "next/server";

// Import MongoDB connection function
import { dbConn } from "@/lib/mongo";

// Import Mongoose models
import Request from "@/model/request-model";
import User from "@/model/user-model";
import Team from "@/model/team-model";


// users_growth, teams_growth, no_of_reqs

/**
 * Helper → Verify Admin || for post methods only
 */
const verifyAdmin = async (adminId) => {
    if (!adminId) return false;
    const user = await User.findById(adminId);
    return !!user;
};

export const GET = async () => {
    // Establish connection with MongoDB database
    await dbConn();

    try {
        /**
         * ========================================
         * 1️⃣ TOP SKILLS ANALYTICS
         * ========================================
         *
         * Purpose:
         * Identify the most popular skills among users.
         *
         * Steps:
         * 1. Unwind skills array → each skill becomes a separate document
         * 2. Normalize skill strings:
         *    - Trim spaces
         *    - Convert to lowercase
         *    - Remove dots (.)
         *    - Remove spaces
         * 3. Normalize aliases:
         *    - "js" → "javascript"
         *    - "node" → "nodejs"
         * 4. Group by skill and count occurrences
         * 5. Sort by highest count
         * 6. Format output
         * 7. Limit to top 5 skills
         *
         * Example Output:
         * [
         *   { skill: "javascript", count: 25 },
         *   { skill: "react", count: 18 }
         * ]
         */
        const top_skills = await User.aggregate([
            // STEP 1: Break the skills array into separate documents
            // Example:
            // { skills: ["React", "Node.js"] }
            // becomes
            // { skills: "React" }
            // { skills: "Node.js" }
            { $unwind: "$skills" },

            // STEP 2: Normalize skill strings
            // - Remove leading/trailing spaces
            // - Convert to lowercase
            // - Remove '.' characters
            // - Remove spaces
            //
            // This ensures that variations like:
            // " Node.js ", "node js", "NODE.JS"
            // all become: "nodejs"
            {
                $addFields: {
                    skills: {
                        $replaceAll: {
                            input: {
                                $replaceAll: {
                                    input: {
                                        $toLower: {
                                            $trim: { input: "$skills" }, // remove extra spaces
                                        },
                                    },
                                    find: ".", // remove dots
                                    replacement: "",
                                },
                            },
                            find: " ", // remove spaces
                            replacement: "",
                        },
                    },
                },
            },

            // STEP 3: Normalize known aliases
            // Some skills may have common short forms
            // Example:
            // "js" -> "javascript"
            // "node" -> "nodejs"
            //
            // This ensures different names are counted together
            {
                $addFields: {
                    skills: {
                        $switch: {
                            branches: [
                                { case: { $eq: ["$skills", "js"] }, then: "javascript" },
                                { case: { $eq: ["$skills", "node"] }, then: "nodejs" },
                            ],
                            default: "$skills", // if no alias match, keep original
                        },
                    },
                },
            },

            // STEP 4: Group by skill name and count occurrences
            // This calculates how many users have each skill
            {
                $group: {
                    _id: "$skills",
                    count: { $sum: 1 },
                },
            },

            // STEP 5: Sort skills by highest count first
            // This helps identify the most popular skills
            { $sort: { count: -1 } },

            // STEP 6: Restructure output format
            // Convert MongoDB's default `_id` field into `skill`
            // This makes the result easier to use in charts
            {
                $project: {
                    _id: 0,
                    skill: "$_id",
                    count: 1,
                },
            },

            // STEP 7: Limit results to only the top 5 skills
            // Useful for dashboards and bar charts
            { $limit: 5 },
        ]);


        /**
         * ========================================
         * 2️⃣ MONTHLY USER GROWTH
         * ========================================
         *
         * Purpose:
         * Track how many users register each month.
         *
         * Steps:
         * 1. Group users by year & month of creation
         * 2. Count users per group
         * 3. Sort chronologically
         * 4. Convert month number → readable name
         *
         * Example Output:
         * [
         *   { month: "Jan", users: 12 },
         *   { month: "Feb", users: 8 }
         * ]
         */

        const monthlyUsers = await User.aggregate([
            {
                $group: {
                    // Create group key based on year and month of createdAt
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                    },

                    // Count number of users in that group
                    users: { $sum: 1 },
                },
            },

            // Sort results chronologically
            {
                $sort: { "_id.year": 1, "_id.month": 1 },
            },
        ]);


        const months = [
            "", // index 0 unused because Mongo months start from 1
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ];


        const monthlyUsersData = monthlyUsers.map((item) => ({
            month: months[item._id.month], // convert month number → name
            users: item.users, // user count
        }));



        /**
         * ========================================
         * 3️⃣ WEEKLY TEAM GROWTH
         * ========================================
         *
         * Purpose:
         * Analyze how many teams are created per week.
         *
         * Steps:
         * 1. Extract month & day from createdAt
         * 2. Convert day → week of month
         *    (1–7 → Week 1, 8–14 → Week 2, etc.)
         * 3. Group by month & week
         * 4. Count teams
         * 5. Sort chronologically
         * 6. Format label (e.g., "Jan Week 2")
         *
         * Example Output:
         * [
         *   { label: "Jan Week 1", teams: 3 },
         *   { label: "Jan Week 2", teams: 5 }
         * ]
         */
        const teams = await Team.aggregate([
            // ---------------------------------------
            // Step 1: Add month and day fields
            // ---------------------------------------
            {
                $addFields: {
                    month: { $month: "$createdAt" }, // Extract numeric month (1-12)
                    day: { $dayOfMonth: "$createdAt" }, // Extract day of month (1-31)
                },
            },

            // ---------------------------------------
            // Step 2: Calculate week of month
            // ---------------------------------------
            {
                $addFields: {
                    weekOfMonth: {
                        $ceil: { $divide: ["$day", 7] }, // Day 1-7 → Week 1, 8-14 → Week 2, etc.
                    },
                },
            },

            // ---------------------------------------
            // Step 3: Group by month and week
            // ---------------------------------------
            {
                $group: {
                    _id: {
                        month: "$month",
                        week: "$weekOfMonth",
                    },

                    // Count number of teams in each week
                    teams: { $sum: 1 },
                },
            },

            // ---------------------------------------
            // Step 4: Sort by month and week
            // ---------------------------------------
            {
                $sort: {
                    "_id.month": 1,
                    "_id.week": 1,
                },
            },

            // ---------------------------------------
            // Step 5: Format result for frontend charts
            // ---------------------------------------
            {
                $project: {
                    _id: 0, // Remove MongoDB default _id

                    // Concatenate month name + "Week X"
                    label: {
                        $concat: [
                            {
                                $arrayElemAt: [
                                    [
                                        "", // index 0 unused
                                        "Jan",
                                        "Feb",
                                        "Mar",
                                        "Apr",
                                        "May",
                                        "Jun",
                                        "Jul",
                                        "Aug",
                                        "Sep",
                                        "Oct",
                                        "Nov",
                                        "Dec",
                                    ],
                                    "$_id.month",
                                ],
                            },
                            " Week ",
                            { $toString: "$_id.week" },
                        ],
                    },

                    // Keep teams count
                    teams: 1,
                },
            },
        ]);

        /**
         * ========================================
         * 4️⃣ TOTAL MESSAGES COUNT
         * ========================================
         *
         * Purpose:
         * Calculate total messages sent across all teams.
         *
         * Steps:
         * 1. Count messages in each team
         * 2. Sum all message counts
         *
         * Example Output:
         * {
         *   totalMessages: 1245
         * }
         */
        const messageResult = await Team.aggregate([
            /**
             * $project stage
             *
             * Creates a new field called messageCount
             * which stores the number of messages
             * inside the messages array of each team.
             *
             * Example:
             * messages = [msg1, msg2, msg3]
             * messageCount = 3
             */
            {
                $project: {
                    messageCount: { $size: "$messages" }, // count messages per team
                },
            },

            /**
             * $group stage
             *
             * Groups all documents together
             * (_id: null means one group only)
             *
             * Then sums messageCount values
             * to calculate total messages across all teams.
             */
            {
                $group: {
                    _id: null,

                    // Sum all message counts
                    totalMessages: { $sum: "$messageCount" },
                },
            },
        ]);

        const totalMessages = messageResult[0]?.totalMessages || 0;

        // Return the  JSON response
        /**
        * ========================================
        * FINAL RESPONSE
        * ========================================
        *
        * Returns all analytics data required
        * for the admin dashboard in a single response.
        */
        return NextResponse.json({ top_skills, monthlyUsersData, teams, totalMessages });
    } catch (error) {
        // Handle errors and return server error response
        return new NextResponse(error.message, { status: 500 });
    }
}


export const POST = async (request) => {
    // Extract admin ID from request body
    const { admin } = await request.json();

    // Connect to database
    await dbConn();
    try {

        const adminVerified = await verifyAdmin(admin);
        if (!adminVerified) {
            // If admin not found, return error
            return new NextResponse("Unauthorized!", {
                status: 403,
            });
        }

        /**
        * Fetch all users from database
        */
        const users = await User.find().populate("teams");
        // ------------------------------
        // Fetch all teams
        // ------------------------------
        const teams = await Team.find().populate("members.id").populate("messages.sender.id");
        // ------------------------------
        // Fetch All Requests
        // ------------------------------
        const applications = await Request.find().populate("team.id").populate("sender.id");


        if (users && teams && applications) {
            // Send response to frontend
            return NextResponse.json({ users, teams, applications }, { status: 200 });
        }else{
            throw new Error("Can't fetch users, teams & applications!");
        }

    } catch (error) {
        // Return error if query fails
        return new NextResponse(error.message, {
            status: 500,
        });
    }
}

