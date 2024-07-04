import { redis } from "../config/redis.config";
import { Response } from "express";
import { User } from "../models/user.model";

//get user by ID
export const getUserById = async (id: string, res: Response) => {
  // const userJSON = await redis.get(id);
  // if (userJSON) {
  //   const user = JSON.parse(userJSON as string);

  //   res.status(201).json({
  //     success: true,
  //     user,
  //   });
  // } else {
  //   res.status(404).json({
  //     success: false,
  //     message: "User not found",
  //   });
  // }
  const user = await User.findById(id)
    .select("+password")
    .populate({
      path: "orders",
      populate: {
        path: "product.product",
        model: "Product",
      },
    });
  res.status(200).json({
    success: true,
    user,
  });
};

//get All users
export const getAllUsersServices = async (res: Response) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    users,
  });
};

//update user Role
export const updateUserRoleService = async (
  res: Response,
  id: string,
  role: string
) => {
  const user = await User.findByIdAndUpdate(id, { role }, { new: true });
  res.status(200).json({
    success: true,
    user,
  });
};
