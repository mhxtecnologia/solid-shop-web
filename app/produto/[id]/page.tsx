import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductCard } from '@components/layout/ProductCard';
import { getProduct } from '@/lib/server/api';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProduct((await params).id);
  return { title: product ? `${product.name} | Solid Shop` : 'Produto não encontrado' };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct((await params).id);
  if (!product) notFound();

  return <ProductCard product={product} />;
}
