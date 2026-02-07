'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

export default function CartPage() {
    const router = useRouter();
    const { cartItems, removeFromCart, addToCart, clearCart } = useCartStore((state: any) => state);

    const checkoutHandler = () => {
        // Check if logged in, if not redirect to login (query param redirect)
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login?redirect=/shipping');
        } else {
            router.push('/shipping');
        }
    };

    const totalItems = cartItems.reduce((acc: number, item: any) => acc + item.qty, 0);
    const totalPrice = cartItems
        .reduce((acc: number, item: any) => acc + item.qty * item.price, 0)
        .toFixed(2);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
            {cartItems.length === 0 ? (
                <div className="text-center py-10">
                    <p className="text-xl mb-4">Your cart is empty</p>
                    <Link href="/">
                        <Button>Go Back</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map((item: any) => (
                            <div
                                key={item.product}
                                className="flex items-center justify-between border-b pb-4"
                            >
                                <div className="flex items-center space-x-4">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-20 h-20 object-cover rounded"
                                    />
                                    <div>
                                        <Link href={`/products/${item.product}`} className="font-medium hover:underline">
                                            {item.name}
                                        </Link>
                                        <p className="text-gray-500">${item.price}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <select
                                        value={item.qty}
                                        onChange={(e) =>
                                            addToCart({ ...item, qty: Number(e.target.value) })
                                        }
                                        className="border rounded p-1"
                                    >
                                        {[...Array(item.countInStock || 10).keys()].map((x) => (
                                            <option key={x + 1} value={x + 1}>
                                                {x + 1}
                                            </option>
                                        ))}
                                    </select>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeFromCart(item.product)}
                                    >
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                        <div className='pt-4'>
                            <Button variant="outline" onClick={clearCart} size="sm">Clear Cart</Button>
                        </div>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-lg h-fit">
                        <h2 className="text-xl font-bold mb-4">Subtotal ({totalItems}) items</h2>
                        <p className="text-2xl font-bold mb-6">${totalPrice}</p>
                        <Button
                            className="w-full"
                            disabled={cartItems.length === 0}
                            onClick={checkoutHandler}
                        >
                            Proceed to Checkout
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
