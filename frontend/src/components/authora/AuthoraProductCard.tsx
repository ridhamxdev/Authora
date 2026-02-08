'use client';

import Link from 'next/link';

interface Product {
    id: string;
    name: string;
    image: string;
    price: number;
    countInStock: number;
    category: string;
}

export default function AuthoraProductCard({ product }: { product: Product }) {
    return (
        <Link href={`/products/${product.id}`} className="group block">
            <div className="relative aspect-square bg-[#111] overflow-hidden mb-4">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain p-8 group-hover:scale-105 transition-transform duration-500"
                />

                {product.countInStock === 0 && (
                    <div className="absolute top-4 right-4 bg-white text-black text-[10px] font-bold px-2 py-1 uppercase tracking-widest">
                        Sold Out
                    </div>
                )}
            </div>

            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-white font-medium text-lg leading-tight mb-1 group-hover:underline decoration-1 underline-offset-4">
                        {product.name}
                    </h3>
                    <p className="text-gray-500 text-xs font-mono uppercase tracking-widest">
                        {product.category}
                    </p>
                </div>
                <span className="text-white font-mono">
                    ${product.price ? product.price.toFixed(2) : '0.00'}
                </span>
            </div>
        </Link>
    );
}
