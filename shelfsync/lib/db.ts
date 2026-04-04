import {
  collection,
  doc,
  setDoc,
  getDoc,
  addDoc,
  Timestamp,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { db } from './firebase';
import { demoStore, Product } from '@/data/store';

export interface User {
  id: string;
  worldId: string;
  verified: boolean;
  points: number;
  createdAt: Timestamp;
}

export interface Event {
  userId: string;
  type: 'store_selected' | 'product_searched' | 'product_found' | 'photo_uploaded';
  storeId?: string;
  productId?: string;
  searchQuery?: string;
  timestamp: Timestamp;
  metadata?: Record<string, any>;
}

export async function createUser(worldId: string): Promise<User> {
  const userRef = doc(collection(db, 'users'));
  const user: User = {
    id: userRef.id,
    worldId,
    verified: true,
    points: 0,
    createdAt: Timestamp.now(),
  };
  await setDoc(userRef, user);
  return user;
}

export async function getUser(userId: string): Promise<User | null> {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    return userSnap.data() as User;
  }
  return null;
}

export async function updateUserPoints(userId: string, points: number): Promise<void> {
  const userRef = doc(db, 'users', userId);
  const user = await getUser(userId);
  if (user) {
    await setDoc(userRef, { ...user, points: user.points + points });
  }
}

export async function logEvent(event: Omit<Event, 'timestamp'>): Promise<void> {
  const eventWithTimestamp: Event = {
    ...event,
    timestamp: Timestamp.now(),
  };
  await addDoc(collection(db, 'events'), eventWithTimestamp);
}

export async function searchProduct(query: string, storeId: string): Promise<Product[]> {
  // For demo purposes, search the hardcoded store data
  if (storeId === demoStore.id) {
    const normalizedQuery = query.toLowerCase();
    return demoStore.products.filter((product) =>
      product.name.toLowerCase().includes(normalizedQuery)
    );
  }
  return [];
}

export async function getUserByWorldId(worldId: string): Promise<User | null> {
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('worldId', '==', worldId));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() } as User;
  }
  return null;
}
