'use client';

import React from 'react';

export const Footer: React.FC = () => {
    return (
        <footer className="text-white bg-primary">
            <div className="border-t border-white border-opacity-20">
                <div className="container px-4 py-6 mx-auto lg:px-6">
                    <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">

                        {/* Copyright */}
                        <div className="text-sm text-gray-300">
                            <span>© 2025 Solid Brasil. Todos os direitos reservados.</span>
                        </div>

                        {/* Legal Links */}
                        <div className="flex flex-wrap justify-center gap-4 text-xs md:justify-end">
                            {[
                                'Política de Privacidade',
                                'Termos de Uso',
                                'Código de Ética',
                                'LGPD',
                                'Cookies'
                            ].map((legal) => (
                                <a
                                    key={legal}
                                    href={`/#`}
                                    className="text-gray-300 transition-colors hover:text-white"
                                >
                                    {legal}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Bottom Bar (opcional) */}
            <div className="bg-white md:hidden bg-opacity-10">
                <div className="container px-4 py-3 mx-auto">
                    <div className="flex justify-center space-x-6">
                        <a href="/contato" className="text-xs text-gray-300 hover:text-white">Contato</a>
                        <a href="/carreiras" className="text-xs text-gray-300 hover:text-white">Carreiras</a>
                        <a href="/suporte" className="text-xs text-gray-300 hover:text-white">Suporte</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};