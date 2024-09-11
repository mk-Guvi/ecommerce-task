import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import { ApiResponse,  GetCartItems } from "@/types";

export async function GET(): Promise<NextResponse<ApiResponse<GetCartItems>>> {
  return NextResponse.json({ type: "success", data: store.getCartDetails() });
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<GetCartItems>>> {
  try {
    const { productId, quantity } = await request.json();

    await store.addToCart(productId, quantity);

    return NextResponse.json({ type: "success", data: store.getCartDetails() });
  } catch (error) {
    return NextResponse.json(
      { type: "error", message: (error as Error).message },
      { status: 400 }
    );
  }
}

export async function PUT(
  request: NextRequest
): Promise<NextResponse<ApiResponse<GetCartItems>>> {
  try {
    const { productId, quantity } = await request.json();

    await store.UpdateCartItem(productId, quantity);

    return NextResponse.json({ type: "success", data: store.getCartDetails() });
  } catch (error) {
    return NextResponse.json(
      { type: "error", message: (error as Error).message },
      { status: 400 }
    );
  }
}
export async function DELETE(
  request: NextRequest
): Promise<NextResponse<ApiResponse<GetCartItems>>> {
  try {
    const { productId } = await request.json();
    const response = store.removeFromCart(productId);
    return NextResponse.json({ ...response, data: store.getCartDetails() });
  } catch (error) {
    return NextResponse.json(
      { type: "error", message: (error as Error).message },
      { status: 400 }
    );
  }
}
