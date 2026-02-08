'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

export function AuthInitializer() {
    const { initializeAuth } = useAuthStore();

    useEffect(() => {
        // Initialize auth from cookies on app load
        initializeAuth();
    }, [initializeAuth]);

    return null;
}
