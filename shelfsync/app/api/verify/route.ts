import { NextRequest, NextResponse } from 'next/server';
import { createUser, getUserByWorldId } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { proof, merkle_root, nullifier_hash, verification_level } = body;

    // In production, verify the proof with World ID API
    // For demo purposes, we'll accept any valid-looking proof
    if (!proof || !nullifier_hash) {
      return NextResponse.json(
        { error: 'Invalid World ID proof' },
        { status: 400 }
      );
    }

    // Check if user already exists
    let user = await getUserByWorldId(nullifier_hash);

    if (!user) {
      // Create new user
      user = await createUser(nullifier_hash);
    }

    return NextResponse.json({
      success: true,
      userId: user.id,
      points: user.points,
    });
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { error: 'Verification failed' },
      { status: 500 }
    );
  }
}
