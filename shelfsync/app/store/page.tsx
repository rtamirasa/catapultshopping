'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { stores } from '@/data/store';
import { logEvent } from '@/lib/db';
import { Store, MapPin } from 'lucide-react';

export default function StorePage() {
  const router = useRouter();
  const { verified, userId, setCurrentStore } = useAppStore();

  useEffect(() => {
    if (!verified || !userId) {
      router.push('/verify');
    }
  }, [verified, userId, router]);

  const handleSelectStore = async (storeId: string) => {
    setCurrentStore(storeId);

    if (userId) {
      await logEvent({
        userId,
        type: 'store_selected',
        storeId,
      });
    }

    router.push('/search');
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <Store className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Select a Store
          </h1>
          <p className="text-lg text-gray-600">
            Choose where you're shopping today
          </p>
        </div>

        <div className="grid gap-4">
          {stores.map((store) => (
            <button
              key={store.id}
              onClick={() => handleSelectStore(store.id)}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-left w-full"
            >
              <div className="flex items-center gap-4">
                <MapPin className="w-8 h-8 text-blue-600" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {store.name}
                  </h3>
                  <p className="text-gray-600">{store.location}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {store.products.length} products available
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
