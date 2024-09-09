import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import { ApiResponse, CartItem } from "@/types";

export async function GET(): Promise<NextResponse<ApiResponse<CartItem[]>>> {
  return NextResponse.json({ type: "success", data: store.getCart() });
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<CartItem[]>>> {
  try {
    const { productId, quantity } = await request.json();
    await store.addToCart(productId, quantity);
    return NextResponse.json({ type: "success", data: store.getCart() });
  } catch (error) {
    return NextResponse.json(
      { type: "error", message: (error as Error).message },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: NextRequest
): Promise<NextResponse<ApiResponse<CartItem[]>>> {
  try {
    const { productId } = await request.json();
    const response = store.removeFromCart(productId);
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { type: "error", message: (error as Error).message },
      { status: 400 }
    );
  }
}
