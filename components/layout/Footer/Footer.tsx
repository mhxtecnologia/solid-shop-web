'use client';

import React from 'react';

export const Footer: React.FC = () => {
    return (
        <footer className="bg-primary text-white">
            <div className="border-t border-white border-opacity-20">
                <div className="container mx-auto px-4 lg:px-6 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">

                        {/* Copyright */}
                        <div className="text-sm text-gray-300">
                            <span>© 2025 Stefanini Brasil. Todos os direitos reservados.</span>
                        </div>

                        {/* Legal Links */}
                        <div className="flex flex-wrap justify-center md:justify-end gap-4 text-xs">
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
                                    className="text-gray-300 hover:text-white transition-colors"
                                >
                                    {legal}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Bottom Bar (opcional) */}
            <div className="md:hidden bg-white bg-opacity-10">
                <div className="container mx-auto px-4 py-3">
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