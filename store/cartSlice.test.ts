import { configureStore } from '@reduxjs/toolkit';
import { describe, expect, it, vi } from 'vitest';
import cartReducer, { addToCart, fetchCart, removeFromCart } from './cartSlice';
import type { Cart } from '@/types/cart';

const CART: Cart = {
  id: 1,
  client_id: 1,
  items: [
    {
      id: 10,
      product_id: 7,
      product_name: 'Keyboard',
      quantity: 2,
      unit_price: 459,
      total_price: 918,
    },
  ],
  total_cart_value: 918,
};

function makeStore() {
  return configureStore({ reducer: { cart: cartReducer } });
}

function mockFetch(status: number, body: unknown) {
  return vi.spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(body), {
      status,
      headers: { 'content-type': 'application/json' },
    }),
  );
}

describe('cartSlice', () => {
  it('loads the cart through the BFF route, never calling the API directly', async () => {
    const fetchSpy = mockFetch(200, { cart: CART });
    const store = makeStore();

    await store.dispatch(fetchCart());

    expect(fetchSpy).toHaveBeenCalledWith('/api/cart', expect.anything());
    const [, init] = fetchSpy.mock.calls[0];
    expect(JSON.stringify(init)).not.toMatch(/authorization/i);
    expect(store.getState().cart).toMatchObject({ cart: CART, loading: false, error: null });
  });

  it('treats 401 as "not signed in" instead of an error', async () => {
    mockFetch(401, { message: 'Unauthenticated' });
    const store = makeStore();

    await store.dispatch(fetchCart());

    expect(store.getState().cart).toMatchObject({ authenticated: false, cart: null, error: null });
  });

  it('exposes the API error message when adding fails', async () => {
    mockFetch(400, { message: 'Requested quantity exceeds available stock' });
    const store = makeStore();

    await store.dispatch(addToCart(7));

    expect(store.getState().cart.error).toBe('Requested quantity exceeds available stock');
  });

  it('uses the cart returned by the add call (single round trip)', async () => {
    const fetchSpy = mockFetch(200, { cart: CART });
    const store = makeStore();

    await store.dispatch(addToCart(7));

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy).toHaveBeenCalledWith(
      '/api/cart/items',
      expect.objectContaining({ method: 'POST', body: JSON.stringify({ product_id: 7 }) }),
    );
    expect(store.getState().cart.cart).toEqual(CART);
  });

  it('removes an item with DELETE on the item route', async () => {
    const fetchSpy = mockFetch(200, { cart: { ...CART, items: [], total_cart_value: 0 } });
    const store = makeStore();

    await store.dispatch(removeFromCart(7));

    expect(fetchSpy).toHaveBeenCalledWith(
      '/api/cart/items/7',
      expect.objectContaining({ method: 'DELETE' }),
    );
    expect(store.getState().cart.cart?.items).toHaveLength(0);
  });
});
