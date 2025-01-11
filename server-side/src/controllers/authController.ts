import { request, Request, Response } from "express";
import User, { UserData } from "../models/User";
import jwt from "jsonwebtoken";
import { redis } from "../lib/redis";

interface Auth {
  signup: (
    request: Request<{}, {}, UserData>,
    response: Response
  ) => Promise<Response>;
  login: (request: Request, response: Response) => Promise<Response>;
  logout: (request: Request, response: Response) => Promise<Response>;
  refreshToken: (request: Request, response: Response) => Promise<Response>;
  getProfile: (request: Request, response: Response) => Promise<Response>;
}

// sign up a new user
export const signup: Auth["signup"] = async (
  request: Request<any, any, UserData>,
  response: Response
): Promise<Response> => {
  const { email, password, name }: UserData = request.body; // required email and password and name

  try {
    const userExist = await User.findOne({ email }).exec();

    if (userExist)
      return response.status(409).json({ message: "User already exist" });

    const user = await User.create({ email, password, name });

    const { accessToken, refreshToken } = generateTokens(user._id as string); // generate access token and refresh token

    setCookies(response, accessToken, refreshToken); // send to browser as cookies

    await cacheRefreshToken(user._id as string, refreshToken); // cache refresh token inestead MongoDB be faster
    return response.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      message: "User created successfully",
    });
  } catch (err) {
    const message: string =
      err instanceof Error ? err.message : "Something went wrong";
    return response.status(500).json({ messsage: message });
  }
};

// logout user
export const logout: Auth["logout"] = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const { refreshToken } = request.cookies; // get refresh token from cookies

  try {
    if (refreshToken) {
      if (!process.env.REFRESH_TOKEN_SECRET)
        throw new Error("access token is not defined");
      const decoded = jwt.verify(
        // verify refresh token by secret key
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      ) as jwt.JwtPayload;

      await redis.del(`refreshToken:${decoded.userId}`); // we verirefied token and delete it from cache
    }

    response.clearCookie("accessToken"); //  clear cookies accessToken
    response.clearCookie("refreshToken"); //  clear cookies refreshToken
    return response.status(200).json({ message: "Logged out Successfully  " });
  } catch (err) {
    const message: string =
      err instanceof Error ? err.message : "Something went wrong";
    return response.status(500).json({ messsage: message });
  }
};

// login user
export const login: Auth["login"] = async (
  request: Request,
  response: Response
): Promise<Response> => {
  try {
    const { email, password } = request.body; // email and password required
    const user = await User.findOne({ email });

    // if user exist and password is correct
    if (user && (await user.comparePassword(password))) {
      const { accessToken, refreshToken } = generateTokens(user._id as string);
      await cacheRefreshToken(user._id as string, refreshToken);
      setCookies(response, accessToken, refreshToken); // send to browser as cookies

      return response.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      return response
        .status(400)
        .json({ message: "Invalid email or password" });
    }
  } catch (err) {
    const message: string =
      err instanceof Error ? err.message : "Something went wrong";
    return response.status(500).json({ messsage: message });
  }
};

//refresh token
export const refreshToken: Auth["refreshToken"] = async (
  requset: Request,
  response: Response
): Promise<Response> => {
  const { refreshToken } = requset.cookies;
  if (!refreshToken)
    return response.status(401).json({ message: "Invalid refresh token" });

  try {
    if (!process.env.REFRESH_TOKEN_SECRET)
      throw new Error("refresh token is not defined");
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    ) as jwt.JwtPayload;

    const storedRefreshToken = await redis.get(
      `refreshToken:${decoded.userId}`
    );

    if (refreshToken !== storedRefreshToken)
      return response.status(401).json({ message: "Invalid refresh token" });

    if (!process.env.ACCESS_TOKEN_SECRET)
      throw new Error("access token is not defined");
    const accessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    response.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 15 * 60 * 1000,
    });
    return response
      .status(200)
      .json({ message: "Access token refreshed Successfully" });
  } catch (err) {
    const message: string =
      err instanceof Error ? err.message : "Something went wrong";
    return response.status(500).json({ messsage: message });
  }
};

export const getProfile: Auth["getProfile"] = async (
  request: Request,
  response: Response
) => {
  try {
    return response.json({ user: request.user });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    return response.status(500).json({ messsage: message });
  }
};
// generate access token and refresh token
function generateTokens(userId: string): {
  accessToken: string;
  refreshToken: string;
} {
  if (!process.env.ACCESS_TOKEN_SECRET)
    throw new Error("access token is not defined");
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });

  if (!process.env.REFRESH_TOKEN_SECRET)
    throw new Error("refresh token is not defined");
  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
}

// cache refresh token
async function cacheRefreshToken(
  userId: string,
  refreshToken: string
): Promise<void> {
  await redis.set(
    `refreshToken:${userId}`,
    refreshToken,
    "EX",
    7 * 24 * 60 * 60
  );
}

// set cookies in browser
function setCookies(res: Response, accessToken: string, refreshToken: string) {
  res.cookie("accessToken", accessToken, {
    httpOnly: true, // javascript can't access cookies cross site scripting
    sameSite: "strict", // send cookie in same domain cross site request forgery
    secure: process.env.NODE_ENV === "production", // send cookie only in https
    maxAge: 15 * 60 * 1000, // age of cookie
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true, // javascript can't access cookies cross site scripting
    sameSite: "strict", // send cookie in same domain cross site request forgery
    secure: process.env.NODE_ENV === "production", // send cookie only in https
    maxAge: 7 * 24 * 60 * 60 * 1000, // age of cookie
  });
}
