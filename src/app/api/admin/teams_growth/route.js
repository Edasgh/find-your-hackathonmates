// Import Next.js response helper
import { NextResponse } from "next/server";

// Import MongoDB connection function
import { dbConn } from "@/lib/mongo";

// Import Mongoose models
import Team from "@/model/team-model";
import User from "@/model/user-model";

/**
 * GET API
 *
 * Purpose:
 * Returns weekly team growth data for the admin dashboard.
 *
 * It groups teams by the **month and week of creation**,
 * counts how many teams were created in each week,
 * and formats the result for frontend charts.
 *
 * Example Response:
 * [
 *   { label: "Jan Week 1", teams: 3 },
 *   { label: "Jan Week 2", teams: 5 },
 *   ...
 * ]
 */
export const GET = async () => {
  // Connect to MongoDB
  await dbConn();

  try {
    /**
     * Aggregation Pipeline
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

    // Send response
    return NextResponse.json({ teams });
  } catch (error) {
    // Return server error
    return new NextResponse(error.message, { status: 500 });
  }
};

/**
 * POST API
 *
 * Purpose:
 * Returns all teams if the requesting user is an admin.
 *
 * This is used for:
 * - Listing all teams
 * - Calculating statistics like total teams, average team size, active teams
 */
export const POST = async (request) => {
  // Extract admin ID from request body
  const { admin } = await request.json();

  // Connect to database
  await dbConn();

  try {
    // Verify if the admin exists
    const userExists = await User.findById(admin);

    if (!userExists) {
      return new NextResponse("Unauthorized!", { status: 403 });
    }

    // Fetch all teams
    const teams = await Team.find();

    if (teams) {
      return NextResponse.json({ teams }, { status: 200 });
    }
  } catch (error) {
    // Return error if something goes wrong
    return new NextResponse("Something went wrong!", { status: 500 });
  }
};
