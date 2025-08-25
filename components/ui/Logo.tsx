import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LogoProps {
    className?: string;
    href?: string;
    alt?: string;
}

export const Logo: React.FC<LogoProps> = ({ 
    className,
    href = '/',
    alt = 'Logo da Loja'
}) => {
    const LogoImage = (
        <>
            {/* mobile */}
            {/* <Image
                src="/images/stefanini_logo-1.webp"
                alt={alt}
                width={100}
                height={24}
                className={cn(
                    'object-contain sm:hidden',
                    className
                )}
                priority
            /> */}
            
            {/* tablet */}
            <Image
                src="/images/stefanini_logo-1.webp"
                alt={alt}
                width={140}
                height={32}
                className={cn(
                    'object-contain hidden sm:block lg:hidden',
                    className
                )}
                priority
            />
            
            {/* desktop */}
            <Image
                src="/images/stefanini_logo-1.webp"
                alt={alt}
                width={180}
                height={40}
                className={cn(
                    'object-contain hidden lg:block',
                    className
                )}
                priority
            />
        </>
    );

    if (href) {
        return (
            <a 
                href={href}
                className="flex items-center focus:outline-none focus:ring-2 focus:ring-netshoes-red focus:ring-offset-2 rounded-sm"
                aria-label="Ir para página inicial"
            >
                {LogoImage}
            </a>
        );
    }

    return <div className="flex items-center">{LogoImage}</div>;
};