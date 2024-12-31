import { dbConn } from "@/lib/mongo";
import Team from "@/model/team-model";
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
