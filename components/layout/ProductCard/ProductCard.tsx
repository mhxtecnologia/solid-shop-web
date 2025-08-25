'use client';

import React, { useState } from 'react';
import { ShoppingCart, Heart, Star, Check } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { addToCart } from '@store/cartSlice';

interface ProductProps {
    id: string;
    name: string;
    category: string;
    description: string;
    price: number;
    promotionalPrice?: number;
    imageUrl: string;
    rating?: number;
    reviewsCount?: number;
    onToggleFavorite?: (productId: string) => void;
    onViewDetails?: (productId: string) => void;
    className?: string;
}

export const ProductCard: React.FC<ProductProps> = ({
    id,
    name,
    category,
    description,
    price,
    promotionalPrice,
    imageUrl,
    rating = 0,
    reviewsCount = 0,
    onToggleFavorite,
    onViewDetails,
    className = '',
}) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const dispatch = useAppDispatch();
    const { error } = useAppSelector((state) => state.cart);

    const currentPrice = promotionalPrice || price;
    const hasDiscount = promotionalPrice && promotionalPrice < price;

    const handleAddToCart = async () => {
        try {
            setIsAddingToCart(true);
            setShowSuccess(false);

            // Disparar ação do Redux
            const result = await dispatch(addToCart(parseInt(id)));

            if (result.type === 'cart/addToCart/fulfilled') {
                // Mostrar feedback de sucesso
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 3000);
            } else {
                throw new Error(result.payload as string || 'Erro desconhecido');
            }

        } catch (error) {
            // Mostrar erro para o usuário
            const errorMessage = error instanceof Error ? error.message : 'Erro ao adicionar produto ao carrinho';
            alert(errorMessage);
        } finally {
            setIsAddingToCart(false);
        }
    };

    const handleToggleFavorite = () => {
        setIsFavorite(!isFavorite);
        onToggleFavorite?.(id);
    };

    const handleViewDetails = () => {
        onViewDetails?.(id);
    };

    const formatPrice = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    return (
        <div className={`bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden ${className}`}>
            <div className="flex flex-col md:flex-row">
                {/* Product Image Container */}
                <div className="relative group md:w-150 flex-shrink-0">
                    <div className="aspect-square md:aspect-auto md:h-full overflow-hidden bg-gray-100">
                        <img
                            src={'/images/products/' + imageUrl}
                            alt={name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x400?text=Produto';
                            }}
                        />
                    </div>

                    {/* Success Badge */}
                    {showSuccess && (
                        <div className="absolute top-3 left-3 z-10">
                            <div className="bg-green-500 text-white px-3 py-2 text-sm font-medium rounded-full flex items-center gap-2 animate-fade-in">
                                <Check size={16} />
                                Adicionado
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                            onClick={handleToggleFavorite}
                            className={`p-2 rounded-full transition-colors duration-200 ${isFavorite
                                ? 'bg-red-500 text-white'
                                : 'bg-white text-gray-700 hover:bg-red-50 hover:text-red-500'
                                }`}
                        >
                            <Heart size={18} className={isFavorite ? 'fill-current' : ''} />
                        </button>
                    </div>
                </div>

                {/* Product Info */}
                <div className="flex-1 p-6 flex flex-col justify-between">
                    <div className="space-y-4">
                        {/* Category */}
                        <div className="text-xs text-primary font-medium uppercase tracking-wide">
                            {category == '1' ? 'CELULARES E SMARTPHONES' : 'PERFUMES'}
                        </div>

                        {/* Product Name */}
                        <h3 className="text-2xl font-bold text-primary hover:text-primary-hover transition-colors cursor-pointer leading-tight"
                            onClick={handleViewDetails}>
                            {name}
                        </h3>

                        {/* Rating */}
                        {rating > 0 && (
                            <div className="flex items-center space-x-3">
                                <div className="flex items-center">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            size={16}
                                            className={`${star <= rating
                                                ? 'text-yellow-400 fill-current'
                                                : 'text-gray-300'
                                                }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm text-gray-500">
                                    {rating.toFixed(1)} ({reviewsCount} {reviewsCount === 1 ? 'avaliação' : 'avaliações'})
                                </span>
                            </div>
                        )}

                        {/* Description */}
                        <p className="text-base text-gray-600 leading-relaxed">
                            {description}
                        </p>

                        {/* Price Section */}
                        <div className="space-y-2">
                            <div className="flex items-baseline space-x-3">
                                <span className="text-3xl font-bold text-primary">
                                    {formatPrice(currentPrice)}
                                </span>
                                {hasDiscount && (
                                    <span className="text-lg text-gray-500 line-through">
                                        {formatPrice(price)}
                                    </span>
                                )}
                            </div>

                        </div>
                    </div>

                    {/* Actions Section */}
                    <div className="space-y-4 pt-6 border-t border-gray-100">
                        {/* Success Message */}
                        {showSuccess && (
                            <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                                <Check size={16} className="text-green-600" />
                                <span className="text-sm text-green-700 font-medium">
                                    Produto adicionado ao carrinho!
                                </span>
                            </div>
                        )}

                        {/* Error Message */}
                        {error && !showSuccess && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                <span className="text-sm text-red-600">{error}</span>
                            </div>
                        )}

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            {/* Add to Cart Button */}
                            <button
                                onClick={handleAddToCart}
                                disabled={isAddingToCart}
                                className={`py-2 px-4 rounded-md font-medium text-sm transition-all duration-200 flex items-center justify-center space-x-2 btn-primary disabled:opacity-50 disabled:cursor-not-allowed ${showSuccess ? 'bg-green-600 hover:bg-green-700' : ''
                                    }`}
                            >
                                {isAddingToCart ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        <span>Adicionando...</span>
                                    </>
                                ) : showSuccess ? (
                                    <>
                                        <Check size={16} />
                                        <span>Adicionado</span>
                                    </>
                                ) : (
                                    <>
                                        <ShoppingCart size={16} />
                                        <span>Adicionar ao Carrinho</span>
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Additional Info */}
                        <div className="flex flex-wrap gap-4 text-xs text-gray-500 pt-2">
                            <span>📦 Frete grátis acima de R$ 199</span>
                            <span>↩️ Devolução grátis em 30 dias</span>
                            <span>🔒 Compra 100% segura</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};