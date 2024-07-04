import { Request, Response, NextFunction } from "express";
import { catchAsyncErrors } from "../utils/catchAsyncErrors.utils";
import ErrorHandler from "../utils/errorHandler.utils";
import { Review } from "../models/review.model";
import { Order } from "../models/order.model";
import { Product } from "../models/product.model";
import { User } from "../models/user.model";
import { IReviewFE } from "../interfaces/frontEndRequest.interface";
import { IProduct } from "../interfaces/models.interface";

//add Review
export const addReview = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data: IReviewFE = req.body;
      console.log(data);

      const { user, product, rating, comment, name } = data;

      if (!user) {
        return next(new ErrorHandler("Please login first", 401));
      }
      if (!product) {
        return next(new ErrorHandler("Please select a product", 400));
      }
      if (!rating) {
        return next(new ErrorHandler("Please add rating", 400));
      }

      const hasPurchased = await Order.findOne({
        customer: data.user,
        "product.product": data.product,
      });

      if (!hasPurchased) {
        return next(new ErrorHandler("You haven't purchased this product", 401));
      }

      const review = await Review.create({
        ...data,
        verifiedPurchase: true,
      });

      const existingProduct: IProduct | null = await Product.findById(product);

      if (!existingProduct) {
        return next(new ErrorHandler("Product not found", 404));
      }

      existingProduct.reviews.push(review._id);
      existingProduct.numReviews += 1;
      existingProduct.ratings += review.rating;
      await existingProduct.save();

      const userUpdate = await User.findByIdAndUpdate(
        data.user,
        {
          $push: { reviews: review._id },
        },
        { new: true }
      );

      if (!userUpdate) {
        return next(new ErrorHandler("User not updated", 500));
      }

      res.status(200).json({
        success: true,
        message: "Review added successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);


// delete Review by user
export const deleteReview = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const review = await Review.findById(req.params.id);
      if (!review) {
        return next(new ErrorHandler("Review not found", 404));
      }
      if (review.user.toString() !== req.user._id.toString()) {
        return next(
          new ErrorHandler("You are not allowed to delete this review", 401)
        );
      }
      const product = await Product.findById(review.product);
      if (!product) {
        return next(new ErrorHandler("Product not found", 404));
      }
      const user = await User.findById(review.user);
      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }
      const deletedReview = await Review.findByIdAndDelete(req.params.id);
      if (!deletedReview) {
        return next(new ErrorHandler("Something went wrong", 500));
      }
      product.reviews = product.reviews.filter(
        (review) => review.toString() !== req.params.id
      );
      product.numReviews = product.reviews.length;
      product.ratings = product.reviews.reduce(
        (acc, item) => item.rating + acc,
        0
      );
      await product.save();
      user.reviews = user.reviews.filter(
        (review) => review.toString() !== req.params.id
      );
      await user.save();
      res.status(200).json({
        success: true,
        message: "Review deleted successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
