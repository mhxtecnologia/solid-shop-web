import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { CartState } from "@/types/cart";

// Thunk para buscar carrinho
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:3001/api/cart", {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjF9.bvUhRcV7AH3QyTek3zNISJjuptWeqauFv2ghanWuVnc`,
        },
      });

      if (!response.ok) {
        throw new Error("Falha ao buscar carrinho");
      }

      const data = await response.json();

      return data.cart;
    } catch (error) {

      return rejectWithValue(
        error instanceof Error ? error.message : "Erro desconhecido"
      );
    }
  }
);

// Thunk para adicionar ao carrinho + buscar carrinho atualizado
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (productId: number, { rejectWithValue, dispatch }) => {
    try {
      // 1. Adicionar produto ao carrinho
      const addResponse = await fetch("http://localhost:3001/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjF9.bvUhRcV7AH3QyTek3zNISJjuptWeqauFv2ghanWuVnc`,
        },
        body: JSON.stringify({ product_id: productId }),
      });

      if (!addResponse.ok) {
        const errorText = await addResponse.text();
        throw new Error(`Falha ao adicionar produto: ${addResponse.status}`);
      }

      const addData = await addResponse.json();

      // 2. Buscar carrinho atualizado
      const cartResponse = await fetch("http://localhost:3001/api/cart", {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjF9.bvUhRcV7AH3QyTek3zNISJjuptWeqauFv2ghanWuVnc`,
        },
      });

      if (!cartResponse.ok) {
        throw new Error("Falha ao buscar carrinho atualizado");
      }

      const cartData = await cartResponse.json();

      return cartData.cart;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Erro desconhecido"
      );
    }
  }
);

// Thunk para remover do carrinho + buscar carrinho atualizado
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (productId: number, { rejectWithValue }) => {
    try {

      // 1. Remover produto do carrinho
      const removeResponse = await fetch(
        "http://localhost:3001/api/cart/remove",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjF9.bvUhRcV7AH3QyTek3zNISJjuptWeqauFv2ghanWuVnc`,
          },
          body: JSON.stringify({ product_id: productId }),
        }
      );

      if (!removeResponse.ok) {
        const errorText = await removeResponse.text();
        throw new Error(`Falha ao remover produto: ${removeResponse.status}`);
      }

      const removeData = await removeResponse.json();

      // 2. Buscar carrinho atualizado
      const cartResponse = await fetch("http://localhost:3001/api/cart", {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjF9.bvUhRcV7AH3QyTek3zNISJjuptWeqauFv2ghanWuVnc`,
        },
      });

      if (!cartResponse.ok) {
        throw new Error("Falha ao buscar carrinho atualizado");
      }

      const cartData = await cartResponse.json();

      return cartData.cart;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Erro desconhecido"
      );
    }
  }
);

const initialState: CartState = {
  cart: null,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCart: (state) => {
      state.cart = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        // Só mostrar loading se não tiver carrinho ainda
        if (!state.cart) {
          state.loading = true;
        }
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        state.error = null;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Add to Cart - Mantém itens visíveis durante a operação
      .addCase(addToCart.pending, (state) => {
        // NÃO definir loading = true para não sumir os itens
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload; // Carrinho atualizado da API
        state.error = null;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Remove from Cart - Mantém outros itens visíveis
      .addCase(removeFromCart.pending, (state) => {
        // NÃO definir loading = true para não sumir os itens
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload; // Carrinho atualizado da API
        state.error = null;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
