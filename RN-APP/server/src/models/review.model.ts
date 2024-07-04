import mongoose, { Model, Schema } from "mongoose";
import { IReview } from "../interfaces/models.interface";

// Review Schema
const reviewSchema = new Schema<IReview>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
      required: true
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
    rating: {
      type: Number,
      required: [true, "Please add a rating between 1 and 5"],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
    },
    verifiedPurchase: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Review: Model<IReview> = mongoose.model("Review", reviewSchema);
