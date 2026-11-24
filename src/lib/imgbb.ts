import { db, EVENT_TAG } from './firebase';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  orderBy,
  onSnapshot
} from 'firebase/firestore';

export const DEFAULT_IMGBB_API_KEY = "ee3d4b033dbf83d007f7b77a1a9e18e7";

export function getImgbbApiKey(): string {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('imgbb_api_key');
    if (saved && saved.trim()) return saved.trim();
  }
  return (import.meta as any).env?.VITE_IMGBB_API_KEY || DEFAULT_IMGBB_API_KEY;
}

export function setImgbbApiKey(key: string): void {
  if (typeof window !== 'undefined') {
    if (key.trim()) {
      localStorage.setItem('imgbb_api_key', key.trim());
    } else {
      localStorage.removeItem('imgbb_api_key');
    }
  }
}

export interface ImgbbImageRecord {
  id?: string;
  imgbbId: string;
  title: string;
  url: string;
  displayUrl: string;
  thumbUrl: string;
  deleteUrl?: string;
  width?: number;
  height?: number;
  size?: number;
  inGallery: boolean;
  eventTag?: string;
  createdAt: string;
}

export interface ImgbbUploadResponse {
  data: {
    id: string;
    title: string;
    url_viewer: string;
    url: string;
    display_url: string;
    width: number;
    height: number;
    size: number;
    time: number;
    expiration: number;
    image: {
      filename: string;
      name: string;
      mime: string;
      extension: string;
      url: string;
    };
    thumb?: {
      filename: string;
      name: string;
      mime: string;
      extension: string;
      url: string;
    };
    delete_url: string;
  };
  success: boolean;
  status: number;
  error?: {
    message: string;
    code: number;
  };
}

export async function uploadImageToImgbb(
  file: File,
  title?: string,
  customApiKey?: string
): Promise<ImgbbImageRecord> {
  const apiKey = (customApiKey && customApiKey.trim()) || getImgbbApiKey();

  if (!apiKey) {
    throw new Error('No se ha configurado la API Key de ImgBB.');
  }

  const formData = new FormData();
  formData.append('image', file);
  if (title && title.trim()) {
    formData.append('name', title.trim());
  }

  const endpoint = `https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey)}`;

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      body: formData,
    });
  } catch (netErr: any) {
    throw new Error(`Error de conexión al subir a ImgBB: ${netErr.message || 'Verifica tu conexión a Internet'}`);
  }

  const result: ImgbbUploadResponse = await response.json();

  if (!response.ok || !result.success || !result.data) {
    const errorMsg = result.error?.message || `Error HTTP ${response.status} al subir a ImgBB`;
    throw new Error(errorMsg);
  }

  const { data } = result;

  return {
    imgbbId: data.id,
    title: title?.trim() || data.title || file.name.replace(/\.[^/.]+$/, ''),
    url: data.url,
    displayUrl: data.display_url || data.url,
    thumbUrl: data.thumb?.url || data.display_url || data.url,
    deleteUrl: data.delete_url,
    width: data.width,
    height: data.height,
    size: data.size,
    inGallery: true,
    eventTag: EVENT_TAG,
    createdAt: new Date().toISOString(),
  };
}

const LOCAL_STORAGE_KEY = 'ruby_xv_imgbb_images_2026';

function deduplicateImages(list: ImgbbImageRecord[]): ImgbbImageRecord[] {
  const seen = new Set<string>();
  const result: ImgbbImageRecord[] = [];
  for (const item of list) {
    const key = item.id || item.imgbbId || item.url;
    if (key && !seen.has(key)) {
      seen.add(key);
      result.push(item);
    }
  }
  return result;
}

function getLocalImages(): ImgbbImageRecord[] {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    const parsed = data ? JSON.parse(data) : [];
    return Array.isArray(parsed) ? deduplicateImages(parsed) : [];
  } catch {
    return [];
  }
}

