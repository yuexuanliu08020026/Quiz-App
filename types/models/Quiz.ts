import { Quiz } from '@prisma/client';
import { QuestionEntity } from './Question';
import { SortDirection } from '@/types';

// --------- Query params request types ----------
// used in queries, api args validation and services
export type QuizQueryData = Partial<{
  id: string,
  page: number;
  limit: number;
  userId: string;
  email: string;
  username: string;
  searchTerm: string;
  sortDirection: SortDirection;
  isPublished: boolean;
}>;

export type QuestionAnswerPair = {
  questionId: string;
  answerJson: string;
}

export type QuizAnswerSubmit = {
  userid: string;
  quizid: string;
  qaList: QuestionAnswerPair[];
}

export type QuizEntity = Quiz & {
  questions?: QuestionEntity[],
}