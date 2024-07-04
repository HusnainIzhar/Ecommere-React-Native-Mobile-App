import { Request, Response, NextFunction } from "express";
import { User } from "../models/user.model";
import { catchAsyncErrors } from "../utils/catchAsyncErrors.utils";
import ErrorHandler from "../utils/errorHandler.utils";
import {
  generateLast12MonthsData,
  generateLastWeekData,
  generateTodayData,
} from "../utils/analytics.generator";
import { Product } from "../models/product.model";
import { Order } from "../models/order.model";

//get analytics
export const getUserAnalytics = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await generateLast12MonthsData(User);

      res.status(200).json({
        success: true,
        users,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const GetOrderAnalytics = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("pohnca bhai sab");
      const ordersMonthly = await generateLast12MonthsData(Order);
      const ordersToday = await generateTodayData(Order);
      const ordersWeekly = await generateLastWeekData(Order);
      res.status(200).json({
        success: true,
        ordersWeekly,
        ordersMonthly,
        ordersToday,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//get analytics for listing
export const GetAnalytics = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const totalUsers = await User.countDocuments({});
      const totalOrders = await Order.countDocuments({});
      const totalProducts = await Product.countDocuments({});
      const totalSalesResult = await Order.aggregate([
        {
          $group: {
            _id: null,
            total: {
              $sum: "$totalPrice",
            },
          },
        },
      ]);

      const totalSales =
        totalSalesResult.length > 0 ? totalSalesResult[0].total : 0;
      return res.status(200).json({
        success: true,
        data: {
          totalOrders,
          totalProducts,
          totalSales,
          totalUsers,
        },
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
