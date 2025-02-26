import { useState } from "react";
import { useRouter } from "next/router";
import { SingleChoiceAnswer} from "@/types/models/Answer"
import {QuestionEntity} from "@/types/models/Question"
import {QuizEntity} from "@/types/models/Quiz"
import { GetServerSideProps } from "next";
import { clearSession, verifySession } from "@/lib-server/services/session";


export default function QuizForm() {
  const router = useRouter();
  const [quiz, setQuiz] = useState<QuizEntity>({
    title: "",
    description: "",
    subject: "", 
    authorid: "", 
    authorname: "",
    questions: [],
  });

  const addQuestion = () => {
    setQuiz((prevQuiz) => ({
      ...prevQuiz,
      questions: [...prevQuiz.questions, new QuestionEntity("")],
    }));
  };

  const updateQuestion = (index: number, key: keyof QuestionEntity, value: string) => {
    setQuiz((prevQuiz) => {
      const updatedQuestions = [...prevQuiz.questions];
      updatedQuestions[index] = { ...updatedQuestions[index], [key]: value };
      return { ...prevQuiz, questions: updatedQuestions };
    });
  };

  const addAnswerOptions = (questionIndex: number) => {
    setQuiz((prevQuiz) => {
      const updatedQuestions = [...prevQuiz.questions];
      const question = updatedQuestions[questionIndex];
      const newAnswerId = question.answerOptions.length + 1;
      const newAnswer = new SingleChoiceAnswer(newAnswerId, "");

      question.answerOptions = [...question.answerOptions, newAnswer];

      return { ...prevQuiz, questions: updatedQuestions };
    });
  };

  const updateAnswerOptions = (qIndex: number, aIndex: number, value: string) => {
    setQuiz((prevQuiz) => {
      const updatedQuestions = [...(prevQuiz.questions || [])];
      if (updatedQuestions[qIndex]?.answerOptions) {
        const oldAnswer = updatedQuestions[qIndex].answerOptions[aIndex];
        updatedQuestions[qIndex].answerOptions[aIndex] = new SingleChoiceAnswer(
          oldAnswer.id,
          value
        );
      }
      return { ...prevQuiz, questions: updatedQuestions };
    });
  };


  const addCorrectAnswer = (questionIndex: number) => {
    setQuiz((prevQuiz) => {
      const updatedQuestions = [...prevQuiz.questions];
      const question = updatedQuestions[questionIndex];
      const newAnswerId = question.correctAnswer.length + 1;
      const newAnswer = new SingleChoiceAnswer(newAnswerId, "");

      question.correctAnswer = [...question.correctAnswer, newAnswer];

      return { ...prevQuiz, questions: updatedQuestions };
    });
  };
  const updateCorrectAnswer = (qIndex: number, aIndex: number, value: string) => {
    setQuiz((prevQuiz) => {
      const updatedQuestions = [...(prevQuiz.questions || [])];
      if (updatedQuestions[qIndex]?.correctAnswer) {
        const oldAnswer = updatedQuestions[qIndex].correctAnswer[aIndex];
        updatedQuestions[qIndex].correctAnswer[aIndex] = new SingleChoiceAnswer(
          oldAnswer.id,
          value
        );
      }
      return { ...prevQuiz, questions: updatedQuestions };
    });
  };
  const submitQuiz = async () => {
    const formattedQuiz = {
      ...quiz,
      questions: quiz.questions.map((q) => ({
        ...q,
        answerOptions: q.answerOptions.map(a => ({
          id: a.id,
          type: a.type,
          content: a.content,
        })),

        correctAnswer: q.correctAnswer.slice(0, 1),
      })),
    };

    const response = await fetch("/api/quiz/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formattedQuiz),
    });
    if (response.ok) {
      const createdQuiz: QuizEntity = await response.json()
      router.push(`/quiz/${createdQuiz.id}`);
    } else {
      console.error("Failed to submit quiz");
    }
};

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Create a Quiz</h2>
      <input
        type="text"
        placeholder="Quiz Title"
        value={quiz.title}
        onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
        className="w-full border p-2 mb-4"
      />
      <textarea
        placeholder="Quiz Description"
        value={quiz.description}
        onChange={(e) => setQuiz({ ...quiz, description: e.target.value })}
        className="w-full border p-2 mb-4"
      ></textarea>
      <textarea
        placeholder="Quiz Subject"
        value={quiz.subject}
        onChange={(e) => setQuiz({ ...quiz, subject: e.target.value })}
        className="w-full border p-2 mb-4"
      ></textarea>

      {quiz.questions.map((q, qIndex) => (
        <div key={qIndex} className="mb-4 p-4 border rounded">
          <input
            type="text"
            placeholder="Quiz Content"
            value={q.content}
            onChange={(e) => updateQuestion(qIndex, "content", e.target.value)}
            className="w-full border p-2 mb-2"
          />
          {q.answerOptions.map((a, aIndex) => (
            <div key={aIndex} className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Answer Option"
                value={a.content}
                onChange={(e) => updateAnswerOptions(qIndex, aIndex, e.target.value)}
                className="w-full border p-2"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => addAnswerOptions(qIndex)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            + Add Answer
          </button>
          {q.correctAnswer.map((a, aIndex) => (
            <div key={aIndex} className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Correct Answer"
                value={a.content}
                onChange={(e) => updateCorrectAnswer(qIndex, aIndex, e.target.value)}
                className="w-full border p-2"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => addCorrectAnswer(qIndex)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            + Add Correct Answer
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addQuestion}
        className="bg-green-500 text-white px-4 py-2 rounded mb-4"
      >
        + Add Question
      </button>

      <button
        type="button"
        onClick={submitQuiz}
        className="bg-purple-600 text-white px-4 py-2 rounded"
      >
        Submit Quiz
      </button>
    </div>
  );
}


export const getServerSideProps: GetServerSideProps = async ({ req, res, resolvedUrl }) => {
  try {
    const session = await verifySession(req);
    if (!session) throw new Error("Unauthorized");

    return { props: { session } };
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      res.setHeader("Set-Cookie", clearSession());
    }

    return { redirect: { destination: `/auth/login?redirect=${encodeURIComponent(resolvedUrl)}`, permanent: false } };
  }
};