function setLocalImages(images: ImgbbImageRecord[]) {
  try {
    const unique = deduplicateImages(images);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(unique));
  } catch (e) {
    console.warn('LocalStorage limit reached for images:', e);
  }
}

export async function saveImgbbImageRecord(record: ImgbbImageRecord): Promise<string> {
  const payload = {
    imgbbId: record.imgbbId,
    title: record.title || 'Foto de XV Años de Ruby',
    url: record.url,
    displayUrl: record.displayUrl,
    thumbUrl: record.thumbUrl,
    deleteUrl: record.deleteUrl || '',
    width: record.width || 0,
    height: record.height || 0,
    size: record.size || 0,
    inGallery: record.inGallery !== false,
    eventTag: EVENT_TAG,
    createdAt: record.createdAt || new Date().toISOString(),
  };

  try {
    const imagesCollection = collection(db, 'gallery_images');
    const docRef = await addDoc(imagesCollection, payload);
    const id = docRef.id;

    const local = getLocalImages().filter((img) => img.id !== id && img.imgbbId !== record.imgbbId);
    local.unshift({ id, ...payload });
    setLocalImages(local);

    return id;
  } catch (error) {
    console.warn('Firestore unavailable for images, saving locally:', error);
    const local = getLocalImages().filter((img) => img.imgbbId !== record.imgbbId);
    const localId = 'imgbb-' + Date.now();
    local.unshift({ id: localId, ...payload });
    setLocalImages(local);
    return localId;
  }
}

export async function fetchImgbbImages(): Promise<ImgbbImageRecord[]> {
  try {
    const imagesCollection = collection(db, 'gallery_images');
    const q = query(imagesCollection, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const firestoreImages = deduplicateImages(
      snapshot.docs
        .map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<ImgbbImageRecord, 'id'>)
        }))
        .filter((item) => item.eventTag === EVENT_TAG)
    );
    if (firestoreImages.length > 0) {
      setLocalImages(firestoreImages);
      return firestoreImages;
    }
  } catch (error) {
    console.warn('Error fetching images from Firestore, falling back to local:', error);
  }
  return getLocalImages();
}

export function subscribeImgbbImages(callback: (images: ImgbbImageRecord[]) => void) {
  const local = getLocalImages();
  callback(local);

  try {
    const imagesCollection = collection(db, 'gallery_images');
    const q = query(imagesCollection, orderBy('createdAt', 'desc'));

    return onSnapshot(
      q,
      (snapshot) => {
        const rawImages: ImgbbImageRecord[] = snapshot.docs
          .map((docSnap) => ({
            id: docSnap.id,
            ...(docSnap.data() as Omit<ImgbbImageRecord, 'id'>)
          }))
          .filter((item) => item.eventTag === EVENT_TAG);
        const images = deduplicateImages(rawImages);
        setLocalImages(images);
        callback(images);
      },
      (err) => {
        console.warn('Firestore images listener fallback:', err?.message || err);
      }
    );
  } catch (err) {
    console.warn('Could not setup Firestore images listener:', err);
    return () => {};
  }
}

export async function toggleImageGalleryStatus(id: string, inGallery: boolean): Promise<void> {
  const local = getLocalImages();
  const updatedLocal = local.map((img) => (img.id === id ? { ...img, inGallery } : img));
  setLocalImages(updatedLocal);

  try {
    const docRef = doc(db, 'gallery_images', id);
    await updateDoc(docRef, { inGallery });
  } catch (e) {
    console.warn('Could not update inGallery in Firestore:', e);
  }
}

export async function deleteImgbbImageRecord(id: string): Promise<void> {
  const local = getLocalImages().filter((img) => img.id !== id);
  setLocalImages(local);

  try {
    const docRef = doc(db, 'gallery_images', id);
    await deleteDoc(docRef);
  } catch (e) {
    console.warn('Could not delete image from Firestore:', e);
  }
}
