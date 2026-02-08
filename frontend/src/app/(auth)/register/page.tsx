'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Github } from 'lucide-react';

const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const router = useRouter();
    const [error, setError] = useState('');
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormData) => {
        try {
            setError('');
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { confirmPassword, ...registerData } = data;
            await api.post('/users', registerData);
            router.push(`/verify-otp?email=${encodeURIComponent(data.email)}`);
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            setError(error.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-black px-4 py-12 sm:px-6 lg:px-8 lg:grid lg:grid-cols-2 lg:gap-8 lg:p-0">
            {/* Left Column: Form */}
            <div className="flex items-center justify-center w-full lg:p-16">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-bold tracking-tight text-white">
                            Create an account
                        </h2>
                        <p className="mt-2 text-sm text-gray-400">
                            Enter your details to get started with Authora
                        </p>
                    </div>

                    <div className="mt-8 space-y-6">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Full Name"
                                    autoComplete="name"
                                    {...register('name')}
                                    className="h-11 bg-transparent border-gray-800 text-white placeholder:text-gray-600 focus-visible:ring-gray-400 focus-visible:border-gray-400"
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                            </div>
                            <div>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    autoComplete="email"
                                    {...register('email')}
                                    className="h-11 bg-transparent border-gray-800 text-white placeholder:text-gray-600 focus-visible:ring-gray-400 focus-visible:border-gray-400"
                                />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                            </div>
                            <div>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Password"
                                    autoComplete="new-password"
                                    {...register('password')}
                                    className="h-11 bg-transparent border-gray-800 text-white placeholder:text-gray-600 focus-visible:ring-gray-400 focus-visible:border-gray-400"
                                />
                                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                            </div>
                            <div>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="Confirm Password"
                                    autoComplete="new-password"
                                    {...register('confirmPassword')}
                                    className="h-11 bg-transparent border-gray-800 text-white placeholder:text-gray-600 focus-visible:ring-gray-400 focus-visible:border-gray-400"
                                />
                                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
                            </div>

                            {error && (
                                <div className="text-red-500 text-sm text-center bg-red-900/10 p-2 rounded border border-red-900/50">
                                    {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full h-11 bg-white text-black hover:bg-gray-200 font-bold tracking-tight"
                            >
                                {isSubmitting ? 'Creating account...' : 'Sign Up with Email'}
                            </Button>
                        </form>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-gray-800" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-black px-2 text-gray-500">Or continue with</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Button variant="outline" className="w-full h-11 bg-transparent border-gray-800 text-white hover:bg-gray-900 hover:text-white border hover:border-gray-700">
                                <Github className="mr-2 h-4 w-4" />
                                Github
                            </Button>
                            <Button variant="outline" className="w-full h-11 bg-transparent border-gray-800 text-white hover:bg-gray-900 hover:text-white border hover:border-gray-700">
                                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                                    <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        fill="#EA4335"
                                    />
                                </svg>
                                Google
                            </Button>
                        </div>

                        <p className="text-center text-sm text-gray-400">
                            Already have an account?{' '}
                            <Link href="/login" className="font-semibold text-white hover:text-gray-300 transition-colors">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Column: Enhanced Visual */}
            <div className="hidden lg:flex flex-col justify-center items-center bg-gradient-to-br from-[#0a0a0a] via-[#111] to-[#0a0a0a] p-16 text-white border-l border-white/10 relative overflow-hidden">
                {/* Subtle grid pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

                {/* Gradient orb effect */}
                <div className="absolute top-1/4 -right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

                <div className="relative z-10 max-w-lg space-y-12 text-center">
                    {/* Logo */}
                    <Link href="/" className="inline-block">
                        <h1 className="font-bold tracking-tighter text-4xl mb-2">AUTHORA.</h1>
                        <div className="font-mono text-xs tracking-widest text-gray-500 uppercase">Enterprise Edition</div>
                    </Link>

                    {/* Main content */}
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 border border-white/10">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h2 className="text-3xl font-bold tracking-tight">
                                Join the future
                            </h2>
                            <p className="text-lg text-gray-400 leading-relaxed max-w-md mx-auto">
                                Start your journey with the next generation of commerce. Simple, powerful, and built for scale.
                            </p>
                        </div>

                        {/* Stats or features */}
                        <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/10">
                            <div className="space-y-1">
                                <div className="text-2xl font-bold">99.9%</div>
                                <div className="text-xs text-gray-500 uppercase tracking-wider">Uptime</div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-2xl font-bold">10k+</div>
                                <div className="text-xs text-gray-500 uppercase tracking-wider">Users</div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-2xl font-bold">24/7</div>
                                <div className="text-xs text-gray-500 uppercase tracking-wider">Support</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
