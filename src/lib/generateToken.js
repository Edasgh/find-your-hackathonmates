import jwt from "jsonwebtoken";

const jwt_secret = String(process.env.JWT_SECRET);

export const generateToken = (id) => {
  return jwt.sign({ id }, jwt_secret, {
    expiresIn: "30d",
  });
};
