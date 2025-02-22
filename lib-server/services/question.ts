import prisma from "@/lib-server/prisma"
import { Question } from '@prisma/client';
import ApiError from '@/lib-server/error';

export const getQuestionById = async (id: string): Promise<Question> => {
    const question = await prisma.question.findUnique({ where: { id } });
    if (!question) throw new ApiError(`Question with id: ${id} not found.`, 404);
  
    return question;
  };

export const getQuestionByQuiz = async (quizId: string): Promise<Question[]> => {
    const question = await prisma.question.findMany({
        where:  {
            quizId:{
                equals: quizId
            }
        }
    })
    return question;
  };
  