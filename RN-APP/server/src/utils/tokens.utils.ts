require("dotenv").config();
import { Response, NextFunction } from "express";
import { IUser } from "../interfaces/models.interface";
import { redis } from "../config/redis.config";
import jwt, { Secret } from "jsonwebtoken";
import { IActivationToken, ITokenOptions } from "../interfaces/token.interface";
import ErrorHandler from "./errorHandler.utils";

// create activation token
export const OTPToken = (user: any): IActivationToken => {
  const OTP = Math.floor(1000 + Math.random() * 9000).toString();

  const token = jwt.sign(
    {
      user,
      OTP,
    },
    process.env.JWT_SECRET as Secret,
    {
      expiresIn: process.env.JWT_EXPIRES_TIME,
    }
  );
  return { token, OTP };
};

// Parse environment variables
const accessTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRE || "5", 10);
const refreshTokenExpire = parseInt(
  process.env.REFRESH_TOKEN_EXPIRE || "3",
  10
);

// Options for token
export const accessTokenOptions: ITokenOptions = {
  expiresIn: accessTokenExpire * 60 * 60 * 60 * 1000,
};

// Options for refresh token
export const refreshTokenOptions: ITokenOptions = {
  expiresIn: refreshTokenExpire * 24 * 60 * 60 * 1000,
};

export const sendToken = async (
  user: IUser,
  statusCode: number,
  res: Response
) => {
  if (!user) {
    return new ErrorHandler("No user found in Token", 400);
  }
  const accessToken = jwt.sign(
    { id: user._id },
    process.env.ACCESS_TOKEN_SECRET as string,
    accessTokenOptions
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.REFRESH_TOKEN_SECRET as string,
    refreshTokenOptions
  );

  user._id && redis.set(user._id, JSON.stringify(user));

  res.set("access_token", accessToken);
  res.set("refresh_token", refreshToken);

  res.status(statusCode).json({
    success: true,
    accessToken,
    user,
  });
};
