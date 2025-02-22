import { Attempt, AttemptRecord } from '@prisma/client';
import { QuestionEntity } from './Question';


export type AttemptEntity = Omit<Attempt, "createdAt" | "updatedAt"> & {
  questions?: QuestionEntity,
  attemptQuestions?: AttemptRecord[]
}