import { STORAGE_KEYS } from './constants';

/**
 * Get item from localStorage
 */
export const getStorageItem = (key) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (error) {
        console.error(`Error getting ${key} from localStorage:`, error);
        return null;
    }
};

/**
 * Set item in localStorage
 */
export const setStorageItem = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Error setting ${key} in localStorage:`, error);
    }
};

/**
 * Remove item from localStorage
 */
export const removeStorageItem = (key) => {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error(`Error removing ${key} from localStorage:`, error);
    }
};

/**
 * Clear all localStorage
 */
export const clearStorage = () => {
    try {
        localStorage.clear();
    } catch (error) {
        console.error('Error clearing localStorage:', error);
    }
};

/**
 * Token management
 */
export const tokenStorage = {
    get: () => getStorageItem(STORAGE_KEYS.TOKEN),
    set: (token) => setStorageItem(STORAGE_KEYS.TOKEN, token),
    remove: () => removeStorageItem(STORAGE_KEYS.TOKEN),
};

/**
 * User management
 */
export const userStorage = {
    get: () => getStorageItem(STORAGE_KEYS.USER),
    set: (user) => setStorageItem(STORAGE_KEYS.USER, user),
    remove: () => removeStorageItem(STORAGE_KEYS.USER),
};
