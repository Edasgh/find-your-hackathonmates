"use server";
import { getToken, verifyToken } from "@/lib/verifyToken";
import User from "@/model/user-model";

export async function getLoggedInUser() {
  const token = await getToken();
  if (token !== null) {
    const userId = await verifyToken(token);
    if (userId !== null || userId !== undefined) {
      const user = await User.findById(userId).select("-password");
      return user;
    }
  } else {
    throw new Error("User not logged In!");
  }
}
