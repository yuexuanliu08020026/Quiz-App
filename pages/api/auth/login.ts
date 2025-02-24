//  /api/users
import { NextApiRequest, NextApiResponse } from 'next';
import { ClientUser } from '@/types/models/User';
import { userLogin } from '@/lib-server/services/login';

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

        if (error) { 
            return res.status(error.statusCode || 400).json({ message: error.message });
        }

        return res.status(200).json(user); // Correct reference to `ClientUser`
    } catch (err) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};