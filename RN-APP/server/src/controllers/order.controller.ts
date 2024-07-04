import { Request, Response, NextFunction } from "express";
import { catchAsyncErrors } from "../utils/catchAsyncErrors.utils";
import ErrorHandler from "../utils/errorHandler.utils";
import { User } from "../models/user.model";
import { IOrderFE } from "../interfaces/frontEndRequest.interface";
import { IOrder, IProduct } from "../interfaces/models.interface";
import { Order } from "../models/order.model";
import { Product } from "../models/product.model";
import { redis } from "../config/redis.config";

//add Order
export const addOrder = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const orderData: IOrderFE = {
        customer: data.customer,
        product: data.product,
        totalPrice: data.totalPrice,
        paymentInfo: "COD",
        deliveryAddress: data.deliveryAddress,
      };
      if (!orderData.customer) {
        return next(new ErrorHandler("Please login first", 401));
      }
      if (!orderData.product) {
        return next(new ErrorHandler("Please select a product", 400));
      }
      if (!orderData.deliveryAddress) {
        return next(new ErrorHandler("Please enter address", 400));
      }

      const order: IOrder = await Order.create(orderData);
      const user = await User.findByIdAndUpdate(
        req.user._id,
        {
          $push: { orders: order._id },
        },
        { new: true }
      );
      if (!order || !user) {
        return next(new ErrorHandler("Something went wrong", 500));
      }
      res.status(200).json({
        success: true,
        message: "Order added successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//get All Orders

export const getAllOrders = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orders = await Order.find().populate("customer product.product");
      res.status(200).json({
        success: true,
        message: "All Orders fetched",
        orders,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// order processing
export const orderManage = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const orderManageData = {
        productIds: data.product,
        status: data.status,
        orderId: data.orderId,
      };

      if (orderManageData.status === "Shipped") {
        const order: IOrder | null = await Order.findById(
          orderManageData.orderId
        );
        if (order) {
          for (let product of order.product) {
            const updateProduct: IProduct | null = await Product.findById(
              product.product
            );
            if (updateProduct) {
              if (updateProduct.stockQuantity >= product.quantity) {
                updateProduct.stockQuantity -= product.quantity;
                updateProduct.sold += product.quantity;
                await redis.del("allProducts");
              } else {
                return next(new ErrorHandler("Order quantity can't be more than Stock!", 400))
              }
              await updateProduct.save();
            }
          }
        }
      }

      const updatedOrder = await Order.findByIdAndUpdate(
        data.orderId,
        { status: orderManageData.status },
        { new: true }
      );

      if (!updatedOrder) {
        console.log(`Order with ID ${data.orderId} not found`);
      }

      res.status(200).json({
        success: true,
        message: "Order updated successfully",
      });
    } catch (error: any) {
      next(new ErrorHandler(error.message, 400));
    }
  }
);
