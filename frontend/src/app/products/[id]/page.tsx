'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cartStore';
import AuthoraNavbar from '@/components/authora/AuthoraNavbar';
import { Separator } from '@/components/ui/separator';

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

export default function ProductPage() {
    const { id } = useParams();
    const router = useRouter();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [qty, setQty] = useState(1);
    const addToCart = useCartStore((state: any) => state.addToCart);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await api.get(`/products/${id}`);
                setProduct(data);
            } catch (err) {
                console.error('Failed to fetch product', err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id]);

    const handleAddToCart = () => {
        if (product) {
            addToCart({
                product: product.id,
                name: product.name,
                image: product.image,
                price: product.price,
                countInStock: product.countInStock,
                qty,
            });
            router.push('/cart');
        }
    };

    if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;
    if (!product) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Product not found</div>;

    return (
        <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
            <AuthoraNavbar />

            <div className="max-w-[1400px] mx-auto pt-32 px-6 pb-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">

                    {/* Left: Images (Sticky-ish implementation or simple stack for now) */}
                    <div className="space-y-4">
                        <div className="aspect-square bg-[#111] w-full flex items-center justify-center p-12">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-contain"
                            />
                        </div>
                        {/* Placeholder for more images if they existed */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="aspect-square bg-[#111] opacity-50"></div>
                            <div className="aspect-square bg-[#111] opacity-50"></div>
                        </div>
                    </div>

                    {/* Right: Details (Sticky) */}
                    <div className="md:sticky md:top-32 h-fit space-y-8">
                        <div>
                            <span className="text-green-500 font-mono text-sm uppercase tracking-widest mb-2 block">
                                {product.brand || 'Authora'}
                            </span>
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4 leading-tight">
                                {product.name}
                            </h1>
                            <div className="text-2xl font-mono">
                                ${product.price.toFixed(2)}
                            </div>
                        </div>

                        <Separator className="bg-white/10" />

                        <div className="prose prose-invert max-w-none text-gray-400">
                            <p>{product.description}</p>
                            <ul className="list-disc pl-4 space-y-1 mt-4 font-mono text-sm">
                                <li>Premium build quality</li>
                                <li>Industry standard reliability</li>
                                <li>2-year warranty included</li>
                            </ul>
                        </div>

                        <div className="bg-[#111] p-6 border border-white/10 rounded-sm">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm font-mono text-gray-400">STATUS</span>
                                <span className={product.countInStock > 0 ? "text-green-500 font-bold" : "text-red-500 font-bold"}>
                                    {product.countInStock > 0 ? 'IN STOCK' : 'SOLD OUT'}
                                </span>
                            </div>

                            {product.countInStock > 0 && (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <label className="text-sm font-mono text-gray-400">QUANTITY</label>
                                        <select
                                            value={qty}
                                            onChange={(e) => setQty(Number(e.target.value))}
                                            className="bg-black border border-white/20 text-white rounded-none px-3 py-2 outline-none focus:border-white"
                                        >
                                            {[...Array(Math.min(product.countInStock, 10)).keys()].map(x => (
                                                <option key={x + 1} value={x + 1}>{x + 1}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <Button
                                        onClick={handleAddToCart}
                                        className="w-full h-14 bg-white text-black hover:bg-gray-200 rounded-full text-lg font-bold tracking-tight"
                                    >
                                        Add to Cart - ${(product.price * qty).toFixed(2)}
                                    </Button>

                                    <p className="text-center text-xs text-gray-500 font-mono mt-2">
                                        Free shipping on standard orders.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
