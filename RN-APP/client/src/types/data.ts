
export interface ICart {
  id: string;
  image: string;
  title: string;
  category: string;
  price: number;
  quantity: number;
  total?: number;
}

export interface ICategories {
  src: string;
  title: string;
}

export interface IForm {
  title: string;
  description: string;
  category: string;
  price: number | string | null;
  image: string;
  stockQuantity: number | string | null;
  manufacturer: string;
  ingredients: string;
  strength: string;
  dosageForm: string;
  directions: string;
  warnings: string;
  storageCondition: string;
  shelfLife: string;
}

export interface ILogin {
  email: string;
  password: string;
}
export interface ISignup {
  name: string;
  email: string;
  mobile: string;
  password: string;
}

interface IImage {
  public_id: string;
  url: string;
}

interface Review {
  _id: string;
  user: string;
  product: string;
  rating: number;
  comment: string;
  verifiedPurchase: boolean;
  createdAt: Date;
  updatedAt: Date;
  name:string;
  __v: number;
}
export interface IProducts {
  title: string;
  description: string;
  manufacturer: string;
  price: number;
  category: string;
  ingredients: string;
  strength: string;
  dosageForm: string;
  stockQuantity: number;
  directions: string;
  warnings: string;
  storageCondition: string;
  shelfLife: string;
  reviews: Review[]; // Adjust the type of reviews as needed
  _id: string;
  image: IImage; // Adjust the type of images as needed
  createdAt: string;
  updatedAt: string;
  numReviews:number;
  sold:number;
  ratings:number

  __v: number;
}

export interface Pdct {
  _id:string;
  product: IProducts;
  price: number | null;
  quantity: number | null;
}

interface DeliveryAddress {
  name: string;
  street: string;
  city: string;
  mobile: string;
}

interface Data {
  customer: string;
  product: Pdct[];
  totalPrice: number | null;
  deliveryAddress: DeliveryAddress;
  _id:string
}

export interface IOrderForm {
  token: string;
  data: Data;
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  avatar: string;
  accountType: string;
  socialProfile: boolean;
  orders: Data[];
  reviews: string;
}

export interface IOrders {
  customer:IUser,
  product:Pdct[],
  totalPrice:Number,
  status:string,
  deliveryAddress:DeliveryAddress,
  paymentInfo:string,
  _id:string,
  createdAt:string
}


interface DeliveryAddress {
  city: string;
  mobile: string;
  name: string;
  street: string;
}

interface Product {
  _id: string;
  price: number;
  product: IProducts;
  quantity: number;
}

interface Order {
  __v: number;
  _id: string;
  createdAt: string;
  customer: string;
  deliveryAddress: DeliveryAddress;
  paymentInfo: string;
  product: Product[];
  status: string;
  totalPrice: number;
  updatedAt: string;
}

export interface User {
  __v: number;
  _id: string;
  accountType: string;
  avatar: string;
  createdAt: string;
  email: string;
  mobile: string;
  name: string;
  orders: Order[];
  password: string;
  products: any[];
  reviews: string[];
  socialProfile: boolean;
  updatedAt: string;
}
