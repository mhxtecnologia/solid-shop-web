import 'server-only';
import { cache } from 'react';
import { getAccessToken } from '@/lib/server/session';
import type { Product } from '@/types/product';

/** URL da API vista pelo servidor do Next (nunca exposta ao navegador). */
const API_URL = process.env.API_URL ?? 'http://localhost:3001';

/**
 * Chamada à API a partir do servidor. Com `auth`, anexa o token do cookie de sessão.
 * Devolve a Response crua para quem chamou decidir o status (401, 404...).
 */
export async function apiFetch(
  path: string,
  init: RequestInit & { auth?: boolean } = {},
): Promise<Response> {
  const { auth, headers, ...rest } = init;
  const token = auth ? await getAccessToken() : undefined;

  return fetch(`${API_URL}${path}`, {
    ...rest,
    cache: 'no-store',
    headers: {
      'content-type': 'application/json',
      ...(token && { authorization: `Bearer ${token}` }),
      ...headers,
    },
  });
}

export async function getProducts(): Promise<Product[]> {
  const res = await apiFetch('/api/products');
  if (!res.ok) throw new Error(`Products request failed with ${res.status}`);
  return ((await res.json()) as { products: Product[] }).products;
}

/** cache(): generateMetadata e a página pedem o mesmo produto numa única chamada à API. */
export const getProduct = cache(async (id: string): Promise<Product | null> => {
  // Só ids numéricos chegam à API; o resto já é 404.
  if (!/^\d+$/.test(id)) return null;
  const res = await apiFetch(`/api/products/${id}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Product request failed with ${res.status}`);
  return ((await res.json()) as { product: Product }).product;
});
