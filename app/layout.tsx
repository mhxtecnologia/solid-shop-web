import type { Metadata } from "next";

import { Geist, Geist_Mono } from "next/font/google";

import "../styles/globals.css";

import { Providers } from '@app/providers';
import { FloatingCartSummary } from '@components/layout/FloatingCartSummary';

import { Header } from "@components/layout/Header/Header";

import { Footer } from "@components/layout/Footer";

import { getSessionEmail } from '@/lib/server/session';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Solid Shop',
  description: 'E-commerce application',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userEmail = await getSessionEmail();

  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-background text-foreground`}
      >
        <Providers>
          <Header userEmail={userEmail} />
          <main className="container flex-1 px-4 pt-6 mx-auto lg:px-6">{children}</main>
          <Footer />
          <FloatingCartSummary />
        </Providers>
      </body>
    </html>
  );
}
