//  /api/users
import { NextApiRequest, NextApiResponse } from 'next';
import { Quiz } from '@prisma/client';
import { getQuizs} from  "@/lib-server/services/quiz"
import { QuizQueryData } from '@/types/models/Quiz';


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Quiz[] | { error: string }>
) {
    switch (req.method) {
        case 'GET':
            await getQuizsOverview(req, res);
            break;
        default:
            res.status(405).json({error: 'Method Not found' });
            break;
    }
}

const getQuizsOverview = async (req: NextApiRequest, res: NextApiResponse) => {
    const query: QuizQueryData = {
        isPublished: true,
    };
    const quizs = await getQuizs(query);
    res.status(201).json(quizs);
}