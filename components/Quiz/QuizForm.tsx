import { useState } from "react";

const QuizForm = ({ quizId, userId }: { quizId: string; userId: string }) => {
    const [answers, setAnswers] = useState<{ questionId: string; answerJson: any }[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<any>(null);

    const handleAnswerChange = (questionId: string, answer: any) => {
        setAnswers((prev) => {
            const updatedAnswers = prev.filter((a) => a.questionId !== questionId);
            return [...updatedAnswers, { questionId, answerJson: answer }];
        });
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/quiz/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ quizid: quizId, userid: userId, qaList: answers }),
            });

            if (!response.ok) {
                throw new Error(await response.text());
            }

            const data = await response.json();
            setResult(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Submit Your Quiz</h2>

            {}
            <div>
                <label>Question 1 Answer:</label>
                <input
                    type="text"
                    onChange={(e) => handleAnswerChange("question1", e.target.value)}
                />
            </div>

            <button onClick={handleSubmit} disabled={loading}>
                {loading ? "Submitting..." : "Submit Quiz"}
            </button>

            {error && <p style={{ color: "red" }}>Error: {error}</p>}
            {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
        </div>
    );
};

export default QuizForm;
