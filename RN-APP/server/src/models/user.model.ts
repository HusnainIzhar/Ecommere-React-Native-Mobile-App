import mongoose, { Model, Schema } from "mongoose";
import { IUser } from "../interfaces/models.interface";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
require("dotenv").config();

//emailRegex for email @ validation
const emailRegex: RegExp = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

//User Schema
const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: true,
      match: [emailRegex, "Please enter a valid email address"],
    },
    password: {
      type: String,
      minlength: [6, "Your password must be longer than 6 characters"],
      select: false,
    },
    mobile: {
      type: String,
    },
    avatar: {
      type:String
    },
    accountType: {
      type: String,
      enum: ["Admin", "User"],
      default: "User",
    },
    products: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Product",
      },
    ],
    socialProfile: {
      type: Boolean,
      default: false,
    },
    orders: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Order",
      },
    ],
    reviews: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  { timestamps: true }
);

//Hash Password before saving user
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  return next();
});

//sign access token
userSchema.methods.signAccessToken = function (): string {
  return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN_SECRET || "", {
    expiresIn: "5m",
  });
};

//sign refresh token
userSchema.methods.signRefreshToken = function (): string {
  return jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN_SECRET || "", {
    expiresIn: "3d",
  });
};

//compare password
userSchema.methods.comparePassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const User: Model<IUser> = mongoose.model("User", userSchema);
