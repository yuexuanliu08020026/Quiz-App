import prisma from "@/lib-server/prisma"
import { AttemptRecord, Prisma} from '@prisma/client';
import ApiError from '@/lib-server/error';
import { QuizAnswerSubmit, QuestionAnswerPair, QuizQueryData, QuizEntity } from "@/types/models/Quiz";
import { SortDirection } from '@/types';
import { filterSearchTerm } from '@/utils';
import { Answer } from "@/types/models/Answer";
import { createId } from "@paralleldrive/cuid2";
import { AttemptEntity } from "@/types/models/Attempt";

// Submit quiz and get check result
export const submitQuiz = async(answer: QuizAnswerSubmit): Promise<AttemptEntity> =>{
    const query: QuizQueryData = {
        id: answer.quizid,
        isPublished: true
    };
    const quizs = await getQuizs(query, true);
    let quiz = null;
    if (!quizs){
        throw new ApiError(`Quiz with id: ${answer.quizid} not exist, not published or already end.`, 404)
    }
    else if(quizs.length > 1){
        throw new ApiError(`Multiple quiz instance found with id: ${answer.quizid}`, 500)
    }
    else{
        quiz = quizs[0]
    }

    let qlist = quiz.questions;
    const attemptId = createId();
    let results: AttemptRecord[] = answer.qaList.map( (x:QuestionAnswerPair) => {
        const questions = qlist?.filter( entity => entity.id == x.questionId)
        let question = null
        if (!questions || questions.length != 1){
            throw new ApiError(`Question conflict for question id: ${x.questionId}`, 500)
        }
        else{
            question = questions[0]
        }
        const userAnswer : Answer = Answer.deserialize(x.answerJson)
        const isCorrect : boolean = question.correctAnswer === userAnswer

        return {
            isCorrect: isCorrect,
            answer: x.answerJson,
            questionId: x.questionId,
            attemptId: attemptId,
        } as AttemptRecord;

    })

    const savedAttempt = await prisma.attempt.create({
        data: {
            id: attemptId,
            quizId: answer.quizid,
            userId: answer.userid,
            score: 0,
            attemptQuestions: {
                create: results.map(record => ({
                    questionId: record.questionId,
                    attemptId: record.attemptId,
                    answer: record.answer,
                    isCorrect: record.isCorrect,
                })) as Prisma.AttemptRecordUncheckedCreateWithoutAttemptInput[]
            }
        },
        include: {
            attemptQuestions: true
        }
    });

    return savedAttempt;
}


export const getQuizs = async (
    quizGetData: QuizQueryData = {},
    detail:Boolean = false
): Promise<QuizEntity[]> => {
    const {
        page = 1,
        limit = 40,
        searchTerm,
        userId,
        email,
        username,
        sortDirection = 'desc',
        isPublished = true,
      } = quizGetData;
    
      const byAuthor = userId || email || username;
      const search = filterSearchTerm(searchTerm);
    
      const where: any = {
        ...(quizGetData.id && { id: quizGetData.id }),
        isPublished,
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
        include: {
            questions: detail
        }
      });
    return quiz;
};

