//  /api/users
import { NextApiRequest, NextApiResponse } from 'next';
import { ClientUser } from '@/types/models/User';
import { userLogin } from '@/lib-server/services/login';
import { createSession } from '@/lib-server/services/session';
import { Session } from '@/types/models/Session';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ClientUser | { error: string }>
) {
    switch (req.method) {
        case 'POST':
            await loginUser(req, res);
            break;
        default:
            res.status(405).json({error: 'Method Not found' });
            break;
    }
}
const loginUser = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const {
            user, 
            error,
        } = await userLogin(req.body);

        if (error || !user) { 
            return res.status(error?.statusCode || 400).json({ message: error?.message });
        }
        // Create session cookie
        const sessionCookie = createSession({ id: user.id, email: user.email, username:user.username } as Session);
        res.setHeader('Set-Cookie', sessionCookie);

        return res.status(200).json(user);
    } catch (err) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};