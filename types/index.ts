export interface Product {
    id: number;
    title: string;
    price: number;
    stock?:number;
    images:[]
  }
  
  export interface CartItem {
    product: Product;
    quantity: number;
  }
  
  export interface Order {
    id: number;
    items: CartItem[];
    total: number;
    discount: number;
    discountCode: string | null;
  }
  
  export interface Stats {
    itemsPurchased: number;
    totalPurchaseAmount: number;
    discountCodes: string[];
    totalDiscountAmount: number;
  }
  
  export interface ApiResponse<T> {
    type: 'success' | 'error';
    data?: T;
    message?: string;
  }