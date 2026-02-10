'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import { Plus, Trash2 } from 'lucide-react';

interface Wishlist {
    id: string;
    name: string;
    description: string | null;
    items: any[];
    createdAt: string;
}

export default function WishlistsPage() {
    const router = useRouter();
    const { token, initializeAuth } = useAuthStore();
    const [wishlists, setWishlists] = useState<Wishlist[]>([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newWishlistName, setNewWishlistName] = useState('');
    const [newWishlistDesc, setNewWishlistDesc] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Initialize auth from localStorage first
        initializeAuth();
    }, []);

    useEffect(() => {
        // After auth is initialized, check if we have a token
        if (isLoading) {
            // Check localStorage directly for immediate auth check
            const storedToken = localStorage.getItem('auth_token');
            if (!storedToken) {
                router.push('/login');
                return;
            }
            setIsLoading(false);
            fetchWishlists();
        }
    }, [token, isLoading]);

    const fetchWishlists = async () => {
        try {
            // Use the api instance which has the auth interceptor
            const response = await api.get('/wishlists');
            setWishlists(response.data);
        } catch (error) {
            console.error('Failed to fetch wishlists:', error);
        }
    };

    const createWishlist = async () => {
        try {
            // Use the api instance which has the auth interceptor
            await api.post('/wishlists', {
                name: newWishlistName,
                description: newWishlistDesc
            });
            setShowCreateModal(false);
            setNewWishlistName('');
            setNewWishlistDesc('');
            fetchWishlists();
        } catch (error) {
            console.error('Failed to create wishlist:', error);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold">My Wishlists</h1>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-lg hover:bg-gray-200 transition"
                    >
                        <Plus size={20} />
                        Create Wishlist
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlists.map((wishlist) => (
                        <div
                            key={wishlist.id}
                            onClick={() => router.push(`/wishlists/${wishlist.id}`)}
                            className="bg-zinc-900 rounded-xl p-6 cursor-pointer hover:bg-zinc-800 transition border border-zinc-800"
                        >
                            <h3 className="text-2xl font-semibold mb-2">{wishlist.name}</h3>
                            {wishlist.description && (
                                <p className="text-gray-400 mb-4">{wishlist.description}</p>
                            )}
                            <p className="text-sm text-gray-500">
                                {wishlist.items.length} items
                            </p>
                        </div>
                    ))}
                </div>

                {showCreateModal && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                        <div className="bg-zinc-900 rounded-xl p-8 max-w-md w-full">
                            <h2 className="text-2xl font-bold mb-4">Create Wishlist</h2>
                            <input
                                type="text"
                                placeholder="Wishlist Name"
                                value={newWishlistName}
                                onChange={(e) => setNewWishlistName(e.target.value)}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 mb-4"
                            />
                            <textarea
                                placeholder="Description (optional)"
                                value={newWishlistDesc}
                                onChange={(e) => setNewWishlistDesc(e.target.value)}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 mb-4 h-24"
                            />
                            <div className="flex gap-4">
                                <button
                                    onClick={createWishlist}
                                    className="flex-1 bg-white text-black px-6 py-3 rounded-lg hover:bg-gray-200 transition"
                                >
                                    Create
                                </button>
                                <button
                                    onClick={() => setShowCreateModal(false)}
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
