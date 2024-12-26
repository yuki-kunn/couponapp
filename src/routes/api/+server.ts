import type { RequestEvent, RequestHandler } from '@sveltejs/kit';
import { createWorker } from 'tesseract.js';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

export const POST: RequestHandler = async ({ request }: RequestEvent) => {
    const formData = await request.formData();
    const imageFile = formData.get('image');

    if (!imageFile || !(imageFile instanceof Blob)) {
        return new Response(JSON.stringify({ error: '画像が無効です' }), { status: 400 });
    }

    const imageBuffer = await imageFile.arrayBuffer();

    try {
        const worker = await createWorker();
        const { data } = await worker.recognize(new Uint8Array(imageBuffer));
        await worker.terminate();

        await saveToFirebase({ text: data.text });
        return new Response(JSON.stringify({ text: data.text }), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: '画像処理に失敗しました' }), { status: 500 });
    }
};

async function saveToFirebase(data: { text: string }) {
    const db = getFirestore();
    const docRef = doc(db, 'recognizedTexts', Date.now().toString());
    await setDoc(docRef, data);
}