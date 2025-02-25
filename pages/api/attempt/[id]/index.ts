//  /api/attempt/[id]
import { NextApiRequest, NextApiResponse } from 'next';
import { getAttemptsByUserQuestion } from  "@/lib-server/services/attempt"
import { AttemptEntity } from '@/types/models/Attempt';
import { verifySession } from '@/lib-server/services/session';


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<AttemptEntity | { error: string }>
) {
    switch (req.method) {
        case 'GET':
            await getOneAttempt(req, res);
            break;
        default:
            res.status(405).json({error: 'Method Not found' });
            break;
    }
}
const getOneAttempt = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const id = req.query.id as string;
        if (!id) {
            return res.status(400).json({ error: "Attempt ID is required" });
        }
        console.log(`Fetching attempt with ID: ${id}`);

        const session: any = await verifySession(req)
        if (!session){
            throw new Error("Unauthunized")
        }
        const attempt = await getAttemptsByUserQuestion(id, session);

        if (!attempt) {
            console.warn("No attempt found for this ID or no permission.");
            return res.status(404).json({ error: "No attempt found for this ID or no permission." });
        }

        console.log("Attempt Found:", attempt);
        return res.status(200).json(attempt);
    } catch (error: any) {
        console.error("API Error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}