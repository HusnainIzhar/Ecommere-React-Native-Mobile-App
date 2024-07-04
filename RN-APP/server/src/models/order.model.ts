import mongoose, { Schema, Model, Document } from "mongoose";
import { IOrder } from "../interfaces/models.interface";

export const orderSchema = new Schema<IOrder>(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered"],
      default: "Pending",
      required: true,
    },
    paymentInfo: {
      type: String,
      default: "COD",
    },
    deliveryAddress: {
      name: {
        type: String,
      },
      street: {
        type: String,
      },
      city: {
        type: String,
      },
      mobile: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  }
);


export const Order: Model<IOrder> = mongoose.model<IOrder>(
  "Order",
  orderSchema
);
