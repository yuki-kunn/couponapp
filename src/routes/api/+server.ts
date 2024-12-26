import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import OpenAI from 'openai';
import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import Tesseract from 'tesseract.js';
import * as path from 'path';
import * as fs from 'fs';

// Firebaseの初期化
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

        // サポートされている画像形式かチェック
        if (!file.type.startsWith('image/')) {
            return json({ error: '画像形式が無効です' }, { status: 400 });
        }

        // Blobを直接Tesseractに渡す前に、ArrayBufferに変換
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        const ocrResult = await Tesseract.recognize(uint8Array, 'jpn', {
            logger: info => console.log(info)
        });

        const recognizedText = ocrResult.data.text.trim();  // OCRの結果を変数に保存

        if (!recognizedText) {
            return json({ error: 'OCRによるテキスト認識に失敗しました' }, { status: 400 });
        }

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

        let parsedData;
        try {
            parsedData = JSON.parse(jsonResponse);
        } catch (error) {
            return json({ error: 'AIの応答をJSONに解析できませんでした' }, { status: 500 });
        }

        // 画像保存先ディレクトリをstatic内に設定
        const uploadDir = path.join('static', 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // 画像をstatic/uploadsディレクトリに保存
        const imagePath = path.join(uploadDir, Date.now() + '.jpg'); // 保存先
        const buffer = Buffer.from(await file.arrayBuffer());
        fs.writeFileSync(imagePath, buffer);

        // 画像の相対パスを返す（staticを排除）
        const relativeImagePath = `/uploads/${path.basename(imagePath)}`;

        // Firebaseに保存
        const docRef = await addDoc(collection(db, 'recognized-texts'), {
            imagePath: relativeImagePath,
            jsonData: parsedData,
            createdAt: new Date(),
        });

        return json(
            {
                success: true,
                id: docRef.id,
                data: parsedData,
                imagePath: relativeImagePath
            },
            {
                headers: {
                    'Location': '/inputInfo'
                }
            }
        );
    } catch (error) {
        console.error('サーバーエラー:', error);
        return json({ error: 'サーバーエラーが発生しました' }, { status: 500 });
    }
}