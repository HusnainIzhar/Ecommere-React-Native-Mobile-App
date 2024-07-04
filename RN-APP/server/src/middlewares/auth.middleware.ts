import { Request, Response, NextFunction } from "express";
import { catchAsyncErrors } from "../utils/catchAsyncErrors.utils";
import ErrorHandler from "../utils/errorHandler.utils";
import jwt, { JwtPayload } from "jsonwebtoken";
import { redis } from "../config/redis.config";

// authenticated user
export const isAuthenticated = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    console.log("isAuth"+authHeader)
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new ErrorHandler("Please provide a valid JWT token", 401));
    }
    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET as string
      ) as JwtPayload;
      if (!decoded) {
        return next(new ErrorHandler("Access Token is not valid", 401));
      }
      const user = await redis.get(decoded.id);
      if (!user) {
        return next(new ErrorHandler("User not found", 401));
      }
      req.user = JSON.parse(user);
      next();
    } catch (error: any) {
      if (error.name === "TokenExpiredError") {
        return next(new ErrorHandler("Access Token has expired", 401));
      } else if (error.name === "JsonWebTokenError") {
        return next(new ErrorHandler("Invalid Access Token", 401));
      } else {
        return next(new ErrorHandler("Error decoding access token", 401));
      }
    }
  }
);

//validate role
export const isAuthorized = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.accountType || "";
    console.log(userRole)
    if (!roles.includes(userRole)) {
      return next(
        new ErrorHandler(
          `Role ${userRole} is not allowed to access this resource`,
          403
        )
      );
    }
    next();
  };
};
