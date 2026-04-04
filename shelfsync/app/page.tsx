'use client';

import Link from 'next/link';
import { ShoppingCart, MapPin, Award } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">
            Shelf<span className="text-blue-600">Sync</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Never wander lost in grocery stores again
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <MapPin className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Find Products Fast</h3>
            <p className="text-gray-600">
              Get exact aisle and shelf locations for any product
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <ShoppingCart className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Search & Navigate</h3>
            <p className="text-gray-600">
              Search for items and get turn-by-turn directions
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <Award className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Earn Rewards</h3>
            <p className="text-gray-600">
              Get points for every product you find
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/verify"
            className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Get Started
          </Link>
          <p className="mt-4 text-sm text-gray-500">
            Verify with World ID to begin
          </p>
        </div>
      </div>
    </main>
  );
}
