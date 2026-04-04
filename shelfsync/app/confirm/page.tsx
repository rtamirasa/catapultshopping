'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { Camera, CheckCircle } from 'lucide-react';

function ConfirmContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get('productId');
  const { verified, userId, currentStore, addPoints } = useAppStore();
  const [photoData, setPhotoData] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!verified || !userId || !currentStore) {
      router.push('/store');
    }
  }, [verified, userId, currentStore, router]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoData(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirm = async () => {
    if (!userId || !productId || !currentStore) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          productId,
          storeId: currentStore,
          photoData,
        }),
      });

      const data = await response.json();

      if (data.success) {
        addPoints(data.pointsAwarded);
        setSuccess(true);
        setTimeout(() => {
          router.push('/rewards');
        }, 2000);
      }
    } catch (error) {
      console.error('Confirm error:', error);
      alert('Failed to confirm. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <CheckCircle className="w-24 h-24 text-green-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Great Job!
          </h1>
          <p className="text-xl text-gray-600">
            You earned 10 points
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <Camera className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Confirm You Found It
            </h1>
            <p className="text-gray-600">
              Upload a photo to earn 10 points
            </p>
          </div>

          {/* Photo Upload */}
          <div className="mb-8">
            <label className="block mb-4">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-600 transition-colors">
                {photoData ? (
                  <img
                    src={photoData}
                    alt="Product"
                    className="max-h-64 mx-auto rounded"
                  />
                ) : (
                  <div>
                    <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">
                      Click to upload a photo (optional)
                    </p>
                  </div>
                )}
              </div>
            </label>
          </div>

          {/* Confirm Button */}
          <button
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400"
          >
            {isSubmitting ? 'Confirming...' : 'Confirm & Earn Points'}
          </button>
        </div>
      </div>
    </main>
  );
}

export default function ConfirmPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <p className="text-center text-gray-600">Loading...</p>
        </div>
      </main>
    }>
      <ConfirmContent />
    </Suspense>
  );
}
