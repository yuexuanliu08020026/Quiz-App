import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import QuizForm from "@/components/Quiz/QuizForm";

type Question = {
    id: string;
    prompt: string;
};

type QuizDetail = {
    id: string;
    title: string;
    questions: Question[];
};

const QuizStartPage = () => {
    const router = useRouter();
    const { id } = router.query;
    const [quiz, setQuiz] = useState<QuizDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchQuizDetail = async () => {
            try {
                const response = await fetch(`/api/quiz/${id}/detail`);
                if (!response.ok) throw new Error("Quiz not found");
                const data = await response.json();
                setQuiz(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchQuizDetail();
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

    return (
        <div>
            <h1>{quiz?.title}</h1>
            <QuizForm quizId={id as string} userId="user123" />
        </div>
    );
};

export default QuizStartPage;
