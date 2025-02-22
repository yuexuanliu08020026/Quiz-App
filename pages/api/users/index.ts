//  /api/users
import { NextApiRequest, NextApiResponse } from 'next';
import { ClientUser } from '@/types/models/User';
import { createUser } from '@/lib-server/services/users';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ClientUser | { error: string }>
) {
    switch (req.method) {
        case 'POST':
            await registerUser(req, res);
            break;
        default:
            res.status(405).json({error: 'Method Not found' });
            break;
    }
}

const registerUser = async (req: NextApiRequest, res: NextApiResponse) => {
    const user = await createUser(req.body);
    res.status(201).json(user);
}