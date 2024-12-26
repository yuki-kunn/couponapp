import { json } from '@sveltejs/kit';
import { db } from '$lib/firebase';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';

export async function POST({ params }) {
    const { couponId } = params;
    try {
        const couponRef = doc(db, 'edited-coupons', couponId);
        const couponSnap = await getDoc(couponRef);

        if (!couponSnap.exists()) {
            return json({ error: 'クーポンが見つかりません' }, { status: 404 });
        }

        await setDoc(doc(db, 'used-coupons', couponId), couponSnap.data());
        await deleteDoc(couponRef);

        return json({ success: true });
    } catch (error) {
        return json({ error: 'エラーが発生しました' }, { status: 500 });
    }
}