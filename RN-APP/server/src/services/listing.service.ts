// import { Response } from "express";
// import { Listing } from "../models/product.model";


// //get all listing
// export const getAllListingsServices = async (res: Response) => {
//     const listings = await Listing.find().sort({ createdAt: -1 });
//     res.status(200).json({
//         success: true,
//         listings
//     })
// }