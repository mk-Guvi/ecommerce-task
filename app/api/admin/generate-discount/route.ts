import { NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { ApiResponse } from '@/types';

export async function POST(): Promise<NextResponse<ApiResponse<{ discountCode: string }>>> {
  try {
    const discountCode = (store).generateDiscountCode();
    return NextResponse.json({ type: 'success', data: { discountCode } });
  } catch (error) {
    return NextResponse.json({ type: 'error', message: (error as Error).message }, { status: 500 });
  }
}