'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingCart, X, CreditCard, Trash2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { fetchCart, removeFromCart } from '@store/cartSlice';

export const FloatingCartSummary = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [removingItems, setRemovingItems] = useState<Set<number>>(new Set());
    const dispatch = useAppDispatch();
    const { cart, loading, error } = useAppSelector((state) => state.cart);

    // Buscar carrinho ao montar o componente
    useEffect(() => {
        dispatch(fetchCart());
    }, [dispatch]);

    const handleRemoveItem = async (productId: number) => {

        try {
            // Marcar como removendo
            setRemovingItems(prev => new Set([...prev, productId]));
        } catch (error) {
        } finally {
            // Remover do estado de loading
            setRemovingItems(prev => {
                const newSet = new Set(prev);
                newSet.delete(productId);
                return newSet;
            });
        }
    };

    // Cálculos seguros
    const itemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
    const totalValue = cart?.total_cart_value || 0;
    const hasItems = cart?.items && cart.items.length > 0;

    const formatPrice = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    return (
        <>
            {/* Floating Cart Button */}
            <div className="fixed bottom-6 right-6 z-50">
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-primary hover:bg-primary-hover text-white rounded-full p-4 shadow-2xl transition-all duration-300 hover:scale-110 relative group"
                >
                    <ShoppingCart className="w-6 h-6" />
                    {itemCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold animate-pulse">
                            {itemCount > 99 ? '99+' : itemCount}
                        </span>
                    )}
                    <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        Carrinho ({itemCount} {itemCount === 1 ? 'item' : 'itens'})
                    </div>
                </button>
            </div>

            {/* Cart Overlay */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 transition-opacity">
                    <div className="absolute inset-0" onClick={() => setIsOpen(false)} />

                    {/* Cart Panel */}
                    <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl transform transition-transform">
                        <div className="flex flex-col h-full">

                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Seu Carrinho</h2>
                                    <p className="text-sm text-gray-600">
                                        {itemCount} {itemCount === 1 ? 'item' : 'itens'}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-sm text-red-600">❌ {error}</p>
                                </div>
                            )}

                            {/* Cart Items */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                {/* Loading State - APENAS quando não há carrinho E está carregando */}
                                {loading && !cart && (
                                    <div className="flex flex-col items-center justify-center py-12">
                                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                                        <p className="text-gray-600">Carregando seu carrinho...</p>
                                    </div>
                                )}

                                {/* Empty Cart State - APENAS quando não está carregando E não há itens */}
                                {!loading && !hasItems && (
                                    <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                                        <ShoppingCart className="w-16 h-16 mb-4 text-gray-300" />
                                        <p className="text-lg font-medium">Seu carrinho está vazio</p>
                                        <p className="text-sm text-center">Adicione alguns produtos incríveis para continuar suas compras!</p>
                                    </div>
                                )}

                                {/* Cart Items List - SEMPRE mostrar quando há itens */}
                                {hasItems && cart.items.map((item, index) => {
                                    const isRemoving = removingItems.has(item.product_id);

                                    return (
                                        <div
                                            key={`cart-item-${item.product_id}-${index}-${item.id}`}
                                            className={`flex gap-4 p-4 bg-gray-50 rounded-xl transition-all duration-200 ${isRemoving ? 'opacity-50 pointer-events-none' : 'hover:bg-gray-100'
                                                }`}
                                        >
                                            {/* Product Image Placeholder */}
                                            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <ShoppingCart className="w-6 h-6 text-gray-400" />
                                            </div>

                                            {/* Product Info */}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-gray-900 truncate">
                                                    {item.product_name}
                                                </h3>

                                                <p className="text-sm text-gray-500 mt-1">
                                                    Quantidade: <span className="font-medium">{item.quantity}</span>
                                                </p>

                                                <div className="flex items-center justify-between mt-2">
                                                    <div className="text-sm text-gray-600">
                                                        {formatPrice(item.unit_price)} cada
                                                    </div>

                                                    <button
                                                        onClick={() => handleRemoveItem(item.product_id)}
                                                        disabled={isRemoving}
                                                        className="text-red-500 hover:text-red-700 p-1 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                        title="Remover item do carrinho"
                                                    >
                                                        {isRemoving ? (
                                                            <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                                                        ) : (
                                                            <Trash2 className="w-4 h-4" />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Total Price */}
                                            <div className="text-right flex-shrink-0">
                                                <div className="font-semibold text-gray-900">
                                                    {formatPrice(item.total_price)}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Summary & Checkout - APENAS quando há itens */}
                            {hasItems && (
                                <div className="border-t border-gray-200 bg-white">
                                    {/* Summary */}
                                    <div className="p-6 space-y-3">
                                        <div className="flex justify-between text-lg font-bold">
                                            <span>Total</span>
                                            <span className="text-primary">{formatPrice(totalValue)}</span>
                                        </div>
                                    </div>

                                    {/* Checkout Buttons */}
                                    <div className="p-6 pt-0 space-y-3">
                                        <button
                                            className="w-full btn-primary text-white py-3 px-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                                            disabled={removingItems.size > 0}
                                        >
                                            <CreditCard className="w-5 h-5" />
                                            Finalizar Compra
                                        </button>
                                        <button
                                            onClick={() => setIsOpen(false)}
                                            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 py-3 px-4 rounded-xl font-semibold transition-colors"
                                        >
                                            Continuar Comprando
                                        </button>
                                    </div>

                                    {/* Security Badge */}
                                    <div className="px-6 pb-4">
                                        <div className="flex items-center justify-center gap-2 text-xs text-gray-500 bg-gray-50 py-2 rounded-lg">
                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                            Compra 100% segura e protegida
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};