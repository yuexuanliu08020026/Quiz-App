import prisma from "@/lib-server/prisma"
import { AttemptRecord, Prisma} from '@prisma/client';
import ApiError from '@/lib-server/error';
import { QuizAnswerSubmit, QuizQueryData, QuizEntity } from "@/types/models/Quiz";
import { SortDirection } from '@/types';
import { filterSearchTerm } from '@/utils';
import { AttemptEntity } from "@/types/models/Attempt";
import { QuestionEntity } from "@/types/models/Question";
import { Session } from '@/types/models/Session';

export const createQuiz = async (quizDetail: QuizEntity, session: Session): Promise<QuizEntity> => {
    const userId = session.id;
    const userName = session.username;

    if (!userId || !userName) {
        throw new ApiError("Unauthenticated", 403);
    }

    const savedQuiz = await prisma.quiz.create({
        data: {
            authorid: userId,
            authorname: userName,
            title: quizDetail.title,
            subject: quizDetail.subject,
            description: quizDetail.description,
            isPublished: quizDetail.isPublished ? quizDetail.isPublished : true,
            questions: quizDetail.questions && quizDetail.questions.length > 0
                ? {
                    create: quizDetail.questions.map(question => ({
                        content: question.content,
                        answerOptions: JSON.stringify(question.answerOptions ?? []), // Convert array to string
                        correctAnswer: JSON.stringify(question.correctAnswer ?? []) // Convert array to string
                    }))
                }
                : undefined
        },
        include: {
            questions: true // Ensure questions are returned
        }
    });

    // **Parse JSON fields back into arrays**
    return new QuizEntity({
        ...savedQuiz,
        questions: savedQuiz.questions.map(question => new QuestionEntity({
            ...question,
            answerOptions: JSON.parse(question.answerOptions), // Convert back to array
            correctAnswer: JSON.parse(question.correctAnswer) // Convert back to array
        }))
    });
};




// Submit quiz and get check result
export const submitQuizAnswer = async(answer: QuizAnswerSubmit, session: any): Promise<AttemptEntity> =>{
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
    let attemptRecords: AttemptRecord[] = new Array<AttemptRecord>();

    for (const [questionId, answerSet] of Object.entries(answer.qaList)) {
        const questions = qlist?.filter( entity => entity.id == questionId)
        let question = null
        if (!questions || questions.length != 1){
            throw new ApiError(`Question conflict for question id: ${questionId}`, 500)
        }
        else{
            question = questions[0]
            console.log(`Processing Question ID: ${questionId}`);
        }
        const record = {
            answer: JSON.stringify(answerSet),
            questionId: questionId,
        } as Partial<AttemptRecord> as AttemptRecord

        attemptRecords.push(record);
    }

    const savedAttempt = await prisma.attempt.create({
        data: {
            quizId: answer.quizid,
            userId: session.id,
            score: 0,
            attemptQuestions: {
                create: attemptRecords.map(record => ({
                    questionId: record.questionId,
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
    detail: Boolean = false,
    returnAnswer: Boolean = false
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
            OR: [
                userId ? { authorid: userId } : undefined,
                email ? { authorname: email } : undefined,
                username ? { authorname: username } : undefined, 
            ].filter(Boolean), 
        }),
        ...(search && {
            OR: [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { authorname: { contains: search, mode: 'insensitive' } }, // Match correct field name
            ],
        }),
    };
    let quiz = await prisma.quiz.findMany({
        where,
        orderBy: {
            updatedAt: sortDirection as SortDirection,
        },
        include: detail ? { questions: true } : undefined,
        take: limit,
        skip: (page - 1) * limit,
    });

    return quiz.map((x) => new QuizEntity(x));;
};
