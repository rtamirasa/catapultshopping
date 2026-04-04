'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { ShieldCheck } from 'lucide-react';

export default function VerifyPage() {
  const router = useRouter();
  const { setUserId, setVerified, setPoints } = useAppStore();
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSkip = async () => {
    setIsVerifying(true);
    try {
      // Create a demo user for testing
      const demoUserId = `demo-${Date.now()}`;
      const response = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proof: 'demo-proof',
          nullifier_hash: demoUserId,
          verification_level: 'demo',
        }),
      });

      const data = await response.json();

      if (data.success) {
        setUserId(data.userId);
        setVerified(true);
        setPoints(data.points);
        router.push('/store');
      } else {
        alert('Verification failed. Please try again.');
      }
    } catch (error) {
      console.error('Verification error:', error);
      alert('Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <ShieldCheck className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Verify Your Identity
          </h1>
          <p className="text-lg text-gray-600">
            Confirm you're human with World ID to start earning rewards
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 text-center space-y-4">
          {/* World ID Widget - Coming Soon */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <p className="text-gray-600 mb-4">
              World ID integration coming soon!
            </p>
            <button
              disabled
              className="bg-gray-300 text-gray-500 px-8 py-4 rounded-lg text-lg font-semibold cursor-not-allowed"
            >
              Verify with World ID (Coming Soon)
            </button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or for testing</span>
            </div>
          </div>

          {/* Skip Button for Development */}
          <button
            onClick={handleSkip}
            disabled={isVerifying}
            className="w-full bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400"
          >
            {isVerifying ? 'Creating Demo Account...' : 'Skip for Now (Demo Mode)'}
          </button>

          <p className="mt-6 text-sm text-gray-500">
            Your privacy is protected. We only verify that you're a unique human.
          </p>
        </div>
      </div>
    </main>
  );
}
