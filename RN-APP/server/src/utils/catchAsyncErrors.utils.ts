import { Request, Response, NextFunction } from 'express';

//catch async errors handler
export const catchAsyncErrors = (fn: any) => (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};