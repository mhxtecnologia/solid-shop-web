import { ProductGrid } from '@components/layout/ProductGrid/ProductGrid';
import { getProducts } from '@/lib/server/api';

export default async function HomePage() {
  const products = await getProducts();

  return (
    <section className="py-4">
      <h1 className="mb-6 text-2xl font-bold">Produtos</h1>
      <ProductGrid products={products} />
    </section>
  );
}
