'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Heart, ShoppingCart } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { addToCart, UNAUTHENTICATED } from '@store/cartSlice';
import { effectivePrice, formatPrice, productImageSrc } from '@/lib/format';
import type { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
  className?: string;
}

const SUCCESS_FEEDBACK_MS = 3000;

export const ProductCard: React.FC<ProductCardProps> = ({ product, className = '' }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { error } = useAppSelector((state) => state.cart);

  const currentPrice = effectivePrice(product.price, product.promotion);
  const hasDiscount = currentPrice < product.price;
  const outOfStock = product.stock !== null && product.stock <= 0;

  const handleAddToCart = async () => {
    setIsAdding(true);
    setShowSuccess(false);
    const result = await dispatch(addToCart(product.id));
    setIsAdding(false);

    if (addToCart.fulfilled.match(result)) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), SUCCESS_FEEDBACK_MS);
    } else if (result.payload === UNAUTHENTICATED) {
      // Sem sessão: manda para o login em vez de mostrar erro.
      router.push('/login');
    }
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden ${className}`}
    >
      <div className="flex flex-col md:flex-row">
        <div className="relative group md:w-150 flex-shrink-0">
          <div className="aspect-square md:aspect-auto md:h-full overflow-hidden bg-gray-100">
            {/* eslint-disable-next-line @next/next/no-img-element -- imagens de origem arbitrária do catálogo */}
            <img
              src={productImageSrc(product.photo)}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.currentTarget.src = productImageSrc(null);
              }}
            />
          </div>

          {showSuccess && (
            <div className="absolute top-3 left-3 z-10">
              <div className="bg-green-600 text-white px-3 py-2 text-sm font-medium rounded-full flex items-center gap-2 animate-fade-in">
                <Check size={16} />
                Adicionado
              </div>
            </div>
          )}

          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              type="button"
              aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
              aria-pressed={isFavorite}
              onClick={() => setIsFavorite((value) => !value)}
              className={`p-2 rounded-full transition-colors duration-200 ${
                isFavorite
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-red-50 hover:text-red-700'
              }`}
            >
              <Heart size={18} className={isFavorite ? 'fill-current' : ''} />
            </button>
          </div>
        </div>

        <div className="flex-1 p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-primary leading-tight">{product.name}</h1>

            {product.description && (
              <p className="text-base text-gray-600 leading-relaxed">{product.description}</p>
            )}

            <div className="flex items-baseline space-x-3">
              <span className="text-3xl font-bold text-primary">{formatPrice(currentPrice)}</span>
              {hasDiscount && (
                <span className="text-lg text-gray-500 line-through">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            {product.stock !== null && product.stock > 0 && product.stock <= 5 && (
              <p className="text-sm font-medium text-orange-800">
                Só {product.stock} {product.stock === 1 ? 'unidade' : 'unidades'} em estoque
              </p>
            )}
          </div>

          <div className="space-y-4 pt-6 border-t border-gray-100">
            {showSuccess && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                <Check size={16} className="text-green-700" />
                <span className="text-sm text-green-800 font-medium">
                  Produto adicionado ao carrinho!
                </span>
              </div>
            )}

            {error && !showSuccess && (
              <div role="alert" className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <span className="text-sm text-red-700">{error}</span>
              </div>
            )}

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isAdding || outOfStock}
              className="py-2 px-4 rounded-md font-medium text-sm transition-all duration-200 flex items-center justify-center space-x-2 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAdding ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Adicionando…</span>
                </>
              ) : outOfStock ? (
                <span>Esgotado</span>
              ) : (
                <>
                  <ShoppingCart size={16} />
                  <span>Adicionar ao carrinho</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
