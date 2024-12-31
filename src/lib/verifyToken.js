"use server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const jwt_secret = String(process.env.JWT_SECRET);

export const verifyToken = async (token) => {
  const data = jwt.verify(token, jwt_secret);
  const userId = data.id;
  return userId;
};

export const getToken = async () => {
  const token = (await cookies()).get("token");
  if (token?.value) {
    return token.value;
  } else {
    return null;
  }
};
