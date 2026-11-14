import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import StoreProvider from '@/redux/StoreProvider';
import { Toaster } from 'react-hot-toast';
import Footer from '@/components/shared/Footer';
import Navbar from '@/components/shared/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FreshCart | E-Commerce Store',
  description: 'Modern E-Commerce application built with Next.js, TypeScript, Tailwind CSS, and Redux Toolkit',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-900 antialiased`}>
        <StoreProvider>
          <Navbar/>
          {children}
          <Footer/>
          </StoreProvider>
        <Toaster position="bottom-right" reverseOrder={false} /> {/* 👈 وضع الـ Toaster هنا */}
      </body>
    </html>
  );
}
