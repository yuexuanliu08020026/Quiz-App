import { useRouter } from "next/router";
import { useEffect, useState } from "react";

type QuizOverview = {
    id: string;
    title: string;
    description: string;
    authorname: string;
};

const QuizPage = () => {
    const router = useRouter();
    const { id } = router.query;
    const [quiz, setQuiz] = useState<QuizOverview | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchQuizOverview = async () => {
            try {
                const response = await fetch(`/api/quiz/${id}`);
                if (!response.ok) throw new Error("Quiz not found");
                const data = await response.json();
                setQuiz(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchQuizOverview();
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

    return (
        <div>
            <h1>{quiz?.title}</h1>
            <p><strong>Author:</strong> {quiz?.authorname}</p>
            <p><strong>Description:</strong> {quiz?.description}</p>

            <button onClick={() => router.push(`/quiz/${id}/start`)}>
                Start Quiz
            </button>
        </div>
    );
};

export default QuizPage;
