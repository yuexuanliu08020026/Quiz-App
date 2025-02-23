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
            await getOneQuizDetail(req, res);
            break;
        default:
            res.status(405).json({error: 'Method Not found' });
            break;
    }
}
const getOneQuizDetail = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const id = req.query.id as string;
        if (!id) {
            return res.status(400).json({ error: "Quiz ID is required" });
        }

        console.log(`Fetching quiz with ID: ${id}`);

        const query: QuizQueryData = { id };
        const quizs = await getQuizs(query, true);

        if (!quizs) {
            console.warn("No quiz found for this ID.");
            return res.status(404).json({ error: "No quiz available right now" });
        }

        const quiz = quizs[0]
        console.log("Quiz Found:", quiz);
        return res.status(200).json(quiz);
    } catch (error: any) {
        console.error("API Error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}