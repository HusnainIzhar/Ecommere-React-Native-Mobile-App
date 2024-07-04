

// User interface
export interface IUserFE {
  name: string;
  email: string;
  password: string;
  accountType: "Admin" | "User";
  mobile?:string;
  avatar:string;
  products: IProductFE[];
  socialProfile: boolean;
  orders: IOrderFE[];
  reviews: IReviewFE[];
  comparePassword(password: string): Promise<boolean>;
  signAccessToken: () => string;
  signRefreshToken: () => string;
}

//UserExists interface
export interface IUserExistsFE  {
  name: string;
  email: string;
  password: string;
  mobile?:string;
  accountType: "Admin" | "User" ;
  products: IProductFE[];
}

export interface IProductImageFE {
  public_id: string;
  url: string;
}

interface IAnalyticsListingFE {
  views: number;
  locations: string[];
}


// Property interface
export interface IProductFE  {
  title: string;
  description: string;
  manufacturer: string;
  price: number;
  category: string;
  ingredients: string;
  strength: string;
  dosageForm: string;
  image: string | IProductImageFE;
  stockQuantity: number;
  directions: string;
  warnings: string;
  storageCondition: string;
  shelfLife: string;
  postedBy: string;
}

//review
export interface IReviewFE  {
  user: string;
  name:string;
  rating: number;
  product: string;
  comment?: string;
}

//notification
export interface INotificationFE  {
  user: IUserFE;
  message: string;
  read: boolean;
  createdAt: Date;
}


// Order Product interface
export interface IOrderProductFE  {
  product: IProductFE;
  price: number;
  quantity: number;
}

// Delivery Address interface
export interface IDeliveryAddressFE  {
  name?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  phone?: string;
  type?:string;
  coordinates?:number[]
}

// Order interface
export interface IOrderFE  {
  customer: string;
  product: IOrderProductFE[];
  totalPrice: number;
  status?: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  deliveryAddress: IDeliveryAddressFE;
  paymentInfo:string;
}

export interface IOrderManage {
  products: IOrderProductFE[];
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
}