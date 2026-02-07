'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function OrderPage() {
    const { id } = useParams();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const { data } = await api.get(`/orders/${id}`);
                setOrder(data);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to fetch order');
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    if (loading) return <div className="text-center py-10">Loading...</div>;
    if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
    if (!order) return <div className="text-center py-10">Order not found</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-3xl font-bold mb-4">Order {order._id}</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-6 shadow rounded">
                        <h2 className="text-xl font-bold mb-4">Shipping</h2>
                        <p><strong>Name:</strong> {order.user.name}</p>
                        <p><strong>Email:</strong> {order.user.email}</p>
                        <p><strong>Address:</strong> {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>
                        <div className={`mt-2 p-2 rounded ${order.isDelivered ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {order.isDelivered ? `Delivered on ${order.deliveredAt}` : 'Not Delivered'}
                        </div>
                    </div>

                    <div className="bg-white p-6 shadow rounded">
                        <h2 className="text-xl font-bold mb-4">Payment Method</h2>
                        <p><strong>Method:</strong> {order.paymentMethod}</p>
                        <div className={`mt-2 p-2 rounded ${order.isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {order.isPaid ? `Paid on ${order.paidAt}` : 'Not Paid'}
                        </div>
                    </div>

                    <div className="bg-white p-6 shadow rounded">
                        <h2 className="text-xl font-bold mb-4">Order Items</h2>
                        <div className="space-y-4">
                            {order.orderItems.map((item: any) => (
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
                    </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg h-fit">
                    <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                    <div className="space-y-2 mb-4">
                        <div className="flex justify-between"><span>Items</span><span>${(order.totalPrice - order.shippingPrice - order.taxPrice).toFixed(2)}</span></div>
                        <div className="flex justify-between"><span>Shipping</span><span>${order.shippingPrice.toFixed(2)}</span></div>
                        <div className="flex justify-between"><span>Tax</span><span>${order.taxPrice.toFixed(2)}</span></div>
                        <div className="flex justify-between font-bold text-lg border-t pt-2"><span>Total</span><span>${order.totalPrice.toFixed(2)}</span></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
