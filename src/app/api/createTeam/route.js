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
      return new NextResponse("Something went wrong!", {
        status: 500,
      });
    }
    return new NextResponse("Team created successfully!", { status: 201 });
  } catch (error) {
    console.log(error);
    return new NextResponse("Something went wrong!", {
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
    console.log(error);
    return new NextResponse("Something went wrong!", {
      status: 500,
    });
  }
};
