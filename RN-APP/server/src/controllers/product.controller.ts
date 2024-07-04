import { Product } from "../models/product.model";
import { IProduct } from "../interfaces/models.interface";
import { catchAsyncErrors } from "../utils/catchAsyncErrors.utils";
import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/errorHandler.utils";
import { User } from "../models/user.model";
import { IUser } from "../interfaces/models.interface";
import cloudinary from "cloudinary";
import { redis } from "../config/redis.config";
// import { getAllListingsServices } from "../services/listing.service";
import { IProductFE } from "../interfaces/frontEndRequest.interface";
// import { Category } from "../models/category.model";
import { Review } from "../models/review.model";
import { Order } from "../models/order.model";

//upload Product
export const uploadProduct = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      if (data.image) {
        try {
          let image = data.image;
          const uploadedImage = await cloudinary.v2.uploader.upload(image, {
            folder: "Gallery",
          });
          data.image = {
            public_id: uploadedImage.public_id,
            url: uploadedImage.secure_url,
          };
        } catch (error) {
          console.log(error);
          return next(new ErrorHandler("Failed to upload image", 400));
        }
      }

      const {
        title,
        description,
        manufacturer,
        price,
        category,
        ingredients,
        strength,
        dosageForm,
        image,
        stockQuantity,
        directions,
        warnings,
        storageCondition,
        shelfLife,
        tags,
      } = data;

      if (
        !title ||
        !description ||
        !price ||
        !category ||
        !image ||
        !stockQuantity
      ) {
        return next(new ErrorHandler("Please fill mandatory fields", 400));
      }

      const userId = req.user._id;
      const userExist = await User.findById(userId).populate("products");
      if (!userExist) {
        return next(new ErrorHandler("User not found", 404));
      }
      const user: IUser = userExist;
      const product: IProduct = await Product.create(data);
      await product.save();
      user.products.push(product as IProduct);
      await user.save();
      await redis.set(userId, JSON.stringify(user));
      await redis.del("allProducts");

      res.status(200).json({
        message: "Product created successfully",
        success: true,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//edit product
export const editProduct = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productId = req.params.id;
      const data: IProductFE = req.body;
      console.log("edit is", data, productId);

      const existingProduct = await Product.findById(productId);
      if (!existingProduct) {
        return next(new ErrorHandler("Product not found", 404));
      }

      if (data.image && data.image !== existingProduct.image.url) {
        try {
          let img =
            typeof data.image === "string" ? data.image : data.image.url;
          const uploadedImage = await cloudinary.v2.uploader.upload(img, {
            folder: "Gallery",
          });
          data.image = {
            public_id: uploadedImage.public_id,
            url: uploadedImage.secure_url,
          };
        } catch (error) {
          console.log(error);
          return next(new ErrorHandler("Failed to upload image", 400));
        }
      } else {
        data.image = {
          public_id: existingProduct.image.public_id,
          url: existingProduct.image.url,
        };
      }

      const {
        title,
        description,
        manufacturer,
        price,
        category,
        ingredients,
        strength,
        dosageForm,
        image,
        stockQuantity,
        directions,
        warnings,
        storageCondition,
        shelfLife,
      } = data;
      if (
        !title ||
        !description ||
        !price ||
        !category ||
        !image ||
        !stockQuantity
      ) {
        return next(new ErrorHandler("Please fill all the fields", 400));
      }
      const userId = req.user._id;
      const userExist = await User.findById(userId);
      if (!userExist) {
        return next(new ErrorHandler("User not found", 404));
      }
      const user: IUser = userExist;
      data.postedBy = user._id;
      const product = await Product.findOneAndUpdate(
        { _id: productId },
        { $set: data },
        { new: true }
      ).lean();

      if (!product) {
        // Handle the case where no listing was found
        return next(new ErrorHandler("Product not found", 404));
      }

      const updatedProduct: IProduct = {
        ...product,
      };

      const productIndex = user.products.findIndex(
        (product) => product._id.toString() === productId
      );

      if (productIndex !== -1) {
        user.products[productIndex] = updatedProduct as IProduct;
      }
      // const deleteProductCategory = await Category.findOneAndDelete({
      //   products: productId,
      // });

      await redis.del("allProducts");
      const updatedUser = await User.findById(userId).populate("products");
      await redis.set(userId, JSON.stringify(updatedUser));
      await user.save();
      res.status(200).json({
        message: "Listing updated successfully",
        success: true,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//get Single product
export const getSingleProduct = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productId = req.params.id;
      // const isCacheExist = await redis.get(listingId);

      // if (isCacheExist) {
      //   const listing = JSON.parse(isCacheExist);
      //   res.status(200).json({
      //     message: "Listing fetched successfully",
      //     success: true,
      //     listing,
      //   });
      // } else {
      const product = await Product.findById(productId)
        .populate({
          path: "postedBy",
          populate: { path: "profile" },
        })
        .lean();
      // await redis.set(listingId, JSON.stringify(listing));
      // await redis.del("allListings");
      if (!product) {
        return next(new ErrorHandler("Product not found", 404));
      }
      res.status(200).json({
        message: "Listing fetched successfully",
        success: true,
        product,
      });
      // }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//get all Products
export const getAllProducts = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const isCacheExist = await redis.get("allProducts");
      if (isCacheExist) {
        const products = JSON.parse(isCacheExist);
        res.status(200).json({
          products,
        });
      } else {
        const products = await Product.find()
          .populate("postedBy", "name reviews")
          .populate("reviews")
          .lean();
        await redis.set("allProducts", JSON.stringify(products));
        res.status(200).json({
          products,
        });
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//get all listing only for Admin
export const getProduct = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // getAllListingsServices(res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//delet Product User only
export const deleteProductUser = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userId = req.user._id;
      const product: IProduct | null = await Product.findById(id);
      const user = req.user;
      if (!product) {
        return next(new ErrorHandler("Product not found", 404));
      } else {
        if (product.postedBy.toString() !== userId.toString()) {
          return next(
            new ErrorHandler(
              "You are not authorized to delete this listing",
              400
            )
          );
        }

        await cloudinary.v2.uploader.destroy(product.image.public_id);
        await product.deleteOne({ _id: id });
        await User.findByIdAndUpdate(userId, { $pull: { listings: id } });
        await redis.del("allProducts");
        await Review.deleteMany({ product: id });
        await Order.deleteMany({ product: id });
        // await Category.deleteMany({ products: id });

        const updatedUser = await User.findById(userId).populate(
          "products profile"
        );
        await redis.set(userId, JSON.stringify(updatedUser));
        await redis.del(id);
        res.status(200).json({
          success: true,
          message: "Product deleted Successfully",
        });
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//delete product admin only
export const deleteProduct = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const product: IProduct | null = await Product.findById(id);
      if (!product) {
        return next(new ErrorHandler("Product not found", 404));
      }

      await cloudinary.v2.uploader.destroy(product.image.public_id);

      const reviews = product.reviews;
      for (let e of reviews) {
        await Review.findByIdAndDelete(e);
      }

      const userId = product.postedBy;
      await User.findByIdAndUpdate(userId, {
        $pull: { products: product._id },
      });

      await Product.deleteOne({ _id: id });
      await redis.del("allProducts");

      res.status(200).json({
        success: true,
        message: "Product deleted Successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
