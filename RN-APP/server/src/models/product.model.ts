import mongoose, { Model, Schema } from "mongoose";
import { IProduct } from "../interfaces/models.interface";

interface IProductModel extends IProduct {
  averageRating: number;
}

// Product Schema
const productSchema = new Schema<IProduct>(
  {
    title: {
      type: String,
      required: [true, "Please enter a title"],
    },
    description: {
      type: String,
      required: [true, "Please enter a description"],
    },
    manufacturer: {
      type: String,
    },
    price: {
      type: Number,
      required: [true, "Please enter a price"],
    },
    category: {
      type: String,
      required: true, // Changed from 'require' to 'required'
    },
    ingredients: {
      type: String,
    },
    strength: {
      type: String,
    },
    dosageForm: {
      type: String,
    },
    image: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    stockQuantity: {
      type: Number,
      required: true,
    },
    ratings: {
      type: Number,
    },
    numReviews: {
      type: Number,
    },
    directions: {
      type: String,
    },
    warnings: {
      type: String,
    },
    storageCondition: {
      type: String,
    },
    shelfLife: {
      type: String,
    },
    sold: {
      type: Number,
      default:0
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    postedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

productSchema.pre("save", async function (this: IProductModel, next) {
  if (this.isModified("reviews")) {
    const reviews = await mongoose.models["Review"].find({
      _id: { $in: this.reviews },
    });
    const totalRating = reviews.reduce(
      (total, review) => total + review.rating,
      0
    );
    this.ratings = reviews.length > 0 ? totalRating / reviews.length : 0;
    this.numReviews = reviews.length;
    this.ratings = totalRating; // Store the sum of all review ratings
  }
  if(this.isModified("orders")){
    const orders = await mongoose.models["Order"].find({
      
    })
  }
  next();
});

export const Product: Model<IProduct> = mongoose.model<IProduct>(
  "Product",
  productSchema
);
