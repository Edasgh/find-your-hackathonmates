import { NextResponse } from "next/server";
import { dbConn } from "@/lib/mongo";
import User from "@/model/user-model";
import Team from "@/model/team-model";
import Request from "@/model/request-model";
import Unread from "@/model/unread-model";

export const DELETE = async (request) => {
  const { admin, userId } = await request.json();

  await dbConn();

  try {
    //  Verify admin
    const adminUser = await User.findById(admin);
    if (!adminUser || !adminUser.isAdmin) {
      return new NextResponse("Unauthorized!", { status: 403 });
    }

    // Check user exists
    const userToDelete = await User.findById(userId);
    if (!userToDelete) {
      return new NextResponse("User not found", { status: 404 });
    }

    // --------------------------------------------------
    // Handle teams where user is ADMIN
    // --------------------------------------------------
    const teamsOwned = await Team.find({ admin: userId });

    for (const team of teamsOwned) {
      // Find a new admin (exclude the user being deleted)
      const newAdmin = team.members.find(
        (m) => m.id.toString() !== userId
      );

      if (newAdmin) {
        // Transfer ownership
        team.admin = newAdmin.id;

        // Also remove deleted user from members
        team.members = team.members.filter(
          (m) => m.id.toString() !== userId
        );

        await team.save();
      } else {
        //  No members left → delete team
        await Team.findByIdAndDelete(team._id);

        // Remove team from all users
        await User.updateMany(
          { teams: team._id },
          { $pull: { teams: team._id } }
        );
      }
    }

    // --------------------------------------------------
    //  Remove user from all team members
    // --------------------------------------------------
    await Team.updateMany(
      { "members.id": userId },
      { $pull: { members: { id: userId } } }
    );

    // --------------------------------------------------
    // Remove team references from user (cleanup)
    // --------------------------------------------------
    await User.updateMany(
      { teams: { $in: userToDelete.teams } },
      { $pull: { teams: { $in: userToDelete.teams } } }
    );

    // ----------------------------------------------
    // Delete all Requests & Unreads created by user
    // ----------------------------------------------
    // Delete requests
    await Request.deleteMany({
      "sender.id":userId
    });

    // Delete unread notifications
    await Unread.deleteMany({
      reciever:userId,
    });

    // --------------------------------------------------
    // Delete user
    // --------------------------------------------------
    await User.findByIdAndDelete(userId);

    return NextResponse.json("User deleted successfully!", { status: 200 });

  } catch (error) {
    return new NextResponse(error.message, { status: 500 });
  }
};