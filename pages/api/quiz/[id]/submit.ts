import { NextApiRequest, NextApiResponse } from "next";
import { submitQuizAnswer } from "@/lib-server/services/quiz";
import { QuizAnswerSubmit } from "@/types/models/Quiz";
import { AttemptEntity } from "@/types/models/Attempt";
import { verifySession } from "@/lib-server/services/session";

// /api/quiz/[id]/submit
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }
    const session = await verifySession(req);

    if (!session) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const quizAnswer: QuizAnswerSubmit = req.body;
        const result : AttemptEntity = await submitQuizAnswer(quizAnswer, session);
        return res.status(200).json(result);
    } catch (error: any) {
        return res.status(500).json({ error: error.message || "Internal Server Error" });
    }
}