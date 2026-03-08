// Import Next.js response helper for sending API responses
import { NextResponse } from "next/server";

// Import MongoDB connection function
import { dbConn } from "@/lib/mongo";

// Import User mongoose model
import User from "@/model/user-model";

/**
 * GET API
 *
 * Purpose:
 * Returns monthly user growth data for the admin dashboard.
 *
 * Example response:
 * [
 *   { month: "Jan", users: 12 },
 *   { month: "Feb", users: 8 },
 *   { month: "Mar", users: 20 }
 * ]
 */
export const GET = async () => {
  // Establish database connection
  await dbConn();

  try {
    /**
     * MongoDB Aggregation Pipeline
     *
     * Groups users by the year and month they were created
     * and counts how many users registered in each month.
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

    /**
     * Array used to convert numeric month values
     * (1-12) into readable month names.
     */
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

    /**
     * Transform aggregation result into
     * chart-friendly format for frontend.
     */
    const data = monthlyUsers.map((item) => ({
      month: months[item._id.month], // convert month number → name
      users: item.users, // user count
    }));

    // Send response as JSON
    return NextResponse.json({ data });
  } catch (error) {
    // If something fails, return 500 error
    return new NextResponse(error.message, { status: 500 });
  }
};

/**
 * POST API
 *
 * Purpose:
 * Returns all users in the system.
 *
 * This route is protected by verifying
 * that the requesting admin exists.
 *
 * Request Body Example:
 * {
 *   "admin": "adminUserId"
 * }
 */
export const POST = async (request) => {
  // Extract admin ID from request body
  const { admin } = await request.json();

  // Connect to database
  await dbConn();

  try {
    /**
     * Check if admin exists in database
     */
    const userExists = await User.findById(admin);

    if (!userExists) {
      // If admin not found, return error
      return new NextResponse("Unauthorized!", {
        status: 403,
      });
    }

    /**
     * Fetch all users from database
     */
    const users = await User.find();

    if (users) {
      // Send users list to frontend
      return NextResponse.json({ users }, { status: 200 });
    }
  } catch (error) {
    // Return error if query fails
    return new NextResponse(error.message, {
      status: 500,
    });
  }
};

/**
 * DELETE API
 *
 * Purpose:
 * Deletes a selected user
 *
 * This route is protected by verifying
 * that the requesting admin exists.
 *
 * Request Body Example:
 * {
 *   "admin": "adminUserId",
 *   "userId":"user._id"
 * }
 */

export const DELETE = async (request) => {
  // Extract admin ID from request body
  const { admin, userId } = await request.json();

  // Connect to database
  await dbConn();

  try {
    /**
     * Check if admin exists in database
     */
    const userExists = await User.findById(admin);

    if (!userExists) {
      // If admin not found, return error
      return new NextResponse("Unauthorized!", {
        status: 403,
      });
    }

    /**
     * Fetch the user from database and delete user
     */
    const deleteUser = await User.findByIdAndDelete(userId)

    if (deleteUser) {
      // Send users list to frontend
      return NextResponse.json("User deleted successfully!", { status: 200 });
    }
  } catch (error) {
    // Return error if query fails
    return new NextResponse(error.message, {
      status: 500,
    });
  }
};
