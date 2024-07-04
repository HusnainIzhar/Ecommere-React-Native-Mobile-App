import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/errorHandler.utils";
import { User } from "../models/user.model";
import { IUser, IUserExists } from "../interfaces/models.interface";
import { catchAsyncErrors } from "../utils/catchAsyncErrors.utils";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { sendEmail } from "../utils/mailSender.utils";
import {
  accessTokenOptions,
  refreshTokenOptions,
  sendToken,
} from "../utils/tokens.utils";
import { redis } from "../config/redis.config";
import { OTPToken } from "../utils/tokens.utils";
import ejs from "ejs";
import path from "path";
import {
  IActivationRequest,
  ILogin,
  ISignUp,
  ISocialLogin,
  IUpdatePassword,
} from "../interfaces/auth.interface";
import {
  getUserById,
  getAllUsersServices,
  updateUserRoleService,
} from "../services/user.service";
import { error } from "console";

require("dotenv").config();

//signup user
export const signUp = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password, mobile }: ISignUp = req.body;

      if (!name || !email || !password || !mobile) {
        return next(new ErrorHandler("Please fill all the fields", 400));
      }
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return next(new ErrorHandler("User already exists", 400));
      }
      const user: ISignUp = {
        name,
        email,
        password,
        mobile,
      };
      const activationToken = OTPToken(user); //otp & user
      const activationOTP = activationToken.OTP;

      const data = { name: { name: user.name }, activationOTP };
      const html = await ejs.renderFile(
        path.join(__dirname, "../views/mail-templates/", "activationMail.ejs"),
        data
      );
      try {
        await sendEmail({
          email: user.email,
          subject: "Account Activation",
          template: "activationMail.ejs",
          data,
        });

        res.status(201).json({
          success: true,
          message: `Please check your email: ${user.email} to activate your account`,
          activationToken: activationToken.token,
        });
      } catch (error: any) {
        console.log("error occur");
        return next(new ErrorHandler(error.message, 400));
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const activateUser = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activation_token, activation_code }: IActivationRequest =
        req.body;
      const newUser: { user: IUser; OTP: string } = jwt.verify(
        activation_token,
        process.env.JWT_SECRET as Secret
      ) as { user: IUser; OTP: string };
      if (newUser.OTP !== activation_code) {
        return next(new ErrorHandler("Invalid activation code", 400));
      }
      const { name, email, password, mobile } = newUser.user;
      const avatar = `https://ui-avatars.com/api/?background=random&name=${name}`;
      const user = await User.create({
        name,
        email,
        password,
        mobile,
        avatar,
      });
      await user.save();
      res.status(201).json({
        success: true,
        message: "Account activated successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//login user
export const login = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password }: ILogin = req.body;

      if (!email || !password) {
        return next(new ErrorHandler("Please enter email and password", 400));
      }
      const userExist = await User.findOne({ email })
        .select("+password")
        .populate({
          path: "orders",
          populate: {
            path: "product.product",
            model: "Product",
          },
        });

      if (!userExist) {
        return next(new ErrorHandler("User not Exist Signup !", 400));
      }
      if (userExist.password === undefined) {
        return next(new ErrorHandler("Invalid User - (social-login)", 400));
      }
      const isPasswordMatched = await userExist.comparePassword(password);
      if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid email or password", 400));
      }

      userExist.password = "";

      sendToken(userExist, 200, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//logout
export const logout = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?._id || "";

      await redis.del(userId);

      res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//update access token
export const updateAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const refresh_token = req.headers["refresh_token"] as string;
    console.log("refreshtoken is",refresh_token);
    const decoded = jwt.verify(
      refresh_token,
      process.env.REFRESH_TOKEN_SECRET as string
    ) as JwtPayload;
    const message = "Couldn't refresh token";
    if (!decoded) {
      return next(new ErrorHandler(message, 400));
    }
    const session = await redis.get(decoded.id as string);
    if (!session) {
      return next(new ErrorHandler(message, 400));
    }
    const user = JSON.parse(session);
    const accessToken = jwt.sign(
      { id: user._id },
      process.env.ACCESS_TOKEN_SECRET as string,
      accessTokenOptions
    );
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_TOKEN_SECRET as string,
      refreshTokenOptions
    );
    req.user = user;
    res.set("access_token", accessToken);
    res.set("refresh_token", refreshToken);

    next();
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 400));
  }
};

