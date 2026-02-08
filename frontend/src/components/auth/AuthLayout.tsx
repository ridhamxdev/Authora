'use client';

import { ReactNode } from 'react';
import Link from 'next/link';

interface AuthLayoutProps {
    children: ReactNode;
    title: string;
    subtitle: ReactNode;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-black text-white">
            {/* Left Column: Form */}
            <div className="flex items-center justify-center p-8 sm:p-12 lg:p-16">
                <div className="w-full max-w-md space-y-8">
                    <div className="space-y-2 text-center lg:text-left">
                        <Link href="/" className="inline-block mb-8 text-2xl font-bold tracking-tighter">
                            AUTHORA.
                        </Link>
                        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                            {title}
                        </h1>
                        <p className="text-gray-400 text-sm">
                            {subtitle}
                        </p>
                    </div>
                    {children}
                </div>
            </div>

            {/* Right Column: Visual/Testimonial (Hidden on mobile) */}
            <div className="hidden lg:flex flex-col justify-between bg-[#111] p-12 text-white border-l border-white/10 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://cdn.shopify.com/s/files/1/0029/7422/0401/files/POS_Go_Dock_700x.png?v=1664478832')] bg-cover bg-center opacity-20 grayscale mix-blend-screen"></div>
                <div className="relative z-10">
                    {/* Top Content (Logo or Tagline) */}
                    <div className="font-mono text-xs tracking-widest text-gray-500 uppercase">
                        Enterprise Edition
                    </div>
                </div>

                <div className="relative z-10 space-y-6 max-w-lg">
                    <blockquote className="space-y-2">
                        <p className="text-lg font-medium leading-relaxed">
                            &ldquo;This library has saved me countless hours of work and helped me deliver stunning designs to my clients faster than ever before.&rdquo;
                        </p>
                        <footer className="text-sm text-gray-400">
                            Sofia Davis
                        </footer>
                    </blockquote>
                </div>
            </div>
        </div>
    );
}
