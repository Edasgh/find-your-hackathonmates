// Import Next.js response helper for sending API responses
import { NextResponse } from "next/server";

// Import MongoDB connection function
import { dbConn } from "@/lib/mongo";

// Import User mongoose model
import User from "@/model/user-model";


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
