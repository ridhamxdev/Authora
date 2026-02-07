'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const { register, handleSubmit, setValue } = useForm();
    const router = useRouter();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/users/profile');
                setUser(res.data);
                setValue('name', res.data.name);
                setValue('email', res.data.email);
            } catch (err) {
                // If 401, redirect to login
                router.push('/login');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [router, setValue]);

    const onSubmit = async (data: any) => {
        try {
            setMessage('');
            const res = await api.put('/users/profile', data);
            setUser(res.data);
            setMessage('Profile updated successfully');
            localStorage.setItem('user', JSON.stringify(res.data));
        } catch (err: any) {
            setMessage(err.response?.data?.message || 'Update failed');
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
            <h1 className="text-2xl font-bold mb-6">Profile</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <Input {...register('name')} className="mt-1" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <Input {...register('email')} className="mt-1" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">New Password (optional)</label>
                    <Input type="password" {...register('password')} className="mt-1" placeholder="Leave blank to keep current" />
                </div>
                <Button type="submit" className="w-full">Update Profile</Button>
            </form>
            {message && <p className="mt-4 text-center text-sm font-medium text-green-600">{message}</p>}

            <div className="mt-6 border-t pt-4">
                <Button variant="outline" className="w-full" onClick={() => router.push('/')}>Go Home</Button>
            </div>
        </div>
    );
}
