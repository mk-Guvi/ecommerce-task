import { NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { ApiResponse, DiscountCode } from '@/types';

export async function GET(): Promise<NextResponse<ApiResponse<{ discountCode: DiscountCode|string }>>> {
  try {
    const discountCode = store.generateDiscountCode();
    return NextResponse.json({ type: 'success', data: { discountCode } });
  } catch (error) {
    return NextResponse.json({ type: 'error', message: (error as Error).message }, { status: 500 });
  }
}