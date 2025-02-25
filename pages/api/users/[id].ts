// dynamic API route for user , handles CRUD operations (GET, PATCH, DELETE) for a specific user with a specific id
// Integrate middleware, validation, and authentication to secure operations.
// Implements role-based access control (users can only update/delete their own posts unless they are admins).
/*
    GET /api/users/:id
    PATCH /api/users/:id
    DELETE /api/users/:id
*/

import { NextApiRequest, NextApiResponse } from 'next';
import { ClientUser } from '@/types/models/User';
import { getUser } from '@/lib-server/services/users';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ClientUser | { error: string }>
) {
    switch (req.method) {
        case 'GET':
            await getUserById(req, res);
            break;
        default:
            res.status(405).json({error: 'Method Not found' });
            break;
    }
}

const getUserById = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "GET") {
        const id = req.query.id as string;

        if (!id) {
            return res.status(400).json({ error: "User ID is required" });
        }

        try {
            const user: ClientUser | null = await getUser(id);

            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            return res.status(200).json(user);
        } catch (error) {
            return res.status(500).json({ error: "Internal Server Error" });
        }
    } else {
        return res.status(405).json({ error: "Method Not Allowed" });
    }
}