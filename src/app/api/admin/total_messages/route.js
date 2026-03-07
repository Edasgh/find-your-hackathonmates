// Import Next.js helper to send API responses
import { NextResponse } from "next/server";

// Import MongoDB connection function
import { dbConn } from "@/lib/mongo";

// Import Team model (MongoDB collection)
import Team from "@/model/team-model";

/**
 * GET API
 *
 * Purpose:
 * Returns the total number of messages sent across all teams.
 *
 * This is used in the admin dashboard to display
 * the overall message count statistic.
 *
 * Example Response:
 * {
 *   "totalMessages": 1245
 * }
 */
export const GET = async () => {
  // Establish connection to MongoDB database
  await dbConn();

  try {
    /**
     * MongoDB Aggregation Pipeline
     *
     * Step 1 → Count messages inside each team
     * Step 2 → Sum all message counts across teams
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

    /**
     * Extract totalMessages from aggregation result.
     *
     * If no teams exist, messageResult array will be empty,
     * so we safely return 0 using optional chaining.
     */
    const totalMessages = messageResult[0]?.totalMessages || 0;

    // Send JSON response to client
    return NextResponse.json(
      {
        totalMessages,
      },
      { status: 200 },
    );
  } catch (error) {
    // Return server error if aggregation fails
    return new NextResponse(error.message, { status: 500 });
  }
};
