export interface CartItem {
  id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Cart {
  /** null enquanto o cliente ainda não tem carrinho. */
  id: number | null;
  client_id: number;
  items: CartItem[];
  total_cart_value: number;
}

export interface CartState {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
  /** false quando o BFF respondeu 401: o usuário precisa entrar. */
  authenticated: boolean;
}
