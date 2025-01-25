"use server";
import { getToken, verifyToken } from "@/lib/verifyToken";

export async function getLoggedInUser() {
  const tokenObj = await getToken();
  if (tokenObj !== null) {
    const userId = await verifyToken(tokenObj.token);
    if (userId !== null || userId !== undefined) {
      return tokenObj;
    }
  } else {
    throw new Error("User not logged In!");
  }
}
