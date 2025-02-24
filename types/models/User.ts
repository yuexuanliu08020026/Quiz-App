import { User } from '@prisma/client';
import { RequiredNotNull} from '@/types';

// --------- Response types ----------
// used in queries and api responses

/**
 * user without password
 */
export type ClientUser = Omit<User, 'password'>;

export type UserLoginData = {
    email: string;
    password:string;
}

// create new type by selecting from existing type.
export type UserCreateData = RequiredNotNull<
  Pick<User, 'username' | 'email' | 'password' | 'role'>
>;
