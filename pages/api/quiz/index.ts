//  /api/users
import { NextApiRequest, NextApiResponse } from 'next';
import { Quiz } from '@prisma/client';
import {getQuizOverview} from  "@/lib-server/services/quiz"
import { QuizGetData } from '@/types/models/Quiz';


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Quiz[] | { error: string }>
) {
    switch (req.method) {
        case 'GET':
            await getQuizs(req, res);
            break;
        default:
            res.status(405).json({error: 'Method Not found' });
            break;
    }
}

const getQuizs = async (req: NextApiRequest, res: NextApiResponse) => {
    const query: QuizGetData = {
        published: true,
    };
    const quizs = await getQuizOverview(query);
    res.status(201).json(quizs);
}