import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User, { UserData } from "../models/User";

declare global {
  namespace Express {
    interface Request {
      user?: UserData;
    }
  }
}

export const portectRoute = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | undefined> => {
  const accessToken = request.cookies.accessToken;
  if (!accessToken)
    return response.status(401).json({ message: "Invalid access token" });

  try {
    if (!process.env.ACCESS_TOKEN_SECRET)
      throw new Error("access token is not defined");

    const decoded = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET
    ) as jwt.JwtPayload;

    if (!decoded) response.status(403).json({ message: "Access denied" });

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) return response.status(404).json({ message: "User not found" });

    request.user = user;

    next();
  } catch (err) {
    const message: string =
      err instanceof Error ? err.message : "Something went wrong";
    return response.status(500).json({ message });
  }
};

export const adminRoute = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | undefined> => {
  if (request.user?.role === "admin") next();
  else return response.status(403).json({ message: "Access denied" });
};
