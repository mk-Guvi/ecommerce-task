export interface Product {
  id: number;
  title: string;
  price: number;
  stock?: number;
  images: [];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface GetCartItems {
  carts: CartItem[];
  total: number;
}
export interface Order {
  id: number;
  items: CartItem[];
  total: number;
  discount: number;
  discountCode: DiscountCode | null;
}

export interface Stats {
  itemsPurchased: number;
  totalPurchaseAmount: number;
  discountCodes: DiscountCode[];
  totalDiscountAmount: number;
}

export interface ApiResponse<T> {
  type: "success" | "error";
  data?: T;
  message?: string;
}

export interface DiscountCode{
  name:string,
  type:"PERCENTAGE",
  value:number
}