import { json } from '@sveltejs/kit';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { initializeApp, getApps } from 'firebase/app';
import { env } from '$env/dynamic/private';

const firebaseConfig = {
    apiKey: env.FIREBASE_API_KEY,
    authDomain: env.FIREBASE_AUTH_DOMAIN,
    projectId: env.FIREBASE_PROJECT_ID,
    storageBucket: env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.FIREBASE_MESSAGING_SENDER_ID,
    appId: env.FIREBASE_APP_ID,
};

let app;
if (!getApps().length) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApps()[0];
}

const db = getFirestore(app);

export async function GET() {
    try {
        const querySnapshot = await getDocs(collection(db, 'recognized-texts'));
        const coupons = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        return json({ coupons });
    } catch (error) {
        console.error('Error fetching coupons:', error);
        return json({ error: 'Failed to fetch coupons' }, { status: 500 });
    }
}