import {z} from 'zod';

const passwordMin = 6,
  passwordMax = 20,
  nameMin = 3,
  nameMax = 25,
  usernameMin = 3,
  usernameMax = 15;

export const userLoginSchema = z.object({
    username: z.string(),
    password: z.string().min(passwordMin).max(passwordMax),
  });