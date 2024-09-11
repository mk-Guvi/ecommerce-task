import { apiEndpoints } from "@/constants/apiEndPoints";
import { CartItem, DiscountCode, GetCartItems, Order } from "../types";
import axios from "axios";
import { LANG } from "@/constants";

class Store {
  private cart: CartItem[] = [];
  private orders: Order[] = [];
  private discountCodes: DiscountCode[] = [];
  private orderCount: number = 0;
  private readonly DISCOUNT_INTERVAL: number = 3;
  private readonly DISCOUNT_PERCENTAGE: number = 10;

  getCartDetails(): GetCartItems {
    return {
      carts: this.cart,
      total: parseFloat(
        this.cart
          ?.reduce((a, b) => {
            return a + b.product.price * b.quantity;
          }, 0)
          .toFixed(2)
      ),
    };
  }

  async addToCart(productId: number, quantity: number): Promise<void> {
    const productResponse = await axios.get(
      `${apiEndpoints.products}/${productId}`,
      {
        validateStatus: () => true,
      }
    );
    if (!productResponse?.data?.id) {
      throw new Error("Product not found");
    }

    const existingItem = this.cart.find(
      (item) => item.product.id === productId
    );

    if (existingItem) {
      const updatedQuantity = existingItem.quantity + quantity;
      if (updatedQuantity > productResponse?.data?.stock) {
        throw new Error(LANG.QUANTITY_EXCEEDED_ERR_MESSAGE);
      }
      existingItem.quantity = updatedQuantity;
    } else {
      if (quantity > productResponse?.data?.stock) {
        throw new Error(LANG.QUANTITY_EXCEEDED_ERR_MESSAGE);
      }
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

  async UpdateCartItem(productId: number, quantity: number): Promise<void> {
    const productResponse = await axios.get(
      `${apiEndpoints.products}/${productId}`,
      {
        validateStatus: () => true,
      }
    );
    if (!productResponse?.data?.id) {
      throw new Error("Product Not Found.");
    }

    const existingItem = this.cart.find(
      (item) => item.product.id === productId
    );

    if (existingItem) {
      const updatedQuantity = existingItem.quantity + quantity;
      if (updatedQuantity > productResponse?.data?.stock) {
        throw new Error(LANG.QUANTITY_EXCEEDED_ERR_MESSAGE);
      }
      existingItem.quantity = updatedQuantity;
    } else {
      throw new Error("Product Not Found.")
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
    if (isItemFound) {
      return {
        type: "success",
        message: "Deleted Successfully",
      };
    } else {
      return {
        type: "error",
        message: "Product Not Found.",
      };
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

  checkout(discountCode?: DiscountCode): Order {
    if (this.cart.length === 0) throw new Error("Cart is empty");

    let total = this.calculateTotal();
    let discount = 0;

    if (
      discountCode &&
      this.discountCodes.some((e) => e.name === discountCode.name)
    ) {
      discount = total * this.DISCOUNT_PERCENTAGE;
      total -= discount;
      this.discountCodes = this.discountCodes.filter(
        (code) => code.name !== discountCode.name
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
    return order;
  }

  public generateDiscountCode(): DiscountCode|string {
    
    if (this.orderCount && this.orderCount % this.DISCOUNT_INTERVAL === 0) {
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      const data:DiscountCode={
        name: code,
        type: "PERCENTAGE",
        value: this.DISCOUNT_PERCENTAGE,
      }
      this.discountCodes.push(data);
      return data;
    }
    return "";
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
