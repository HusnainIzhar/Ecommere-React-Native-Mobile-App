import ErrorHandler from "../utils/errorHandler.utils";
import { Request, Response, NextFunction } from "express";

export const ErrorMiddleware = (
    error: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    error.statusCode = error.statusCode || 500;
    error.message = error.message || "Internal Server Error";

    //wrong mongodb id error
    if (error.name === "CastError") {
        const message = `Resource not found. Invalid: ${error.path}`
        error = new ErrorHandler(message, 400);
    };

    //Duplicate key error
    if (error.statusCode === 11000) {
        const message = `Duplicate ${Object.keys(error.keyValue)} entered`;
        error = new ErrorHandler(message, 400);
    };

    //wrong jwt error
    if (error.name === "JsonWebTokenError") {
        const message = `JSON Web Token is invalid. Try Again!!!`;
        error = new ErrorHandler(message, 400);
    };

    //jwt expired error
    if (error.name === "TokenExpiredError") {
        const message = `JSON Web Token is expired. Try Again!!!`;
        error = new ErrorHandler(message, 400);
    };

    res.status(error.statusCode).json({
        success: false,
        message: error.message,
        stack: error.stack
    });

};
