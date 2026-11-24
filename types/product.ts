export interface Product {
  id: number;
  name: string;
  price: number;
  promotion: number | null;
  description: string | null;
  photo: string | null;
  /** null = estoque ilimitado. */
  stock: number | null;
  category_id: number | null;
}
