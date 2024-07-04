import { Request, Response, NextFunction } from "express";
import { Notification } from "../models/notification.model";
import ErrorHandler from "../utils/errorHandler.utils";
import { catchAsyncErrors } from "../utils/catchAsyncErrors.utils";
import cron from "node-cron";

//get All notifications
export const getNotification = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const notifications = await Notification.find().sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        notifications,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//update notification 
export const updateNotification = catchAsyncErrors(
    async (req:Request, res:Response, next:NextFunction) => {
        try {
            const notification = await Notification.findById(req.params.id);
            if(!notification) {
                return next(new ErrorHandler('Notification not found', 404));
            }else{
                notification.read = true;
                await notification.save();
                const notifications = await Notification.find().sort({ createdAt: -1 });
                res.status(200).json({
                    success: true,
                    notifications
                })
            }
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

//delete notification
cron.schedule("0 0 0 * * *", async () => {
  try {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    await Notification.deleteMany({read: true,createdAt:{$lt: weekAgo}});
  } catch (error: any) {
    console.log(error.message);
  }
}
);
