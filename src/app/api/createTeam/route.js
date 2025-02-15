import { NextResponse } from "next/server";
import { dbConn } from "@/lib/mongo";

import Team from "@/model/team-model";
import User from "@/model/user-model";

export const POST = async (request) => {
  const {
    name,
    email,
    description,
    members,
    hackathonName,
    admin,
    skills,
    links,
  } = await request.json();

  //db connection
  await dbConn();

  //create a team
  const tm = {
    name,
    email,
    hackathonName,
    description,
    members,
    admin,
    skills,
    links,
  };

  try {
    const teamCreated = await Team.create(tm);
    if (!teamCreated) {
      return new NextResponse("Something went wrong!", {
        status: 500,
      });
    }
    const userExists = await User.findById(admin);
    if (!userExists) {
      return new NextResponse("Something went wrong!", {
        status: 500,
      });
    }
    let currTeams = [...userExists.teams];
    currTeams.push(`${teamCreated._id}`);
    userExists.teams = currTeams;
    const resp = await userExists.save();

    if (!resp) {
      throw new Error("Something went wrong!");
    }
    return new NextResponse("Team created successfully!", { status: 201 });
  } catch (error) {
    return new NextResponse(error.message, {
      status: 500,
    });
  }
};

export const GET = async (request) => {
  //dbConn
  await dbConn();
  const url = request.url;
  const params = new URLSearchParams(new URL(url).search);
  const id = params.get("id");
  try {
    const teams = await Team.find({ "members.id": { $ne: id } });
    if (teams) {
      return NextResponse.json({ teams: teams }, { status: 200 });
    }
  } catch (error) {
    return new NextResponse("Something went wrong!", {
      status: 500,
    });
  }
};

//update team
export const PATCH = async (request) => {
  const { teamId, name, hackathonName, email, description } =
    await request.json();
  await dbConn();
  try {
    const resp = await Team.findByIdAndUpdate(teamId, {
      name: name,
      hackathonName: hackathonName,
      email: email,
      description: description,
    });
    if (resp) {
      return new NextResponse("Team updated successfully!", {
        status: 200,
      });
    } else {
      throw new Error("Something went wrong!");
    }
  } catch (error) {
    console.log(error);
    return new NextResponse(error.message, {
      status: 500,
    });
  }
};

//delete team
export const DELETE = async (request) => {
  const { teamId } = await request.json();
  await dbConn();
  //find the team
  try {
    const findTeam = await Team.findById(teamId);
    if (!findTeam) {
      throw new Error("Team not found!");
    }

    const updateUsers = await User.updateMany(
      { _id: { $in: findTeam.members.map((m) => m.id) } },
      { $pull: { teams: teamId } }
    );

    if (!updateUsers) {
      throw new Error("Can't update profile!");
    }

    const deleteTeam = await Team.findByIdAndDelete(teamId);
    if (!deleteTeam) {
      throw new Error("Team not deleted!");
    }

    return new NextResponse("Team deleted successfully!", { status: 200 });
  } catch (error) {
    return new NextResponse(error.message, {
      status: 500,
    });
  }
};
