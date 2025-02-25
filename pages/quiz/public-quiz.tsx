import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { QuizEntity } from '@/types/models/Quiz';

const QuizListPage: React.FC = () => {
  const [quizzes, setQuizzes] = useState<QuizEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await fetch('/api/quiz/public-quiz');
        const data: QuizEntity[] = await res.json();
        setQuizzes(data);
      } catch (error) {
        console.error('Failed to fetch quizzes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Ongoing Quizzes</h1>
      {loading ? (
        <p>Loading quizzes...</p>
      ) : (
        <div className="grid gap-4">
          {quizzes.length > 0 ? (
            quizzes.map((quiz) => (
              <div 
                key={quiz.id} 
                className="p-4 border rounded-lg shadow-md cursor-pointer hover:bg-gray-100 transition"
                onClick={() => router.push(`/quiz/${quiz.id}`)}
              >
                <h2 className="text-lg font-semibold">{quiz.title}</h2>
                <p className="text-sm text-gray-600">{quiz.description}</p>
                <div className="text-xs text-gray-500 mt-2">
                  <span>By {quiz.authorname}</span>
                </div>
              </div>
            ))
          ) : (
            <p>No ongoing quizzes available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizListPage;
