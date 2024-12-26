import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import OpenAI from 'openai';
import { json, redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import Tesseract from 'tesseract.js';

// Firebaseの初期化
const firebaseConfig = {
    apiKey: "AIzaSyD8wzIs2Zdrl3Q3gzseAqQkmw-xtKBI1Rw",
    authDomain: "hackthon20241227.firebaseapp.com",
    projectId: "hackthon20241227",
    storageBucket: "hackthon20241227.firebasestorage.app",
    messagingSenderId: "980992507739",
    appId: "1:980992507739:web:388de63a10fec30dd6e47e",
    measurementId: "G-X1XF1NCNET"
};

let app;
if (!getApps().length) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApps()[0];
}

const db = getFirestore(app);

// OpenAI APIの初期化
const openai = new OpenAI({
    apiKey: env.OPENAI_API_KEY
});

export async function POST({ request }) {
    try {
        const formData = await request.formData();
        const file = formData.get('image');

        if (!file || !(file instanceof Blob)) {
            return json({ error: '画像が送信されていません' }, { status: 400 });
        }

        // Blobを適切な形式に変換
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);

        // サポートされている画像形式かチェック
        if (!file.type.startsWith('image/')) {
            return json({ error: '画像形式が無効です' }, { status: 400 });
        }

        const ocrResult = await Tesseract.recognize(uint8Array, 'jpn', {
            logger: info => console.log(info)
        });

        const recognizedText = ocrResult.data.text;  // OCRの結果を変数に保存

        // OpenAI APIを使用してJSON形式に変換
        const prompt = `
            以下のテキストをJSON形式に変換してください。JSONの形式は以下の通りです：
            {
                "名前": "",
                "クーポン内容": "",
                "クーポン期限": ""
            }
            テキスト:
            "${recognizedText}"
        `;

        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }]
        });

        const jsonResponse = response.choices[0]?.message?.content;
        if (!jsonResponse) {
            return json({ error: 'AIからの応答が無効です' }, { status: 500 });
        }

        const parsedData = JSON.parse(jsonResponse);

        // Firebaseに保存
        const docRef = await addDoc(collection(db, 'recognized-texts'), {
            originalText: recognizedText,
            jsonData: parsedData,
            createdAt: new Date(),
        });

        return redirect(303, '/inputinfo');

    } catch (error) {
        console.error('サーバーエラー:', error);
        return json({ error: 'サーバーエラーが発生しました' }, { status: 500 });
    }
}