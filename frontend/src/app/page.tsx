'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Image from 'next/image';

interface Product {
  _id: string;
  name: string;
  image: string;
  description: string;
  brand: string;
  category: string;
  price: number;
  countInStock: number;
  rating: number;
  numReviews: number;
}

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await api.get('/users/profile');
        setUser(data);
      } catch (err) {
        // Not logged in or expired
        setUser(null);
      }
    };
    fetchUser();

    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/products');
        setProducts(data);
      } catch (err) {
        console.error('Failed to fetch products', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const logoutHandler = async () => {
    try {
      await api.post('/users/logout');
      // localStorage.removeItem('token');
      // localStorage.removeItem('user');
      router.push('/login');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gray-50 text-black">
      <header className="w-full max-w-7xl flex items-center justify-between py-6 mb-8 border-b border-gray-200">
        <h1 className="text-2xl font-bold font-mono">Authora</h1>
        <div>
          {user ? (
            <div className="flex gap-4 items-center">
              <span className="text-sm font-medium">Welcome, {user.name}</span>
              <Button onClick={() => router.push('/profile')} variant="ghost" size="sm">Profile</Button>
              <Button onClick={logoutHandler} variant="secondary" size="sm">Logout</Button>
            </div>
          ) : (
            <div className="flex gap-4">
              <Link href="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Register</Button>
              </Link>
            </div>
          )}
        </div>
      </header>

      <section className="w-full max-w-7xl">
        <h2 className="text-3xl font-bold mb-8">Latest Products</h2>
        {loading ? (
          <p>Loading products...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <div key={product._id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden flex flex-col">
                <div className="relative h-48 w-full bg-gray-100">
                  {/* Use optimized image if you have configured domains, using standard img in dev for simplicity if external */}
                  <img src={product.image} alt={product.name} className="object-cover h-full w-full" />
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <Link href={`/products/${product._id}`} className="hover:underline">
                    <h3 className="text-lg font-semibold mb-2 line-clamp-2" title={product.name}>{product.name}</h3>
                  </Link>
                  <div className="flex items-center mb-2">
                    <span className="text-yellow-500 mr-1">★</span>
                    <span className="text-sm text-gray-600">{product.rating} ({product.numReviews} review(s))</span>
                  </div>
                  <p className="text-xl font-bold mt-auto">${product.price}</p>
                  <Button className="mt-4 w-full" variant="secondary">View Details</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
