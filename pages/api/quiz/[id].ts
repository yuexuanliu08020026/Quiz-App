//  /api/quiz/[id]
import { NextApiRequest, NextApiResponse } from 'next';
import { Quiz } from '@prisma/client';
import { getQuizs } from  "@/lib-server/services/quiz"
import { QuizQueryData } from '@/types/models/Quiz';


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Quiz | { error: string }>
) {
    switch (req.method) {
        case 'GET':
            await getOneQuizOverview(req, res);
            break;
        default:
            res.status(405).json({error: 'Method Not found' });
            break;
    }
}
const getOneQuizOverview = async (req: NextApiRequest, res: NextApiResponse) => {
    const id = req.query.id as string;
    const query: QuizQueryData = {
        id: id,
    };

    const quiz = await getQuizs(query);
    if (!id) {
        return res.status(400).json({ error: "quiz ID is required" });
    }

}