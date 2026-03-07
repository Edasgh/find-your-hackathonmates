// Import Next.js response helper
import { NextResponse } from "next/server";

// Import MongoDB connection function
import { dbConn } from "@/lib/mongo";

// Import Mongoose models
import Request from "@/model/request-model";
import User from "@/model/user-model";

/**
 * POST API
 *
 * Purpose:
 * Returns all applications/requests in the system for admin users.
 *
 * This API is used in the admin dashboard to:
 * - Display the total number of applications
 * - Show recent activities (requests sent by users)
 *
 * Request Body:
 * {
 *   "admin": "admin_user_id"
 * }
 *
 * Response Example:
 * {
 *   "applications": [
 *     { "sender": {...}, "team": {...}, "message": "Request to join...", "createdAt": "..."},
 *     ...
 *   ]
 * }
 */
export const POST = async (request) => {
  // Extract admin ID from request body
  const { admin } = await request.json();

  // Connect to MongoDB
  await dbConn();

  try {
    // ------------------------------
    // Step 1: Verify Admin User
    // ------------------------------
    // Ensure the requesting user exists and is a valid admin
    const userExists = await User.findById(admin);

    if (!userExists) {
      // If admin not found, return error
      return new NextResponse("Unauthorized!", {
        status: 403,
      });
    }

    // ------------------------------
    // Step 2: Fetch All Requests
    // ------------------------------
    const applications = await Request.find();

    if (applications) {
      // Return all applications as JSON
      return NextResponse.json({ applications }, { status: 200 });
    }
  } catch (error) {
    // ------------------------------
    // Step 3: Error Handling
    // ------------------------------
    // If something fails during database operations, return server error
    return new NextResponse("Something went wrong!", {
      status: 500,
    });
  }
};
