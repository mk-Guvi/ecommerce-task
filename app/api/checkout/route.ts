import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { ApiResponse, Order } from '@/types';

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<Order>>> {
  try {
    const { discountCode } = await request.json();
    const order = store.checkout(discountCode);
    return NextResponse.json({ type: 'success', data: order });
  } catch (error) {
    return NextResponse.json({ type: 'error', message: (error as Error).message }, { status: 400 });
  }
}