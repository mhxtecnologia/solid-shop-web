import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { proxyCartRequest } from '@/lib/server/proxy';

const bodySchema = z.object({ product_id: z.number().int().positive() });

export async function POST(request: NextRequest) {
  // Valida antes de repassar: só o campo esperado chega à API.
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ message: 'Invalid product_id' }, { status: 400 });
  }
  return proxyCartRequest('/api/cart/items', {
    method: 'POST',
    body: JSON.stringify(parsed.data),
  });
}
