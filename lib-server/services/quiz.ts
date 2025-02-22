import prisma from "@/lib-server/prisma"
import { Quiz } from '@prisma/client';
import ApiError from '@/lib-server/error';
import { QuizGetData } from "@/types/models/Quiz";
import { SortDirection } from '@/types';
import { filterSearchTerm } from '@/utils';

// https://www.cnblogs.com/sexintercourse/p/14978855.html
export const getQuizQuestionAndAnswers= async (quizId: string): Promise<Quiz> => {
    const quiz = await prisma.quiz.findUnique({
        where: {
            id: quizId
        },
        include:{
            questions:{
                include:{
                    answers: true
                }
            }
        }
    });
    if (!quiz) throw new ApiError(`Quiz with id: ${quizId} not found.`, 404);
    return quiz;
};

// Submit quiz and get check result
export const submitQuiz = async() =>{
    return
}


export const getQuizOverview = async (
    quizGetData: QuizGetData = {}
): Promise<Quiz[]> => {
    const {
        page = 1,
        limit = 40,
        searchTerm,
        userId,
        email,
        username,
        sortDirection = 'desc',
        published = true,
      } = quizGetData;
    
      const byAuthor = userId || email || username;
      const search = filterSearchTerm(searchTerm);
    
      const where: any = {
        published,
        ...(byAuthor && {
          author: {
            OR: [
              userId ? { id: userId } : undefined,
              email ? { email } : undefined,
              username ? { username } : undefined,
            ].filter(Boolean), // Remove undefined values
          },
        }),
        ...(search && {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { content: { contains: search, mode: 'insensitive' } },
            { author: { username: { contains: search, mode: 'insensitive' } } },
            { author: { name: { contains: search, mode: 'insensitive' } } },
          ],
        }),
      };
    
    let quiz = await prisma.quiz.findMany({
        ...where,
        orderBy: {
          updatedAt: sortDirection as SortDirection,
        },
      });
    return quiz;
};

