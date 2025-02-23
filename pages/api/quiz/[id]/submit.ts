import { NextApiRequest, NextApiResponse } from "next";
import { submitQuiz } from "@/lib-server/services/quiz";
import { QuizAnswerSubmit } from "@/types/models/Quiz";

// /api/quiz/[id]/submit
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
        const quizAnswer: QuizAnswerSubmit = req.body;
        const result = await submitQuiz(quizAnswer);
        return res.status(200).json(result);
    } catch (error: any) {
        return res.status(500).json({ error: error.message || "Internal Server Error" });
    }
}