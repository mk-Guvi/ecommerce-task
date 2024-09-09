import { NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { ApiResponse, Stats } from '@/types';

export async function GET(): Promise<NextResponse<ApiResponse<Stats>>> {
  try {
    const stats = store.getStats();
    return NextResponse.json({ type: 'success', data: stats });
  } catch (error) {
    return NextResponse.json({ type: 'error', message: (error as Error).message }, { status: 500 });
  }
}