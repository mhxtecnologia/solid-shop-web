export interface CartItem {
  id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Cart {
  id: number;
  user_id: number;
  items: CartItem[];
  total_cart_value: number;
  created_at: string;
  updated_at: string;
}

export interface CartState {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
}
