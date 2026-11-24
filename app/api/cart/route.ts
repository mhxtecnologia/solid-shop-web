import { proxyCartRequest } from '@/lib/server/proxy';

export async function GET() {
  return proxyCartRequest('/api/cart');
}
