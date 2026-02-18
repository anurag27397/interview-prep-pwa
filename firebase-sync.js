/**
 * Firebase Sync Module for Interview Prep App
 * Syncs completion log, custom topics, and timer state across devices
 * using Firebase Realtime Database with a simple sync-code approach.
 */

// Firebase SDK (compat version for simplicity)
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js';
import { getDatabase, ref, set, onValue, get } from 'https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js';

// --- Sync Code Management ---
const SYNC_CODE_KEY = 'interview_prep_sync_code';

export function getSyncCode() {
    return localStorage.getItem(SYNC_CODE_KEY);
}

export function setSyncCode(code) {
    localStorage.setItem(SYNC_CODE_KEY, code);
}

function generateSyncCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No I/O/0/1 to avoid confusion
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

// --- Firebase State ---
let db = null;
let syncCode = null;
let isOnline = false;
let listeners = [];
let statusCallback = null;

// --- Initialize ---
export function initSync(firebaseConfig, onStatusChange) {
    statusCallback = onStatusChange;

    try {
        const app = initializeApp(firebaseConfig);
        db = getDatabase(app);

        // Get or generate sync code
        syncCode = getSyncCode();
        if (!syncCode) {
            syncCode = generateSyncCode();
            setSyncCode(syncCode);
        }

        isOnline = true;
        if (statusCallback) statusCallback({ online: true, code: syncCode });

        // Monitor connection
        const connRef = ref(db, '.info/connected');
        onValue(connRef, (snap) => {
            isOnline = snap.val() === true;
            if (statusCallback) statusCallback({ online: isOnline, code: syncCode });
        });

        return syncCode;
    } catch (err) {
        console.error('Firebase init failed:', err);
        isOnline = false;
        if (statusCallback) statusCallback({ online: false, code: syncCode || 'ERROR' });
        return null;
    }
}

// --- Change Sync Code (link to another device) ---
export function changeSyncCode(newCode) {
    // Unsubscribe existing listeners
    listeners.forEach(unsub => {
        if (typeof unsub === 'function') unsub();
    });
    listeners = [];

    syncCode = newCode.toUpperCase().trim();
    setSyncCode(syncCode);

    if (statusCallback) statusCallback({ online: isOnline, code: syncCode });
    return syncCode;
}

// --- Push data to Firebase ---
export async function pushData(key, value) {
    // Always save locally
    localStorage.setItem(key, JSON.stringify(value));

    if (!db || !syncCode || !isOnline) return;

    try {
        const dataRef = ref(db, `users/${syncCode}/${key}`);
        await set(dataRef, value);
    } catch (err) {
        console.warn('Firebase push failed, data saved locally:', err);
    }
}

// --- Pull data from Firebase (one-time) ---
export async function pullData(key) {
    if (!db || !syncCode) {
        const local = localStorage.getItem(key);
        return local ? JSON.parse(local) : null;
    }

    try {
        const dataRef = ref(db, `users/${syncCode}/${key}`);
        const snapshot = await get(dataRef);

        if (snapshot.exists()) {
            const remoteData = snapshot.val();
            // Merge: remote wins, but keep local-only keys
            const local = localStorage.getItem(key);
            const localData = local ? JSON.parse(local) : {};
            const merged = { ...localData, ...remoteData };
            localStorage.setItem(key, JSON.stringify(merged));
            return merged;
        } else {
            // No remote data, push local data up
            const local = localStorage.getItem(key);
            if (local) {
                const localData = JSON.parse(local);
                await pushData(key, localData);
                return localData;
            }
            return null;
        }
    } catch (err) {
        console.warn('Firebase pull failed, using local data:', err);
        const local = localStorage.getItem(key);
        return local ? JSON.parse(local) : null;
    }
}

// --- Listen for realtime changes ---
export function onDataChange(key, callback) {
    if (!db || !syncCode) return () => { };

    const dataRef = ref(db, `users/${syncCode}/${key}`);
    const unsubscribe = onValue(dataRef, (snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            localStorage.setItem(key, JSON.stringify(data));
            callback(data);
        }
    });

    listeners.push(unsubscribe);
    return unsubscribe;
}

// --- Upload all local data to Firebase (for initial sync) ---
export async function uploadAllLocal(keys) {
    if (!db || !syncCode) return;

    for (const key of keys) {
        const local = localStorage.getItem(key);
        if (local) {
            try {
                const dataRef = ref(db, `users/${syncCode}/${key}`);
                await set(dataRef, JSON.parse(local));
            } catch (err) {
                console.warn(`Failed to upload ${key}:`, err);
            }
        }
    }
}
