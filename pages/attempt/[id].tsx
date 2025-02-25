import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { GetServerSideProps } from 'next';
import { verifySession, clearSession } from "@/lib-server/services/session";

interface Attempt {
    id: string;
    quizTitle: string;
    score: number;
    answers: { question: string; selectedAnswer: string }[];
}

const AttemptEntityPage: React.FC = () => {
    const router = useRouter();
    const attemptId = Array.isArray(router.query.id) ? router.query.id[0] : router.query.id;
    const [attempt, setAttempt] = useState<Attempt | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (attemptId) {
            fetch(`/api/attempt/${attemptId}`,{
                credentials: 'include'
            })
                .then(async (res) => {
                    if (!res.ok) {
                        throw new Error("Failed to fetch attempt data");
                    }
                    return res.json();
                })
                .then((data: Attempt) => {
                    setAttempt(data);
                })
                .catch((err) => {
                    setError(err.message);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [attemptId]);

    if (loading) return <p>Loading attempt data...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div>
            <h2>Attempt {attempt?.id}</h2>
            <p>Quiz: {attempt?.quizTitle}</p>
            <p>Score: {attempt?.score}</p>
            <p>Answers:</p>
            <ul>
                {attempt?.answers?.map((answer, index) => (
                    <li key={index}>
                        {answer.question}: {answer.selectedAnswer}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    try {
        const session = await verifySession(req);
        if (!session) throw new Error("Unauthorized");

        return { props: { session } };
    } catch (error: any) {
        if (error.name === "TokenExpiredError") {
            res.setHeader("Set-Cookie", clearSession());
        }

        return { redirect: { destination: "/auth/login", permanent: false } };
    }
};

export default AttemptEntityPage;
