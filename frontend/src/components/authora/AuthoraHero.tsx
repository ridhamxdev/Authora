'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AuthoraHero() {
    return (
        <section className="relative h-screen w-full bg-black flex items-center justify-center overflow-hidden">
            {/* Abstract Background (Placeholder for video) */}
            <div className="absolute inset-0 z-0 opacity-40">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-800 via-black to-black" />
                <div className="w-full h-full bg-[url('https://cdn.shopify.com/s/files/1/0020/5914/1187/files/SH_Supplies_Hero_Desktop_1400x.jpg?v=1613586616')] bg-cover bg-center" />
            </div>

            <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-5xl md:text-8xl font-bold text-white tracking-tighter mb-6"
                >
                    THE FUTURE OF <br /> COMMERCE.
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="text-gray-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto"
                >
                    Premium hardware designed for modern retail. Built to last, designed to perform.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                    <Link href="/shop">
                        <Button size="lg" className="bg-white text-black hover:bg-gray-200 rounded-full px-8 h-14 text-base font-semibold">
                            Shop Hardware <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </Link>
                    <Link href="/shop">
                        <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-full px-8 h-14 text-base font-semibold">
                            View Collections
                        </Button>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
