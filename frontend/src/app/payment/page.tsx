'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function PaymentPage() {
    const router = useRouter();
    const [paymentMethod, setPaymentMethod] = useState('PayPal');

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        localStorage.setItem('paymentMethod', paymentMethod);
        router.push('/placeorder');
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 bg-white p-8 shadow rounded-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                        Payment Method
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={onSubmit}>
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <input
                                id="PayPal"
                                name="paymentMethod"
                                type="radio"
                                value="PayPal"
                                checked={paymentMethod === 'PayPal'}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            />
                            <label htmlFor="PayPal" className="ml-3 block text-sm font-medium leading-6 text-gray-900">
                                PayPal or Credit Card
                            </label>
                        </div>
                    </div>
                    <div>
                        <Button type="submit" className="w-full">Continue</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
