import mongoose, { Schema, Model } from "mongoose";
import { INotification } from "../interfaces/models.interface";

export const notificationSchema = new Schema<INotification>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    message: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Notification: Model<INotification> = mongoose.model(
  "Notification",
  notificationSchema
);
