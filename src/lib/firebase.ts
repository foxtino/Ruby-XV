import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Get Firestore instance using the custom databaseId if provided in config
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

export const EVENT_TAG = 'ruby-xv-2026';
const LOCAL_RSVPS_KEY = 'ruby_xv_rsvps_2026';
const LOCAL_WISHES_KEY = 'ruby_xv_wishes_2026';

export interface RsvpData {
  id?: string;
  name: string;
  attendance: 'yes' | 'no';
  guestsCount: number;
  dietaryRestrictions?: string;
  busNeeded?: boolean;
  songRequest?: string;
  message?: string;
  eventTag?: string;
  createdAt: string;
}

export interface WishData {
  id?: string;
  name: string;
  message: string;
  eventTag?: string;
  createdAt: string;
}

const DEFAULT_WISHES: WishData[] = [
  {
    id: 'ruby-default-1',
    name: 'Yesenia Abigail Ceballos Eguia',
    message:
      'Hija mía, verte llegar a tus quince años llena mi alma de orgullo y felicidad. Que Dios bendiga cada paso de tu camino hoy y siempre.',
    eventTag: EVENT_TAG,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'ruby-default-2',
    name: 'Familia Ceballos Eguia',
    message:
      '¡Muchas felicidades, Ruby! Que esta nueva etapa esté rodeada de alegría, sueños cumplidos y momentos inolvidables.',
    eventTag: EVENT_TAG,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  }
];

function sanitizeFirestoreData<T extends Record<string, any>>(data: T): Record<string, any> {
  const sanitized: Record<string, any> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

// Add RSVP to Firestore with LocalStorage Fallback
export async function saveRsvp(data: Omit<RsvpData, 'createdAt'>): Promise<string> {
  const rawPayload = {
    name: data.name,
    attendance: data.attendance,
    guestsCount: data.guestsCount,
    dietaryRestrictions: data.dietaryRestrictions ?? '',
    busNeeded: data.busNeeded ?? false,
    songRequest: data.songRequest ?? '',
    message: data.message ?? '',
    eventTag: EVENT_TAG,
    createdAt: new Date().toISOString()
  };

  try {
    const rsvpCollection = collection(db, 'rsvps');
    const payload = sanitizeFirestoreData(rawPayload);
    const docRef = await addDoc(rsvpCollection, payload);
    return docRef.id;
  } catch (error) {
    console.warn('Firestore unavailable, saving RSVP locally:', error);
    const localRsvps = JSON.parse(localStorage.getItem(LOCAL_RSVPS_KEY) || '[]');
    const localId = 'local-' + Date.now();
    localRsvps.push({ id: localId, ...rawPayload });
    localStorage.setItem(LOCAL_RSVPS_KEY, JSON.stringify(localRsvps));
    return localId;
  }
}

// Add Wish to Firestore with LocalStorage Fallback
export async function saveWish(data: Omit<WishData, 'createdAt'>): Promise<string> {
  const rawPayload = {
    name: data.name,
    message: data.message,
    eventTag: EVENT_TAG,
    createdAt: new Date().toISOString()
  };

  try {
    const wishesCollection = collection(db, 'wishes');
    const payload = sanitizeFirestoreData(rawPayload);
    const docRef = await addDoc(wishesCollection, payload);
    return docRef.id;
  } catch (error) {
    console.warn('Firestore unavailable, saving wish locally:', error);
    const localWishes = JSON.parse(localStorage.getItem(LOCAL_WISHES_KEY) || '[]');
    const localId = 'local-' + Date.now();
    const newWish = { id: localId, ...rawPayload };
    localWishes.unshift(newWish);
    localStorage.setItem(LOCAL_WISHES_KEY, JSON.stringify(localWishes));
    return localId;
  }
}

function deduplicateById<T extends { id?: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  const result: T[] = [];
  for (const item of items) {
    if (item.id) {
      if (!seen.has(item.id)) {
        seen.add(item.id);
        result.push(item);
      }
    } else {
      result.push(item);
    }
  }
  return result;
}

// Subscribe to real-time Wishes scoped to Ruby's XV Años
export function subscribeWishes(callback: (wishes: WishData[]) => void) {
  const localWishes: WishData[] = JSON.parse(localStorage.getItem(LOCAL_WISHES_KEY) || '[]');
  const initialList = localWishes.length > 0 ? localWishes : DEFAULT_WISHES;

  callback(deduplicateById(initialList));

  try {
    const wishesCollection = collection(db, 'wishes');
    const q = query(wishesCollection, orderBy('createdAt', 'desc'));

    return onSnapshot(
      q,
      (snapshot) => {
        const firestoreWishes: WishData[] = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...(doc.data() as Omit<WishData, 'id'>)
          }))
          .filter((item) => item.eventTag === EVENT_TAG);

        const savedLocal: WishData[] = JSON.parse(localStorage.getItem(LOCAL_WISHES_KEY) || '[]');
        const combined =
          firestoreWishes.length > 0
            ? [...firestoreWishes, ...savedLocal]
            : savedLocal.length > 0
            ? savedLocal
            : DEFAULT_WISHES;
        callback(deduplicateById(combined));
      },
      (error) => {
        console.warn('Firestore listener fallback mode:', error?.message || error);
      }
    );
  } catch (error) {
    console.warn('Could not setup Firestore listener:', error);
    return () => {};
  }
}

// Fetch all RSVPs scoped to Ruby's XV Años for admin view
export async function fetchAllRsvps(): Promise<RsvpData[]> {
  try {
    const rsvpCollection = collection(db, 'rsvps');
    const q = query(rsvpCollection, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const firestoreData = snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<RsvpData, 'id'>)
      }))
      .filter((item) => item.eventTag === EVENT_TAG);
    const localRsvps: RsvpData[] = JSON.parse(localStorage.getItem(LOCAL_RSVPS_KEY) || '[]');
    return deduplicateById([...firestoreData, ...localRsvps]);
  } catch (error) {
    console.warn('Error fetching RSVPs from Firestore, loading local:', error);
    return deduplicateById(JSON.parse(localStorage.getItem(LOCAL_RSVPS_KEY) || '[]'));
  }
}
