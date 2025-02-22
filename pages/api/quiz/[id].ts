//  /api/quiz
import { NextApiRequest, NextApiResponse } from 'next';
import { Quiz } from '@prisma/client';
import { getQuizOverview, getQuizQuestionAndAnswers } from  "@/lib-server/services/quiz"
import { QuizGetData } from '@/types/models/Quiz';


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
    const query: QuizGetData = {
        id: id,
    };

    const quiz = await getQuizOverview(query);
    if (!id) {
        return res.status(400).json({ error: "quiz ID is required" });
    }

}

const getOneQuizDetail= async (req: NextApiRequest, res: NextApiResponse) => {

    const id = req.query.id as string;

    if (!id) {
        return res.status(400).json({ error: "quiz ID is required" });
    }

    const quiz = await getQuizQuestionAndAnswers(id);

    if(!quiz){
        return res.status(404).json({ error: "quiz not found" });
    }

    res.status(201).json(quiz);
}