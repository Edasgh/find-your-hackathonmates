import { dbConn } from "@/lib/mongo";
import Team from "@/model/team-model";
import Unread from "@/model/unread-model";
import User from "@/model/user-model";
import { NextResponse } from "next/server";

export const GET = async (request) => {
  await dbConn();
  const url = request.url;
  const params = new URLSearchParams(new URL(url).search);
  const id = params.get("id");

  try {
    const teams = await Team.find({ "members.id": id });
    if (teams) {
      return NextResponse.json(teams, { status: 200 });
    }
  } catch (error) {
    console.log(error);
    console.log(error.message);
    return new NextResponse("Something went wrong!", {
      status: 500,
    });
  }
};

export const POST = async (request) => {
  const { id } = await request.json();
  await dbConn();

  try {
    const teamData = await Team.findById(id).populate("members.id");
    if (!teamData) {
      throw new Error("Something went wrong!");
    }
    return NextResponse.json(teamData, { status: 200 });
  } catch (error) {
    console.log(error);
    console.log(error.message);
    return new NextResponse(error.message, {
      status: 500,
    });
  }
};

//leave group functionality
export const PATCH = async (request) => {
  const { myId, teamId, adminId } = await request.json();
  await dbConn();

  try {
    // --------------------------------------------------
    //  Remove team from user
    // --------------------------------------------------
    const userUpdate = await User.findByIdAndUpdate(myId, {
      $pull: { teams: teamId },
    });

    if (!userUpdate) {
      throw new Error("Can't update user!");
    }

    // --------------------------------------------------
    // Find team
    // --------------------------------------------------
    const team = await Team.findById(teamId);

    if (!team) {
      throw new Error("Team not found!");
    }

    // --------------------------------------------------
    //  If ADMIN is leaving
    // --------------------------------------------------
    if (myId === adminId) {
      const remainingMembers = team.members.filter(
        (m) => m.id.toString() !== myId
      );

      if (remainingMembers.length > 0) {
        const newAdmin = remainingMembers[0].id;

        //  Update team (remove user + set new admin)
        team.members = remainingMembers;
        team.admin = newAdmin;

        await team.save();
      } else {
        //  No members → delete team
        await Team.findByIdAndDelete(teamId);

        //  IMPORTANT: remove team from all users
        await User.updateMany(
          { teams: teamId },
          { $pull: { teams: teamId } }
        );
      }
    }

    // --------------------------------------------------
    //  If NORMAL MEMBER leaving
    // --------------------------------------------------
    else {
      await Team.findByIdAndUpdate(teamId, {
        $pull: {
          members: { id: myId },
        },
      });
    }

    //  Unreads created by user
    // ----------------------------------------------
   
    // Delete unread notifications
    await Unread.deleteMany({
      reciever: myId,
      team:teamId
    });

    return new NextResponse("Left Team successfully!", {
      status: 200,
    });

  } catch (error) {
    console.log(error);
    return new NextResponse(error.message, {
      status: 500,
    });
  }
};
