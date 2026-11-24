import { NextResponse } from 'next/server';
import { proxyCartRequest } from '@/lib/server/proxy';

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ productId: string }> },
) {
  const { productId } = await params;
  // Impede path traversal: só id numérico entra na URL da API.
  if (!/^\d+$/.test(productId)) {
    return NextResponse.json({ message: 'Invalid productId' }, { status: 400 });
  }
  return proxyCartRequest(`/api/cart/items/${productId}`, { method: 'DELETE' });
}
