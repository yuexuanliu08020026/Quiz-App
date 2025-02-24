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
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    // Reference to store answers from all questions
    const questionRefs = useRef<{ [key: string]: () => any }>({});

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
    // Collect answers from all questions and submit
    const handleSubmit = () => {
        const qaList: { [key: string]: any } = {};

        // Iterate over all registered question refs and get selected answers
        Object.keys(questionRefs.current).forEach((questionId) => {
            const selectedAnswer = questionRefs.current[questionId]();
            if (selectedAnswer) {
                qaList[questionId] = selectedAnswer;
            }
        });

        const quizSubmitForm: QuizAnswerSubmit = {
            userid: "user123",
            quizid: id as string,
            qaList,
        };

        console.log("Submitting Quiz:", quizSubmitForm);

        fetch(`/api/quiz/${id}$/submit`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(quizSubmitForm),
        }).then(async (res) => {
            if (res.ok) {
                const data = await res.json();
                console.log(data)
                window.alert('Quiz submitted successfully!');
                router.push({
                    pathname: `/attempt/${data.id}`
                });
            } else {
                window.alert('Quiz submission failed. Please try again.');
            }
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

    const nextQuestion = () => {
        if (currentQuestionIndex < (quiz?.questions?.length || 0) - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
        }
    };

    const prevQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex((prev) => prev - 1);
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
                                    <br />
                                    Quiz {quiz.subject}
                                    {quiz?.questions?.map((question, index) => (
                                        <div key={question.id} style={{ display: index === currentQuestionIndex ? 'block' : 'none' }}>
                                            <Question
                                                question={question}
                                                registerRef={(getter) => {
                                                    questionRefs.current[question.id] = getter;
                                                }}
                                            />
                                        </div>
                                    ))}
                                    <div className="mt-4 flex space-x-4">
                                        {currentQuestionIndex > 0 && (
                                            <button
                                                className="bg-gray-500 text-white p-3 rounded-lg hover:bg-gray-700"
                                                onClick={prevQuestion}
                                            >
                                                Previous Question
                                            </button>
                                        )}
                                        {currentQuestionIndex < (quiz?.questions?.length || 0) - 1 && (
                                            <button
                                                className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
                                                onClick={nextQuestion}
                                            >
                                                Next Question
                                            </button>
                                        )}
                                    </div>
                                    <button
                                        className="bg-blue-600 text-white p-3 rounded-lg mt-4 hover:bg-blue-700"
                                        onClick={handleSubmit}
                                    >
                                        Submit Quiz
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;