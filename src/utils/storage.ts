interface StoredItem {
  text: string;
  timestamp: number;
  expiresAt: number;
}

const STORAGE_KEY = 'textshare_data';
const EXPIRY_TIME = 30 * 60 * 1000; // 30 minutes in milliseconds

// Clean up expired items
const cleanupExpiredItems = (): void => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return;

  try {
    const data: Record<string, StoredItem> = JSON.parse(stored);
    const now = Date.now();
    const cleaned: Record<string, StoredItem> = {};

    Object.entries(data).forEach(([code, item]) => {
      if (item.expiresAt > now) {
        cleaned[code] = item;
      }
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
  } catch (error) {
    console.error('Error cleaning up expired items:', error);
    localStorage.removeItem(STORAGE_KEY);
  }
};

// Generate a unique 4-digit alphanumeric code
export const generateCode = (): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const stored = localStorage.getItem(STORAGE_KEY);
  const existingCodes = new Set<string>();

  // Get existing codes to avoid duplicates
  if (stored) {
    try {
      const data: Record<string, StoredItem> = JSON.parse(stored);
      const now = Date.now();
      
      Object.entries(data).forEach(([code, item]) => {
        if (item.expiresAt > now) {
          existingCodes.add(code);
        }
      });
    } catch (error) {
      console.error('Error parsing stored data:', error);
    }
  }

  let code: string;
  let attempts = 0;
  const maxAttempts = 100;

  do {
    code = '';
    for (let i = 0; i < 4; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    attempts++;
  } while (existingCodes.has(code) && attempts < maxAttempts);

  if (attempts >= maxAttempts) {
    // Fallback: use timestamp-based code if we can't find a unique one
    const timestamp = Date.now().toString();
    code = timestamp.slice(-4).toUpperCase();
  }

  return code;
};

// Store text with expiry
export const storeText = (code: string, text: string): void => {
  cleanupExpiredItems();

  const stored = localStorage.getItem(STORAGE_KEY);
  let data: Record<string, StoredItem> = {};

  if (stored) {
    try {
      data = JSON.parse(stored);
    } catch (error) {
      console.error('Error parsing stored data:', error);
      data = {};
    }
  }

  const now = Date.now();
  data[code] = {
    text,
    timestamp: now,
    expiresAt: now + EXPIRY_TIME
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error storing data:', error);
    // Handle storage quota exceeded
    if (error instanceof DOMException && error.code === 22) {
      // Try to clear expired items and retry
      localStorage.removeItem(STORAGE_KEY);
      const newData: Record<string, StoredItem> = {};
      newData[code] = data[code];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    }
  }
};

// Retrieve text by code
export const getText = (code: string): string | null => {
  cleanupExpiredItems();

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;

  try {
    const data: Record<string, StoredItem> = JSON.parse(stored);
    const item = data[code];

    if (!item) return null;

    const now = Date.now();
    if (item.expiresAt <= now) {
      // Item has expired, remove it
      delete data[code];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return null;
    }

    return item.text;
  } catch (error) {
    console.error('Error retrieving data:', error);
    return null;
  }
};

// Get all stored codes (for debugging)
export const getAllCodes = (): string[] => {
  cleanupExpiredItems();

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];

  try {
    const data: Record<string, StoredItem> = JSON.parse(stored);
    return Object.keys(data);
  } catch (error) {
    console.error('Error getting all codes:', error);
    return [];
  }
};