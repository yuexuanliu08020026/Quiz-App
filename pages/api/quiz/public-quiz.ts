//  /api/quiz/public-quiz
import { NextApiRequest, NextApiResponse } from 'next';
import { getQuizs } from  "@/lib-server/services/quiz"
import { QuizEntity } from '@/types/models/Quiz';


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<QuizEntity[] | { error: string }>
) {
    switch (req.method) {
        case 'GET':
            await getPublicQuiz(req, res);
            break;
        default:
            res.status(405).json({error: 'Method Not found' });
            break;
    }
}
const getPublicQuiz = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const quizs: QuizEntity[] = await getQuizs();
        if (!quizs) {
            throw Error()
        }
        return res.status(200).json(quizs);
    } catch (error: any) {
        console.error("API Error:", error);
        return res.status(500).json({ error});
    }
}