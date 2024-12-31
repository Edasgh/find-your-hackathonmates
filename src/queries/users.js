"use server";
import {getToken, verifyToken } from "@/lib/verifyToken";


import User from "@/model/user-model";


export async function getLoggedInUser()
{
   const token = await getToken();
   if(token!==null)
   {
     const userId = await verifyToken(token);
     try {
       const user = await User.findById(userId).select("-password");
       return user;
      } catch (error) {
        throw new Error(error.message)
      }
    }else
    {
      throw new Error("User not logged In!");
    }

    
}
