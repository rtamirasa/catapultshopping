'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { Award, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function RewardsPage() {
  const router = useRouter();
  const { verified, userId, points } = useAppStore();

  useEffect(() => {
    if (!verified || !userId) {
      router.push('/verify');
    }
  }, [verified, userId, router]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <Award className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Your Rewards
          </h1>
          <p className="text-lg text-gray-600">
            Keep finding products to earn more points!
          </p>
        </div>

        {/* Points Display */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-8 text-center mb-8">
          <div className="text-white">
            <p className="text-lg mb-2">Total Points</p>
            <p className="text-6xl font-bold mb-4">{points}</p>
            <div className="flex items-center justify-center gap-2">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm">Keep shopping to earn more!</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <p className="text-gray-600 mb-2">Products Found</p>
            <p className="text-3xl font-bold text-gray-900">{Math.floor(points / 10)}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <p className="text-gray-600 mb-2">Points Per Find</p>
            <p className="text-3xl font-bold text-gray-900">10</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <p className="text-gray-600 mb-2">Your Rank</p>
            <p className="text-3xl font-bold text-gray-900">
              {points >= 50 ? 'Gold' : points >= 20 ? 'Silver' : 'Bronze'}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="text-center space-y-4">
          <Link
            href="/search"
            className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Find More Products
          </Link>
          <p className="text-sm text-gray-500">
            Each product found = 10 points
          </p>
        </div>

        {/* Info Box */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-2">
            How to Earn More Points
          </h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-600">•</span>
              <span>Search for products in your selected store</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600">•</span>
              <span>Follow the aisle directions to find items</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600">•</span>
              <span>Confirm you found the product (optional: upload a photo)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600">•</span>
              <span>Earn 10 points for each verified find!</span>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
