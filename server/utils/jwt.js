import jwt from "jsonwebtoken";

export default async function jwtToken(userId, res) {
  const token = await jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: "15d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 15 * 24 * 60 * 60 * 1000,
    sameSite: "strict",
  });
  return token;
}
