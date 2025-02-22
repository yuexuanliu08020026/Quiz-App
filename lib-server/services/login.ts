import { UserLoginData } from '@/types/models/User';
import { User } from '@prisma/client';
import ApiError from '@/lib-server/error'
import prisma from '@/lib-server/prisma';
import { userLoginSchema } from '../validation';
import { compare } from 'bcryptjs';

export const userLogin = async ({
    email,
    password
}: UserLoginData): Promise<{
    user: User | null;
    error: ApiError | null
}>=>{

    const result = userLoginSchema.safeParse({email,password})

    if (!result.success){
        return{
            user:null,
            error: ApiError.fromZodError(result.error),
        }
    }

    const user = await prisma.user.findUnique({
        where: { email },
    });

  if (!user) {
    return {
      user: null,
      error: new ApiError(`Email : ${email} does not exist.`, 404),
    };
  }

  // password: The plain text password entered by the user.
  // user.password: The hashed password stored in the database.
  const isValid = password && user.password && (await compare(password, user.password));

  if (!isValid) {
    return {
      user,
      error: new ApiError('Invalid password.', 401),
    };
  }

    return {user, error:null};
}