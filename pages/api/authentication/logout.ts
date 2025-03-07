import { NextApiRequest, NextApiResponse } from 'next';
import { clearSession } from '@/lib-server/services/session';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    res.setHeader('Set-Cookie', clearSession());
    return res.status(200).json({ message: 'Logged out successfully' });
}