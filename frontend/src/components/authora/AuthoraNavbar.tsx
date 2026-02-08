'use client';

import Link from 'next/link';
import { Menu, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MagicButton } from '@/components/ui/magic-button';
import { useState, useEffect } from 'react';

export default function AuthoraNavbar() {
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
                    AUTHORA<span className="text-gray-500">.</span>
                </Link>
                <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-300">
                    <Link href="/wishlists" className="hover:text-white transition-colors">Wishlists</Link>
                    <Link href="/notes" className="hover:text-white transition-colors">Notes</Link>
                    <Link href="/chat" className="hover:text-white transition-colors">AI Chat</Link>
                </div>
            </div>

            <div className="flex items-center gap-6 text-white">
                <div className="hidden md:flex items-center gap-4 mr-4">
                    <Link href="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                        Login
                    </Link>
                    <Link href="/register">
                        <MagicButton className="h-8 px-4 text-xs">
                            Sign Up
                        </MagicButton>
                    </Link>
                </div>
                <button className="hover:text-gray-300">
                    <Search className="w-5 h-5" />
                </button>
                <button className="md:hidden">
                    <Menu className="w-6 h-6" />
                </button>
            </div>
        </nav>
    );
}
