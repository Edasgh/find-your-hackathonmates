import { dbConn } from "@/lib/mongo";
import Team from "@/model/team-model";
import { NextResponse } from "next/server";

export const GET = async(request)=>{
  //dbConn
  await dbConn();
  const url = request.url;
  const params = new URLSearchParams(new URL(url).search);
  const id = params.get("id");
  try {
    const team = await Team.findById(id);
    if (team) {
      return NextResponse.json(team, { status: 200 });
    }
    else
    {
        throw new Error("Can't fetch details, try again later!");
    }
  } catch (error) {
    console.log(error);
    return new NextResponse(error.message, {
      status: 500,
    });
  }
}