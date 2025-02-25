//  /api/quiz/create
import { NextApiRequest, NextApiResponse } from 'next';
import { createQuiz } from  "@/lib-server/services/quiz"
import { QuizEntity } from '@/types/models/Quiz';
import { verifySession } from "@/lib-server/services/session";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<QuizEntity[] | { error: string }>
) {
    switch (req.method) {
        case 'POST':
            await createOneQuiz(req, res);
            break;
        default:
            res.status(405).json({error: 'Method Not found' });
            break;
    }
}
const createOneQuiz = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const session = await verifySession(req);
        const submitFormData:QuizEntity = JSON.parse(req.body);
        const quiz = await createQuiz(submitFormData, session);
        return res.status(201).json(quiz);
    } catch (error: any) {
        console.error("API Error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}