'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cartStore';

interface Product {
    _id: string;
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
                product: product._id,
                name: product.name,
                image: product.image,
                price: product.price,
                countInStock: product.countInStock,
                qty,
            });
            router.push('/cart');
        }
    };

    if (loading) return <div className="text-center py-10">Loading...</div>;
    if (!product) return <div className="text-center py-10">Product not found</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <Button variant="ghost" onClick={() => router.back()} className="mb-4">
                &larr; Go Back
            </Button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-auto rounded-lg shadow-md object-cover"
                    />
                </div>
                <div className="space-y-4">
                    <h1 className="text-3xl font-bold">{product.name}</h1>
                    <div className="flex items-center space-x-2">
                        <span className="text-yellow-500 text-xl">★</span>
                        <span className="text-gray-600">
                            {product.rating} ({product.numReviews} reviews)
                        </span>
                    </div>
                    <p className="text-2xl font-semibold">${product.price}</p>
                    <p className="text-gray-700">{product.description}</p>

                    <div className="border-t border-b py-4 my-4">
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">Status:</span>
                            <span className={product.countInStock > 0 ? 'text-green-600' : 'text-red-600'}>
                                {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                            </span>
                        </div>

                        {product.countInStock > 0 && (
                            <div className="flex justify-between items-center">
                                <span className="font-medium">Qty:</span>
                                <select
                                    value={qty}
                                    onChange={(e) => setQty(Number(e.target.value))}
                                    className="border rounded p-1"
                                >
                                    {[...Array(product.countInStock).keys()].map((x) => (
                                        <option key={x + 1} value={x + 1}>
                                            {x + 1}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>

                    <Button
                        onClick={handleAddToCart}
                        disabled={product.countInStock === 0}
                        className="w-full"
                        size="lg"
                    >
                        {product.countInStock > 0 ? 'Add to Cart' : 'Out of Stock'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
