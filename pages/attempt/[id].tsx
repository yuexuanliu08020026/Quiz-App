import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

interface AttemptQuestion {
  id: string;
  questionId: string;
  answer: string;
  isCorrect: boolean | null;
}

interface Attempt {
  id: string;
  quizId: string;
  score: number;
  attemptQuestions: AttemptQuestion[];
}

const AttemptEntityPage: React.FC = () => {
  const router = useRouter();
  const attemptId = Array.isArray(router.query.id) ? router.query.id[0] : router.query.id;
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (attemptId) {
      fetch(`/api/attempt/${attemptId}`, {
        credentials: "include",
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

  if (loading) return <p className="text-center text-gray-500 mt-5">Loading attempt data...</p>;
  if (error) return <p className="text-center text-red-500 mt-5">{error}</p>;

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 py-8">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-3xl">
        <h2 className="text-2xl font-bold mb-4 text-center">Attempt Details</h2>

        <p className="text-gray-600 text-center mb-2">
          <span className="font-semibold">Quiz ID:</span> {attempt?.quizId}
        </p>
        <p className="text-gray-600 text-center mb-4">
          <span className="font-semibold">Score:</span> <span className="text-blue-600">{attempt?.score}</span>
        </p>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2 text-left">Question ID</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Selected Answer</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Correct?</th>
              </tr>
            </thead>
            <tbody>
              {attempt?.attemptQuestions.map((question) => {
                const parsedAnswer = JSON.parse(question.answer);

                return (
                  <tr key={question.id} className="hover:bg-gray-100">
                    <td className="border border-gray-300 px-4 py-2">{question.questionId}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      {parsedAnswer.map((a: any) => (
                        <span key={a.id} className="bg-blue-100 text-blue-700 px-2 py-1 rounded mr-2">
                          {a.content}
                        </span>
                      ))}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {question.isCorrect === null ? "Pending" : question.isCorrect ? "Correct" : "Incorrect"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => router.push("/")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Back to Homepage
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttemptEntityPage;
