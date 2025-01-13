import { dbConn } from "@/lib/mongo";
import Team from "@/model/team-model";
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
    const teamData = await Team.findById(id);
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
  const { myId, myName, teamId, adminId } = await request.json();
  await dbConn();

  try {
    const upDateMyDetails = await User.findByIdAndUpdate(myId, {
      $pull: {
        teams: teamId,
      },
    });

    if (!upDateMyDetails) {
      throw new Error("Can't update profile!");
    }

    if (myId === adminId) {
      //find the team
      const findTeam = await Team.findById(teamId);

      const remainingMembers = findTeam.members.filter(
        (member) => member.id !== myId
      );

      if (remainingMembers.length > 0) {
        const newAdmin = remainingMembers[0].id;
        const updateTeam = await Team.findByIdAndUpdate(teamId, {
          $pull: {
            members: {
              name: myName,
              id: myId,
            },
          },
          $set: { admin: newAdmin },
        });

        if (!updateTeam) {
          throw new Error("Can't update team!");
        }
      } else {
        const deleteTeam = await Team.findByIdAndDelete(teamId);
        if (!deleteTeam) {
          throw new Error("Can't delete team!");
        }
      }
    } else {
      const updateTeam = await Team.findByIdAndUpdate(teamId, {
        $pull: {
          members: {
            name: myName,
            id: myId,
          },
        },
      });

      if (!updateTeam) {
        throw new Error("Can't update team!");
      }
    }

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
