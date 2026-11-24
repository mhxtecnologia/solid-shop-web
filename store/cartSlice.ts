import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Cart, CartState } from '@/types/cart';

export const UNAUTHENTICATED = 'UNAUTHENTICATED';

interface CartApiError {
  message?: string | string[];
}

/**
 * Todas as chamadas vão para as rotas do próprio Next (/api/cart), que anexam o token do cookie
 * HttpOnly. A API devolve o carrinho atualizado em cada operação: uma requisição por ação.
 */
async function cartRequest(path: string, init?: RequestInit): Promise<Cart> {
  const res = await fetch(path, {
    ...init,
    cache: 'no-store',
    headers: { 'content-type': 'application/json' },
  });
  if (res.status === 401) throw new Error(UNAUTHENTICATED);
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as CartApiError;
    const message = Array.isArray(body.message) ? body.message[0] : body.message;
    throw new Error(message ?? `Request failed (${res.status})`);
  }
  return ((await res.json()) as { cart: Cart }).cart;
}

const toMessage = (error: unknown) => (error instanceof Error ? error.message : 'Unknown error');

export const fetchCart = createAsyncThunk<Cart, void, { rejectValue: string }>(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      return await cartRequest('/api/cart');
    } catch (error) {
      return rejectWithValue(toMessage(error));
    }
  },
);

export const addToCart = createAsyncThunk<Cart, number, { rejectValue: string }>(
  'cart/addToCart',
  async (productId, { rejectWithValue }) => {
    try {
      return await cartRequest('/api/cart/items', {
        method: 'POST',
        body: JSON.stringify({ product_id: productId }),
      });
    } catch (error) {
      return rejectWithValue(toMessage(error));
    }
  },
);

export const removeFromCart = createAsyncThunk<Cart, number, { rejectValue: string }>(
  'cart/removeFromCart',
  async (productId, { rejectWithValue }) => {
    try {
      return await cartRequest(`/api/cart/items/${productId}`, { method: 'DELETE' });
    } catch (error) {
      return rejectWithValue(toMessage(error));
    }
  },
);

export const initialState: CartState = {
  cart: null,
  loading: false,
  error: null,
  authenticated: true,
};

function onFulfilled(state: CartState, action: PayloadAction<Cart>) {
  state.loading = false;
  state.cart = action.payload;
  state.error = null;
  state.authenticated = true;
}

function onRejected(state: CartState, action: { payload?: string }) {
  state.loading = false;
  // Sem sessão não é erro: o carrinho só some e a UI oferece "Entrar".
  if (action.payload === UNAUTHENTICATED) {
    state.authenticated = false;
    state.cart = null;
    state.error = null;
    return;
  }
  state.error = action.payload ?? 'Unknown error';
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        // Loading só na primeira carga, para os itens não sumirem a cada atualização.
        if (!state.cart) state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, onFulfilled)
      .addCase(fetchCart.rejected, onRejected)
      .addCase(addToCart.pending, (state) => {
        state.error = null;
      })
      .addCase(addToCart.fulfilled, onFulfilled)
      .addCase(addToCart.rejected, onRejected)
      .addCase(removeFromCart.pending, (state) => {
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, onFulfilled)
      .addCase(removeFromCart.rejected, onRejected);
  },
});

export const { clearError } = cartSlice.actions;
export default cartSlice.reducer;
