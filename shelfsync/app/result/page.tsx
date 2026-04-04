'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { demoStore, Product } from '@/data/store';
import { MapPin, Navigation } from 'lucide-react';
import Link from 'next/link';

function ResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get('productId');
  const { verified, userId, currentStore } = useAppStore();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (!verified || !userId || !currentStore) {
      router.push('/store');
      return;
    }

    if (productId) {
      const found = demoStore.products.find((p) => p.id === productId);
      setProduct(found || null);
    }
  }, [verified, userId, currentStore, productId, router]);

  if (!product) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <p className="text-center text-gray-600">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <Navigation className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {product.name}
            </h1>
            <p className="text-gray-600">Here's where to find it</p>
          </div>

          {/* Directions */}
          <div className="space-y-6 mb-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Location Details
                  </h3>
                  <div className="space-y-1 text-gray-700">
                    <p>
                      <span className="font-medium">Section:</span> {product.section}
                    </p>
                    <p>
                      <span className="font-medium">Aisle:</span> {product.aisle}
                    </p>
                    <p>
                      <span className="font-medium">Shelf:</span> {product.shelf}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-6 rounded-lg border-2 border-green-200">
              <h3 className="font-semibold text-green-900 mb-2">
                Directions
              </h3>
              <ol className="list-decimal list-inside space-y-1 text-green-800">
                <li>Head to the {product.section} section</li>
                <li>Look for Aisle {product.aisle}</li>
                <li>Check the {product.shelf} shelf</li>
              </ol>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link
              href={`/confirm?productId=${productId}`}
              className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              I Found It!
            </Link>
            <p className="mt-4 text-sm text-gray-500">
              Confirm to earn 10 points
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <p className="text-center text-gray-600">Loading...</p>
        </div>
      </main>
    }>
      <ResultContent />
    </Suspense>
  );
}
