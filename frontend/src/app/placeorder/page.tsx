'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import api from '@/lib/api';

export default function PlaceOrderPage() {
    const router = useRouter();
    const { cartItems, clearCart } = useCartStore((state: any) => state);
    const [shippingAddress, setShippingAddress] = useState<any>(null);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const address = localStorage.getItem('shippingAddress');
        const payment = localStorage.getItem('paymentMethod');
        if (!address) {
            router.push('/shipping');
        } else {
            setShippingAddress(JSON.parse(address));
        }
        if (!payment) {
            router.push('/payment');
        } else {
            setPaymentMethod(payment);
        }
    }, [router]);

    const itemsPrice = cartItems.reduce((acc: number, item: any) => acc + item.qty * item.price, 0);
    const shippingPrice = itemsPrice > 100 ? 0 : 10;
    const taxPrice = Number((0.15 * itemsPrice).toFixed(2));
    const totalPrice = (itemsPrice + shippingPrice + taxPrice).toFixed(2);

    const placeOrderHandler = async () => {
        try {
            setLoading(true);
            setError('');
            const { data } = await api.post('/orders', {
                orderItems: cartItems,
                shippingAddress,
                paymentMethod,
                itemsPrice,
                shippingPrice,
                taxPrice,
                totalPrice,
            });
            clearCart();
            router.push(`/orders/${data._id}`);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Order failed');
        } finally {
            setLoading(false);
        }
    };

    if (!shippingAddress) return null;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-3xl font-bold mb-8">Place Order</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-6 shadow rounded">
                        <h2 className="text-xl font-bold mb-4">Shipping</h2>
                        <p>{shippingAddress.address}, {shippingAddress.city}, {shippingAddress.postalCode}, {shippingAddress.country}</p>
                    </div>

                    <div className="bg-white p-6 shadow rounded">
                        <h2 className="text-xl font-bold mb-4">Payment Method</h2>
                        <p>{paymentMethod}</p>
                    </div>

                    <div className="bg-white p-6 shadow rounded">
                        <h2 className="text-xl font-bold mb-4">Order Items</h2>
                        {cartItems.length === 0 ? <p>Cart is empty</p> : (
                            <div className="space-y-4">
                                {cartItems.map((item: any) => (
                                    <div key={item.product} className="flex items-center justify-between border-b pb-2">
                                        <div className="flex items-center">
                                            <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded mr-4" />
                                            <Link href={`/products/${item.product}`} className="hover:underline">{item.name}</Link>
                                        </div>
                                        <div>
                                            {item.qty} x ${item.price} = ${(item.qty * item.price).toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg h-fit">
                    <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                    <div className="space-y-2 mb-4">
                        <div className="flex justify-between"><span>Items</span><span>${itemsPrice.toFixed(2)}</span></div>
                        <div className="flex justify-between"><span>Shipping</span><span>${shippingPrice.toFixed(2)}</span></div>
                        <div className="flex justify-between"><span>Tax</span><span>${taxPrice.toFixed(2)}</span></div>
                        <div className="flex justify-between font-bold text-lg border-t pt-2"><span>Total</span><span>${totalPrice}</span></div>
                    </div>
                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                    <Button
                        className="w-full"
                        onClick={placeOrderHandler}
                        disabled={cartItems.length === 0 || loading}
                    >
                        {loading ? 'Placing Order...' : 'Place Order'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
