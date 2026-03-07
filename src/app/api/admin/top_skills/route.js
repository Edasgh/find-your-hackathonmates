import { NextResponse } from "next/server";
import { dbConn } from "@/lib/mongo";
import User from "@/model/user-model";

export const GET = async () => {
  // Establish connection with MongoDB database
  await dbConn();

  try {
    const skills = await User.aggregate([
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

    // Return the processed skills data as JSON response
    return NextResponse.json({ skills });
  } catch (error) {
    // Handle errors and return server error response
    return new NextResponse(error.message, { status: 500 });
  }
};