//get user info
export const getUserInfo = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user._id;

      getUserById(userId, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//update profile info
export const updateProfileInfo = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, mobile } = req.body;
      const userId = req.user._id;
      const user: IUserExists | null = await User.findById(userId).populate(
        "Product"
      );
      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      } else {
        if (name && name !== "") {
          user.name = name;
        }
        if (mobile && mobile !== "") {
          user.mobile = mobile;
        }

        await user.save();
        await redis.set(userId, JSON.stringify(user));
        res.status(200).json({
          success: true,
          message: "Profile updated successfully",
        });
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//social auth
export const socialAuth = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, name, image } = req.body as ISocialLogin;
      const user = await User.findOne({ email }).populate("profile Product");
      let img: string;
      if (!user) {
        const newUser = await User.create({ email, name, socialProfile: true });
        if (!image) {
          img = `https://ui-avatars.com/api/?background=random&name=${name}`;
        } else {
          img = image;
        }
        await newUser.save();
        sendToken(newUser, 200, res);
      } else {
        sendToken(user, 200, res);
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//update password
export const updatePassword = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { currentPassword, newPassword, confirmPassword } =
        req.body as IUpdatePassword;
      const user = await User.findById(req.user._id).select("+password");
      if (user?.password === undefined || user.socialProfile === true) {
        return next(new ErrorHandler("Invalid User", 400));
      }
      const isPasswordMatched = await user?.comparePassword(currentPassword);
      if (!newPassword || !confirmPassword || !currentPassword) {
        return next(new ErrorHandler("Please fill all the fields", 400));
      }
      if (newPassword !== confirmPassword) {
        return next(new ErrorHandler("Password doesn't match", 400));
      }
      if (!isPasswordMatched) {
        return next(new ErrorHandler("Incorrect password", 400));
      }
      user.password = newPassword;
      await user.save();
      await redis.set(req.user._id, JSON.stringify(user));
      res.status(201).json({
        success: true,
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//get all users only for Admin
export const getAllUsers = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllUsersServices(res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//delete user admin only
export const deleteUser = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }
      await user.deleteOne({ _id: id });
      await redis.del(id);
      res.status(200).json({
        success: true,
        message: "User deleted Successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const check = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;
      console.log(email);
      if (!email) {
        return next(new ErrorHandler("Please enter any email", 400));
      }
      const existingUser = await User.findOne({ email }).select("password");
      console.log(existingUser);
      if (!existingUser) {
        return next(new ErrorHandler("No account on this email ,Signup!", 400));
      }
      if (existingUser.password === undefined) {
        return next(
          new ErrorHandler(
            "You have Social acount,Login with Social Login",
            400
          )
        );
      }
      const activationToken = OTPToken(existingUser); //otp & user
      const activationOTP = activationToken.OTP;

      const data = { name: { name: existingUser.name }, activationOTP };
      const html = await ejs.renderFile(
        path.join(__dirname, "../views/mail-templates/", "activationMail.ejs"),
        data
      );
      try {
        await sendEmail({
          email: email,
          subject: "Email Verification",
          template: "activationMail.ejs",
          data,
        });

        res.status(201).json({
          success: true,
          message: `Please check your email: ${existingUser.email} to change your password`,
          activationToken: activationToken.token,
        });
      } catch (error: any) {
        console.log("error occur");
        return next(new ErrorHandler(error.message, 400));
      }
    } catch (e: any) {
      return next(new ErrorHandler(e.message, 400));
    }
  }
);

export const verifyOTP = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activation_token, activation_code }: IActivationRequest =
        req.body;

      const newUser: { user: IUser; OTP: string } = jwt.verify(
        activation_token,
        process.env.JWT_SECRET as Secret
      ) as { user: IUser; OTP: string };
      if (newUser.OTP !== activation_code) {
        return next(new ErrorHandler("Invalid activation code", 400));
      }
      res.status(200).json({
        success: true,
        message: "OTP verified",
      });
    } catch (e: any) {
      return next(new ErrorHandler(e.message, 400));
    }
  }
);

export const forgotPassword = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        activation_token,
        activation_code,
        newPassword,
        confirmPassword,
      } = req.body;
      console.log(req.body);
      if (!activation_code || !activation_token) {
        return next(new ErrorHandler("Tokens not found", 400));
      }
      if (!newPassword || !confirmPassword) {
        return next(new ErrorHandler("Please fill all fields", 400));
      }
      const newUser: { user: IUser; OTP: string } = jwt.verify(
        activation_token,
        process.env.JWT_SECRET as Secret
      ) as { user: IUser; OTP: string };
      if (newUser.OTP !== activation_code) {
        return next(new ErrorHandler("Invalid activation code", 400));
      }

      if (!newUser.user) {
        return next(new ErrorHandler("User does not exist", 400));
      }
      if (newPassword !== confirmPassword) {
        return next(new ErrorHandler("Both passwords must be the same", 400));
      }
      if (confirmPassword.length < 7) {
        return next(
          new ErrorHandler(
            "Minimum 8 characters are required for the password",
            400
          )
        );
      }
      const userExist = await User.findById(newUser.user._id).select(
        "+password"
      );
      if (!userExist) {
        return next(new ErrorHandler("user not found", 400));
      }
      userExist.password = confirmPassword;
      await userExist.save();
      res.status(200).json({
        success: true,
        message: "Password updated successfully",
      });
    } catch (e: any) {
      return next(new ErrorHandler(e.message, 400));
    }
  }
);
