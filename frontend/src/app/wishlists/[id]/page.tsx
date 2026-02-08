'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import axios from 'axios';
import { Plus, Trash2, ExternalLink, Star } from 'lucide-react';
import Image from 'next/image';

interface WishlistItem {
    id: string;
    name: string;
    price: number | null;
    currency: string;
    image: string | null;
    platform: string;
    productUrl: string;
    notes: string | null;
    priority: number;
    isPurchased: boolean;
}

export default function WishlistDetailPage() {
    const router = useRouter();
    const params = useParams();
    const { token } = useAuthStore();
    const [wishlist, setWishlist] = useState<any>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [productUrl, setProductUrl] = useState('');
    const [notes, setNotes] = useState('');
    const [priority, setPriority] = useState(3);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!token) {
            router.push('/login');
            return;
        }
        fetchWishlist();
    }, [token, params.id]);

    const fetchWishlist = async () => {
        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/wishlists/${params.id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setWishlist(response.data);
        } catch (error) {
            console.error('Failed to fetch wishlist:', error);
        }
    };

    const addItem = async () => {
        setLoading(true);
        try {
            await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/wishlists/${params.id}/items`,
                { productUrl, notes, priority },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setShowAddModal(false);
            setProductUrl('');
            setNotes('');
            setPriority(3);
            fetchWishlist();
        } catch (error) {
            console.error('Failed to add item:', error);
            alert('Failed to add item. Please check the URL and try again.');
        } finally {
            setLoading(false);
        }
    };

    const deleteItem = async (itemId: string) => {
        try {
            await axios.delete(
                `${process.env.NEXT_PUBLIC_API_URL}/wishlists/items/${itemId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchWishlist();
        } catch (error) {
            console.error('Failed to delete item:', error);
        }
    };

    const markAsPurchased = async (itemId: string) => {
        try {
            await axios.put(
                `${process.env.NEXT_PUBLIC_API_URL}/wishlists/items/${itemId}`,
                { isPurchased: true },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchWishlist();
        } catch (error) {
            console.error('Failed to mark as purchased:', error);
        }
    };

    if (!wishlist) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <button
                            onClick={() => router.push('/wishlists')}
                            className="text-gray-400 hover:text-white mb-2"
                        >
                            ← Back to Wishlists
                        </button>
                        <h1 className="text-4xl font-bold">{wishlist.name}</h1>
                        {wishlist.description && (
                            <p className="text-gray-400 mt-2">{wishlist.description}</p>
                        )}
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-lg hover:bg-gray-200 transition"
                    >
                        <Plus size={20} />
                        Add Item
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlist.items.map((item: WishlistItem) => (
                        <div
                            key={item.id}
                            className={`bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 ${item.isPurchased ? 'opacity-50' : ''
                                }`}
                        >
                            {item.image && (
                                <div className="relative h-48 bg-zinc-800">
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            )}
                            <div className="p-4">
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="font-semibold text-lg line-clamp-2">{item.name}</h3>
                                    <div className="flex gap-1">
                                        {[...Array(item.priority)].map((_, i) => (
                                            <Star key={i} size={16} className="fill-yellow-500 text-yellow-500" />
                                        ))}
                                    </div>
                                </div>
                                {item.price && (
                                    <p className="text-2xl font-bold mb-2">
                                        {item.currency} {item.price.toFixed(2)}
                                    </p>
                                )}
                                <p className="text-sm text-gray-400 mb-2">{item.platform}</p>
                                {item.notes && (
                                    <p className="text-sm text-gray-300 mb-4 italic">{item.notes}</p>
                                )}
                                <div className="flex gap-2">
                                    <a
                                        href={item.productUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 flex items-center justify-center gap-2 bg-zinc-800 px-4 py-2 rounded-lg hover:bg-zinc-700 transition text-sm"
                                    >
                                        <ExternalLink size={16} />
                                        View
                                    </a>
                                    {!item.isPurchased && (
                                        <button
                                            onClick={() => markAsPurchased(item.id)}
                                            className="flex-1 bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm"
                                        >
                                            Purchased
                                        </button>
                                    )}
                                    <button
                                        onClick={() => deleteItem(item.id)}
                                        className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {showAddModal && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                        <div className="bg-zinc-900 rounded-xl p-8 max-w-md w-full">
                            <h2 className="text-2xl font-bold mb-4">Add Item</h2>
                            <input
                                type="url"
                                placeholder="Product URL (Amazon, Flipkart, etc.)"
                                value={productUrl}
                                onChange={(e) => setProductUrl(e.target.value)}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 mb-4"
                            />
                            <textarea
                                placeholder="Notes (optional)"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 mb-4 h-24"
                            />
                            <div className="mb-4">
                                <label className="block text-sm mb-2">Priority (1-5 stars)</label>
                                <input
                                    type="range"
                                    min="1"
                                    max="5"
                                    value={priority}
                                    onChange={(e) => setPriority(parseInt(e.target.value))}
                                    className="w-full"
                                />
                                <div className="flex gap-1 mt-2">
                                    {[...Array(priority)].map((_, i) => (
                                        <Star key={i} size={20} className="fill-yellow-500 text-yellow-500" />
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <button
                                    onClick={addItem}
                                    disabled={loading || !productUrl}
                                    className="flex-1 bg-white text-black px-6 py-3 rounded-lg hover:bg-gray-200 transition disabled:opacity-50"
                                >
                                    {loading ? 'Adding...' : 'Add Item'}
                                </button>
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 bg-zinc-800 px-6 py-3 rounded-lg hover:bg-zinc-700 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
