import { AttemptEntity } from "@/types/models/Attempt";
import { User } from "@prisma/client";
import prisma from '@/lib-server/prisma';

export const getAttemptById = async (
    id: string,
    session: any
): Promise<AttemptEntity | null> => {
    const email = session?.email
    if (!email) return null;
  
    const me: User | null = await prisma.user.findUnique({ 
        where: {email: email} ,
      });
    
    if (!me || me?.id !== id) return null;

    let attempt = await prisma.attempt.findUnique({
        where: { id },
        include: { attemptQuestions: true } ,
    });

    return attempt;
};

export const getAttemptsByUserQuestion = async (
    id: string,
    session: any
): Promise<AttemptEntity[] | null> => {
    const email = session?.email
    if (!email) return null;
  
    const me: User | null = await prisma.user.findUnique({ 
        where: {email} ,
      });
    
    if (!me) return null;
    
    let attempt = await prisma.attempt.findMany({
        where: { id: id, userId: me.id},
        include: { attemptQuestions: true } ,
    });

    return attempt;
};