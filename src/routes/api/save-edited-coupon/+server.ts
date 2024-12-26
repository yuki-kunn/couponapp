import { json } from '@sveltejs/kit';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { initializeApp, getApps } from 'firebase/app';
import { env } from '$env/dynamic/private';

// Firebase 初期化
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

export async function POST({ request }) {
    try {
        const body = await request.json();

        if (!body.jsonData || !body.imagePath) {
            return json({ error: 'データが不完全です。' }, { status: 400 });
        }

        // Firebase の新しいコレクションにデータを保存
        const docRef = await addDoc(collection(db, 'edited-coupons'), {
            ...body,
            createdAt: new Date(),
        });

        return json({ success: true, id: docRef.id });
    } catch (error) {
        console.error('エラー:', error);
        return json({ error: '保存に失敗しました。' }, { status: 500 });
    }
}