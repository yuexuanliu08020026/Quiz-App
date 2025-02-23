import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import Document from "@/components/ui/Document";
import StartCard from "@/components/ui/quiz/StartCard";
import Question from "@/components/ui/quiz/Question";
import { QuizAnswerSubmit, QuizEntity } from "@/types/models/Quiz";
import { Answer } from "@/types/models/Answer";

const Home = () => {
    const router = useRouter();
    const { id } = router.query;
    const [state, setState] = useState("start");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [quiz, setQuiz] = useState<QuizEntity>(new QuizEntity());
    const [quizSubmitForm, setSubmitForm] = useState<QuizAnswerSubmit | null>({
        userid: "user123",
        quizid: id as string,
        qaList: {}
    });

    const fetchQuiz = async (detail: boolean) => {
        setLoading(true);
        try {
            let url = `/api/quiz/${id}${detail ? "?detail=true" : ""}`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Quiz not found (Status: ${response.status})`);
            }
            const data = await response.json();
            if (!data || !data.id) {
                throw new Error("Invalid quiz data received");
            }
            const objdata = new QuizEntity(data)
            setQuiz(objdata);
            setError(null);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Function to handle answer selection
    const handleAnswer = (questionId: string, selectedAnswer: Answer) => {
        console.log("Question Updated:", questionId);
        console.log("Selected Answer:", selectedAnswer);

        setSubmitForm((prev: any) => {
            if (!prev) return prev; // Prevent null errors
            const existingSet = prev.qaList[questionId] ? new Set(prev.qaList[questionId]) : new Set();
            existingSet.add(selectedAnswer);
            return {
                ...prev,
                qaList: {
                    ...prev.qaList,
                    [questionId]: existingSet,
                },
            };
        });
    };

    // fetch quiz data when initialize page
    useEffect(() => {
        if (!router.isReady || !id) return;
        fetchQuiz(false);
    }, [id, router.isReady]);

    const handleState = (newState: string) => {
        setState(newState);

        if (newState === "quiz") {
            fetchQuiz(true);
        }
    };

    return (
        <div className="h-screen">
            <Document />
            <div className="flex flex-col min-h-screen">
                <div className=" justify-center">
                    {state === "start" && (
                        <StartCard
                            quiz={quiz}
                            handleState={handleState}
                        />
                    )}
                    {state === "quiz" && (
                        <>
                            {loading ? (
                                <p>Loading quiz...</p>
                            ) : error ? (
                                <p className="text-red-500">{error}</p>
                            ) : (
                                <div> Quiz {quiz.title}
                                        <br/>
                                        Quiz {quiz.subject}
                                    {quiz?.questions?.map((question) => (
                                        <Question
                                            key={question.id}
                                            question={question}
                                            handleAnswer={(selectedOption) =>
                                                handleAnswer(question.id, selectedOption)
                                            }
                                        />
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                    {state === "done"}
                </div>
            </div>
        </div>
    );
};

export default Home;