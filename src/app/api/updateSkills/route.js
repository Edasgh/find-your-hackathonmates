import { dbConn } from "@/lib/mongo";
import Team from "@/model/team-model";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  const { teamId, skillsArr } = await request.json();
  await dbConn();
  try {
    const resp = await Team.findByIdAndUpdate(teamId, { skills: skillsArr });
    if (resp) {
      return new NextResponse("Skills updated successfully!", { status: 200 });
    } else {
      throw new Error("Something went wrong!");
    }
  } catch (error) {
    return new NextResponse(error.message, {
      status: 500,
    });
  }
};
