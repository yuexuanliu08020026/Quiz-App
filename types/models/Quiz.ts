import { Quiz } from '@prisma/client';
import { QuestionEntity } from './Question';
import { SortDirection } from '@/types';
import { Answer } from './Answer';

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

export type QuizAnswerSubmit = {
  userid: string;
  quizid: string;
  qaList: Record<string, Set<Answer>>;
}

type QuizEntityType = Omit<Quiz, "createdAt" | "updatedAt"> & {
  questions?: QuestionEntity[],
  finalScore?: number
}

export class QuizEntity implements QuizEntityType {
  id!: string;
  subject!: string;
  description!: string;
  title!: string;
  authorid!: string;
  authorname!: string;
  isPublished!: boolean;
  questions?: QuestionEntity[];
  finalScore?: number

  constructor(quiz?: any) {
    if (quiz) {
      Object.assign(this, quiz);
      this.questions =
        quiz.questions?.map((question: any) => new QuestionEntity(question)) || [];
    } else {
      this.id = "";
      this.subject = "";
      this.description = "";
      this.title = "";
      this.authorid = "";
      this.authorname = "";
      this.isPublished = false;
      this.questions = [];
      this.finalScore = undefined;
    }
  }
}