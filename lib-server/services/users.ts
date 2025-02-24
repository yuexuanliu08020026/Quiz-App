import ApiError from '@/lib-server/error';
import prisma, { excludeFromUser } from '@/lib-server/prisma';
import { getSession, GetSessionParams } from 'next-auth/react';
import {
    ClientUser,
    UserCreateData,
  } from '@/types/models/User';
  import { hash } from 'bcryptjs';

export const getMe = async (params: GetSessionParams): Promise<ClientUser | null> => {
  const session = await getSession(params);
  const email = session?.user?.email;

  if (!email) return null;

  const me = await prisma.user.findUnique({ 
    where: {email} ,
  });

  if (!me) return null;

  return excludeFromUser(me);
};

export const getUser = async (id: string): Promise<ClientUser> => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new ApiError(`User with id: ${id} not found.`, 404);

  return excludeFromUser(user);
};

// -------- pages/api/users/index.ts
export const createUser = async (userCreateData: UserCreateData): Promise<ClientUser> => {
    const { username, email, password: _password } = userCreateData;
  
    // unique email
    const _user1 = await prisma.user.findFirst({
      where: { email },
    });
    if (_user1) throw new ApiError(`User with email: ${email} already exists.`, 409);
  
    // unique username
    const _user2 = await prisma.user.findFirst({
      where: { username },
    });
    if (_user2) throw new ApiError(`Username: ${username} is already taken.`, 409);
  
    const password = await hash(_password, 10);
  
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password,
        role: userCreateData.role
      },
    });
  
    if (!user) throw new ApiError('User cerate failed.', 400);
  
    // stripe pw field before return
    return excludeFromUser(user);
  };