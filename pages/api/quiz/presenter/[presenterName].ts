//  /api/quiz/[id]
import { NextApiRequest, NextApiResponse } from 'next';
import { getQuizs } from  "@/lib-server/services/quiz"
import { QuizEntity, QuizQueryData } from '@/types/models/Quiz';


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<QuizEntity[] | { error: string }>
) {
    switch (req.method) {
        case 'GET':
            await getQuizByPresenter(req, res);
            break;
        default:
            res.status(405).json({error: 'Method Not found' });
            break;
    }
}
const getQuizByPresenter = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const presenterName = req.query.presenterName as string;
        const detail = req.query.detail === "false"; 
        if (!presenterName) {
            return res.status(400).json({ error: "Quiz presenter is required" });
        }

        console.log(`Fetching quiz with presenter: ${presenterName}`);

        const query: QuizQueryData = { username:presenterName };
        const quizs: QuizEntity[] = await getQuizs(query,detail);

        const quiz: QuizEntity = quizs[0]
        if (!quiz) {
            console.warn("No quiz found for this ID.");
            return res.status(404).json({ error: "No quiz available right now" });
        }
        console.log("Quiz Found:", quiz);
        return res.status(200).json(quiz);
    } catch (error: any) {
        console.error("API Error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}