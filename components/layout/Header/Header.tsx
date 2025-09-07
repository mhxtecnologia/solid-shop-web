'use client';

import React, { useState } from 'react';

import { Search, Menu, X, ShoppingCart, User, Heart, MapPin, Phone } from 'lucide-react';

import { Logo } from '@/components/ui/Logo';

export const Header: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Event handlers internos
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSearchOpen(false);
    };




    return (
        <header className="sticky top-0 z-50 bg-white shadow-md">
            {/* Top Bar - Somente Desktop */}
            <div className="hidden bg-gray-100 border-b border-gray-200 lg:block">
                <div className="container px-4 mx-auto lg:px-6">
                    <div className="flex items-center justify-between py-2">
                        <div className="flex items-center space-x-6">
                            <div className="flex items-center space-x-2 text-xs text-gray-600">
                                <Phone size={14} />
                                <span>Central: 0800-0000</span>
                            </div>
                            <div className="flex items-center space-x-2 text-xs text-gray-600">
                                <MapPin size={14} />
                                <span>Encontre uma loja</span>
                            </div>
                        </div>
                        <div className="flex items-center space-x-5">
                            <a href="#" className="text-xs font-medium text-gray-600 hover:primary">
                                Cartão Loja
                            </a>
                            <a href="#" className="text-xs font-medium text-gray-600 hover:primary">
                                Corporativo
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main */}
            <div className="bg-white">
                <div className="container px-4 mx-auto lg:px-6">
                    <div className="flex items-center justify-between py-3 lg:py-4">
                        {/* Mobile Menu */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 text-gray-700 md:hidden hover:primary"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>

                        {/* Logo */}
                        <Logo href='https://matheus.site' />

                        {/* Desktop Search */}
                        <form onSubmit={handleSearch} className="flex-1 hidden max-w-2xl mx-8 sm:flex">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Busque seu produto aqui..."
                                className="flex-1 px-4 py-3 border-2 border-gray-200 outline-none rounded-l-md"
                            />
                            <button
                                type="submit"
                                className="px-4 py-3 text-white cursor-pointer btn-primary rounded-r-md"
                            >
                                <Search size={20} />
                            </button>
                        </form>

                        {/* Header Actions */}
                        <div className="flex items-center space-x-4">
                            {/* Mobile Search */}
                            <button
                                onClick={() => setIsSearchOpen(!isSearchOpen)}
                                className="p-2 text-gray-700 sm:hidden hover:text-red-600"
                            >
                                <Search size={24} />
                            </button>

                            {/* User */}
                            <button
                                className="flex items-center p-2 space-x-2 rounded cursor-pointer hover:bg-gray-50"
                            >
                                <User size={24} />
                                <div className="hidden text-left sm:block">
                                    <div className="text-xs font-medium">Olá!</div>
                                    <div className="text-xs text-gray-500">Matheus Henrique</div>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Mobile Search */}
                    {isSearchOpen && (
                        <div className="py-3 border-t sm:hidden">
                            <form onSubmit={handleSearch} className="flex">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Busque seu produto..."
                                    className="flex-1 px-4 py-3 border-2 border-gray-200 outline-none rounded-l-md"
                                />
                                <button
                                    type="submit"
                                    className="px-4 py-3 text-white cursor-pointer btn-primary rounded-r-md"
                                >
                                    <Search size={20} />
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>

            {/* Nav */}
            <nav
                className={`bg-primary text-white transition-all duration-300 ${isMenuOpen
                    ? 'block'
                    : 'hidden md:block'
                    }`}
            >
                <div className="container px-4 mx-auto lg:px-6">
                    <ul className="flex flex-col md:flex-row">
                        {['Masculino', 'Feminino', 'Infantil', 'Tênis', 'Roupas', 'Acessórios', 'Esportes', 'Marcas'].map((item) => (
                            <li key={item}>
                                <a
                                    href={`/#`}
                                    className="block px-4 py-4 border-b border-gray-700 hover:bg-gray-700 md:border-b-0"
                                >
                                    {item}
                                </a>
                            </li>
                        ))}
                        <li>
                            <a
                                href="/#"
                                className="block px-4 py-4 font-bold border-b border-gray-700 hover:bg-gray-700 md:border-b-0"
                            >
                                Outros
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>
    );
};