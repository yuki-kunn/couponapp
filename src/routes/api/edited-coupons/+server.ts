import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export const GET: RequestHandler = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, 'edited-coupons'));
        const coupons = querySnapshot.docs.map(doc => doc.data());
        return json(coupons);
    } catch (error) {
        return json({ error: 'Error fetching data' }, { status: 500 });
    }
};