import Link from 'next/link';
import { effectivePrice, formatPrice, productImageSrc } from '@/lib/format';
import type { Product } from '@/types/product';

/** Vitrine renderizada no servidor: sem JavaScript no cliente, só links para o detalhe. */
export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return <p className="py-12 text-center text-gray-600">Nenhum produto disponível no momento.</p>;
  }

  return (
    <ul className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => {
        const price = effectivePrice(product.price, product.promotion);
        return (
          <li key={product.id}>
            <Link
              href={`/produto/${product.id}`}
              className="block h-full bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- imagens de origem arbitrária do catálogo */}
              <img
                src={productImageSrc(product.photo)}
                alt={product.name}
                loading="lazy"
                className="w-full aspect-square object-cover bg-gray-100"
              />
              <div className="p-4 space-y-1">
                <h2 className="font-semibold text-gray-900">{product.name}</h2>
                <p className="text-lg font-bold text-primary">
                  {formatPrice(price)}
                  {price < product.price && (
                    <span className="ml-2 text-sm font-normal text-gray-500 line-through">
                      {formatPrice(product.price)}
                    </span>
                  )}
                </p>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
