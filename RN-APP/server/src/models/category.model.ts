// import mongoose, { Schema, Model } from "mongoose";
// import { ICategory } from "../interfaces/models.interface";

// export const categorySchema = new Schema<ICategory>(
//   {
//     type: {
//       type: String,
//     },
//     products: [
//       {
//         type: Schema.Types.ObjectId,
//         ref: "Product",
//       },
//     ],
//     tags: [
//       {
//         type: String,
//       },
//     ],
//   },
//   {
//     timestamps: true,
//   }
// );

// export const Category: Model<ICategory> = mongoose.model(
//   "Category",
//   categorySchema
// );
