import { NextResponse } from "next/server";
import { dbConn } from "@/lib/mongo";

import User from "@/model/user-model";

export const POST = async(request)=>{
  
     const {id} = await request.json();

    //dbConn
    await dbConn();

    try {
       const users = await User.find({_id:{$ne:id}});
       if(users)
       {
         return NextResponse.json({ users }, { status: 200 });
       }
    } catch (error) {
        return new NextResponse(error.message, {
          status: 500,
        });
    }
}
