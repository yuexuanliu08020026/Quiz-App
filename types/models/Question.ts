import { Question } from '@prisma/client';
import { Answer } from '@/types/models/Answer'

export type QuestionEntity = Omit<Question, 'correctAnswer'> & {
    correctAnswer: Answer
}