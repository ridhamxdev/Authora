'use client';

import { useState, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const otpSchema = z.object({
    otp: z.string().length(6, 'OTP must be 6 digits'),
});

type OtpFormData = z.infer<typeof otpSchema>;

function VerifyOtpContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email');
    const [error, setError] = useState('');
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<OtpFormData>({
        resolver: zodResolver(otpSchema),
    });

    if (!email) {
        return <div className="min-h-screen flex items-center justify-center">Missing email parameter</div>;
    }

    const onSubmit = async (data: OtpFormData) => {
        try {
            setError('');
            const response = await api.post('/users/verify-otp', {
                email,
                otp: data.otp,
            });
            localStorage.setItem('token', response.data.access_token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            router.push('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Verification failed');
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 bg-white p-8 shadow rounded-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                        Verify your email
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        We sent a code to <span className="font-medium text-gray-900">{email}</span>
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="otp" className="block text-sm font-medium text-gray-700">Enter OTP</label>
                            <Input
                                id="otp"
                                type="text"
                                maxLength={6}
                                {...register('otp')}
                                className="mt-1 text-center tracking-widest text-lg"
                            />
                            {errors.otp && <p className="text-red-500 text-xs mt-1">{errors.otp.message}</p>}
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
                            {error}
                        </div>
                    )}

                    <div>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full"
                        >
                            {isSubmitting ? 'Verifying...' : 'Verify'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function VerifyOtpPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <VerifyOtpContent />
        </Suspense>
    );
}
