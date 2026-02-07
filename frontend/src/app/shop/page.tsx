'use client';

import { useEffect, useState, Suspense } from 'react';
import api from '@/lib/api';
import SupplyNavbar from '@/components/supply/SupplyNavbar';
import SupplyProductCard from '@/components/supply/SupplyProductCard';
import { useSearchParams } from 'next/navigation';

interface Product {
    id: string;
    name: string;
    image: string;
    description: string;
    brand: string;
    category: string;
    price: number;
    countInStock: number;
    rating: number;
    numReviews: number;
}

function ShopContent() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();
    const query = searchParams.get('search');
    const category = searchParams.get('cat');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await api.get('/products');
                let filtered = data;

                // Filter by Search Query
                if (query) {
                    const lowerQuery = query.toLowerCase();
                    filtered = filtered.filter((p: Product) =>
                        p.name.toLowerCase().includes(lowerQuery) ||
                        p.description.toLowerCase().includes(lowerQuery)
                    );
                }

                // Filter by Category (simple mock implementation)
                if (category) {
                    // In a real app, this would be a backend filter or more robust frontend filter
                    // For now, we just pass everything or filter strictly if needed
                }

                setProducts(filtered);
            } catch (err) {
                console.error('Failed to fetch products', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [query, category]);

    return (
        <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
            <SupplyNavbar />

            <div className="pt-32 pb-20 px-6 max-w-[1600px] mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-white/10 pb-8">
                    <div>
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">
                            {query ? `SEARCH: ${query}` : 'ALL PRODUCTS'}
                        </h1>
                        <p className="text-gray-400 max-w-xl text-lg">
                            Premium hardware and accessories for the modern automated enterprise.
                        </p>
                    </div>
                    <div className="text-right hidden md:block">
                        <span className="text-gray-500 font-mono text-sm uppercase tracking-widest block mb-1">
                            {products.length} Items
                        </span>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="aspect-square bg-[#111] mb-4" />
                                <div className="h-6 bg-[#111] w-2/3 mb-2" />
                                <div className="h-4 bg-[#111] w-1/4" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                        {products.length === 0 ? (
                            <div className="col-span-full py-20 text-center border border-white/10 rounded-lg">
                                <p className="text-2xl font-bold mb-2">No products found.</p>
                                <p className="text-gray-500">Try adjusting your search or filters.</p>
                            </div>
                        ) : (
                            products.map((product) => (
                                <SupplyProductCard key={product.id} product={product} />
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function ShopPage() {
    return (
        <Suspense fallback={<div className="bg-black min-h-screen"></div>}>
            <ShopContent />
        </Suspense>
    );
}
