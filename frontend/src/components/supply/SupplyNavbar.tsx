'use client';

import Link from 'next/link';
import { ShoppingCart, Menu, Search } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

export default function SupplyNavbar() {
    const cartItems = useCartStore((state: any) => state.cartItems);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4 flex items-center justify-between",
                scrolled ? "bg-black/80 backdrop-blur-md border-b border-white/10" : "bg-transparent"
            )}
        >
            <div className="flex items-center gap-8">
                <Link href="/" className="text-white text-2xl font-bold tracking-tighter">
                    SUPPLY<span className="text-gray-500">.</span>
                </Link>
                <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-300">
                    <Link href="/shop" className="hover:text-white transition-colors">Hardware</Link>
                    <Link href="/shop" className="hover:text-white transition-colors">Supplies</Link>
                    <Link href="/shop" className="hover:text-white transition-colors">Collections</Link>
                </div>
            </div>

            <div className="flex items-center gap-6 text-white">
                <button className="hover:text-gray-300">
                    <Search className="w-5 h-5" />
                </button>
                <Link href="/cart" className="relative hover:text-gray-300">
                    <ShoppingCart className="w-5 h-5" />
                    {cartItems.length > 0 && (
                        <span className="absolute -top-2 -right-2 bg-green-500 text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                            {cartItems.length}
                        </span>
                    )}
                </Link>
                <button className="md:hidden">
                    <Menu className="w-6 h-6" />
                </button>
            </div>
        </nav>
    );
}
