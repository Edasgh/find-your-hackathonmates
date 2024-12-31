import { NextResponse } from "next/server";
import { dbConn } from "@/lib/mongo";

import Request from "@/model/request-model";


export const POST = async (request) => {
  const {userId} = await request.json();
  await dbConn();

  try {
    const requests = await Request.find({ "reciever.id": { $eq: userId } });
    if (!requests) {
      throw new Error("Requests not found!");
    }
    const resp = NextResponse.json(requests, { status: 200 });
    return resp;
  } catch (error) {
    console.log(error);
    return new NextResponse(error.message, {
      status: 500,
    });
  }
};
