'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { Search } from 'lucide-react';
import { Product } from '@/data/store';

export default function SearchPage() {
  const router = useRouter();
  const { verified, userId, currentStore, points } = useAppStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!verified || !userId || !currentStore) {
      router.push('/store');
    }
  }, [verified, userId, currentStore, router]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || !currentStore || !userId) return;

    setIsSearching(true);
    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(query)}&storeId=${currentStore}&userId=${userId}`
      );
      const data = await response.json();

      if (data.success) {
        setResults(data.products);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectProduct = (product: Product) => {
    router.push(`/result?productId=${product.id}`);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Header with Points */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Find a Product</h1>
          <div className="bg-blue-600 text-white px-4 py-2 rounded-lg">
            <span className="font-semibold">{points} points</span>
          </div>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for a product..."
              className="w-full pl-12 pr-4 py-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching || !query.trim()}
            className="mt-4 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400"
          >
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </form>

        {/* Results */}
        {results.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Results ({results.length})
            </h2>
            <div className="grid gap-4">
              {results.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleSelectProduct(product)}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-left w-full"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {product.name}
                  </h3>
                  <div className="flex gap-4 text-sm text-gray-600">
                    <span>Aisle: {product.aisle}</span>
                    <span>|</span>
                    <span>Shelf: {product.shelf}</span>
                    <span>|</span>
                    <span>{product.section}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {query && results.length === 0 && !isSearching && (
          <div className="text-center text-gray-500 py-8">
            No products found. Try a different search term.
          </div>
        )}
      </div>
    </main>
  );
}
