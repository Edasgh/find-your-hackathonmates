"use server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const jwt_secret = String(process.env.JWT_SECRET);

export const verifyToken = async (token) => {
  try {
    const data = jwt.verify(token, jwt_secret);
    const userId = data.id;
    return userId;
  } catch (error) {
    throw new Error("Something went wrong!");
  }
};

export const getToken = async () => {
  try {
    const token = JSON.parse((await cookies()).get("token").value);
    if (token) {
      return token;
    } else {
      return null;
    }
  } catch (error) {
    throw new Error("Something went wrong!");
  }
};
