import { apiEndpoints } from "@/constants/apiEndPoints";
import { CartItem, Order } from "../types";
import axios from "axios";

class Store {
  private cart: CartItem[] = [];
  private orders: Order[] = [];
  private discountCodes: string[] = [];
  private orderCount: number = 0;
  private readonly DISCOUNT_INTERVAL: number = 3;
  private readonly DISCOUNT_PERCENTAGE: number = 0.1;

  getCart(): CartItem[] {
    return this.cart;
  }

  async addToCart(productId: number, quantity: number): Promise<void> {
    const productResponse = await axios.get(
      `${apiEndpoints.products}/${productId}`
    );
    
    if (productResponse?.data?.id) {
    } else throw new Error("Product not found");

    const existingItem = this.cart.find(
      (item) => item.product.id === productId
    );
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cart.push({
        product: {
          id: productResponse?.data?.id,
          images: productResponse?.data?.images || [],
          title: productResponse?.data?.title,
          price: productResponse?.data?.price,
        },
        quantity,
      });
    }
  }

  removeFromCart(productId: number): {
    type: "success" | "error";
    message: string;
  } {
    let isItemFound = false;
    this.cart = this.cart.filter((item) => {
      if (item.product.id === productId) {
        isItemFound = true;
      }
      return item.product.id !== productId;
    });
    if(isItemFound){
        return {
            type:"success",
            message:"Deleted Successfully"
        }
    }else{
        return {
            type:"error",
            message:"Invalid product id"
        }
    }
  }

  clearCart(): void {
    this.cart = [];
  }

  private calculateTotal(): number {
    return this.cart.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  }

  checkout(discountCode?: string): Order {
    if (this.cart.length === 0) throw new Error("Cart is empty");

    let total = this.calculateTotal();
    let discount = 0;

    if (discountCode && this.discountCodes.includes(discountCode)) {
      discount = total * this.DISCOUNT_PERCENTAGE;
      total -= discount;
      this.discountCodes = this.discountCodes.filter(
        (code) => code !== discountCode
      );
    }

    const order: Order = {
      id: this.orders.length + 1,
      items: [...this.cart],
      total,
      discount,
      discountCode: discountCode || null,
    };

    this.orders.push(order);
    this.clearCart();
    this.orderCount++;

    if (this.orderCount % this.DISCOUNT_INTERVAL === 0) {
      this.generateDiscountCode();
    }

    return order;
  }

  public generateDiscountCode(): string {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.discountCodes.push(code);
    return code;
  }

  getStats() {
    const itemsPurchased = this.orders.reduce(
      (total, order) =>
        total + order.items.reduce((sum, item) => sum + item.quantity, 0),
      0
    );

    const totalPurchaseAmount = this.orders.reduce(
      (total, order) => total + order.total,
      0
    );

    const totalDiscountAmount = this.orders.reduce(
      (total, order) => total + order.discount,
      0
    );

    return {
      itemsPurchased,
      totalPurchaseAmount,
      discountCodes: this.discountCodes,
      totalDiscountAmount,
    };
  }
}

export const store = new Store();
