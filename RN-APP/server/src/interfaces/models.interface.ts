import { Document, Types } from "mongoose";

// User interface
export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  mobile?: string;
  accountType: "Admin" | "User";
  avatar:string;
  profile?: IProfile;
  products: IProduct[];
  socialProfile: boolean;
  orders: IOrder[];
  reviews: IReview[];
  comparePassword(password: string): Promise<boolean>;
  signAccessToken: () => string;
  signRefreshToken: () => string;
}

//UserExists interface
export interface IUserExists extends Document {
  name: string;
  email: string;
  password: string;
  mobile: string;
  avatar: string;
  accountType: "Admin" | "User";
  socialProfile:boolean;
  products: IProduct[];
  orders:IOrder[];
  reviews:IReview[];
}

// User profile interface
export interface IProfile extends Document {
  user?: Types.ObjectId;
  mobile?: number;
  whatsapp?: number;
  image: {
    public_id: string;
    url: string;
  };
}

export interface IProductImage {
  public_id: string;
  url: string;
}

interface IAnalyticsListing {
  views: number;
  locations: string[];
}


// Property interface
export interface IProduct extends Document {
  title: string;
  description: string;
  manufacturer: string;
  price: number;
  category: string;
  ingredients: string;
  strength: string;
  dosageForm: string;
  image: IProductImage;
  stockQuantity: number;
  ratings: number;
  numReviews: number;
  directions: string;
  warnings: string;
  storageCondition: string;
  shelfLife: string;
  reviews: IReview[];
  postedBy: Types.ObjectId;
  sold: number;
  createdAt: Date;
}

//review
export interface IReview extends Document {
  user: IUser;
  name:string;
  rating: number;
  product: IProduct;
  comment: string;
  verifiedPurchase: boolean;
}

//notification
export interface INotification extends Document {
  user: IUser;
  message: string;
  read: boolean;
  createdAt: Date;
}

// Order Product interface
export interface IOrderProduct extends Document {
  product: IProduct;
  price: number;
  quantity: number;
}

// Delivery Address interface
export interface IDeliveryAddress extends Document {
  name?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  phone?: string;
  type?: string;
  coordinates?: number[];
}

// Order interface
export interface IOrder extends Document {
  customer: IUser;
  product: IOrderProduct[];
  totalPrice: number;
  status: "Pending" | "Processing" | "Shipped" | "Delivered";
  deliveryAddress: IDeliveryAddress;
  paymentInfo:string;
  createdAt: Date;
}
