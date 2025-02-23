// initializes a PrismaClient instance 
// Ensuring it doesn't create multiple connections

import {PrismaClient, User } from '@prisma/client';
import { ClientUser } from '@/types/models/User';

// declares variable prisma
let prisma: PrismaClient = new PrismaClient({
  log: ['query', 'info', 'warn', 'error']
});;


if (typeof window === 'undefined') { // check if we running on server

  if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient({
      log: ['query', 'info', 'warn', 'error']
    });
  } 
  else {
    if (!global.prisma) {
      global.prisma = new PrismaClient({
        log: ['query', 'info', 'warn', 'error']
      });      
    }
    prisma = global.prisma;
  }

}

export default prisma;

export const exclude = <T, Key extends keyof T>( //restrict the type of (). Key must be a valid property of T.
  model: T,
  ...keys: Key[] // Accepts multiple properties as parameter to exclude.
): Omit<T, Key> => { // Return value: Omit<T, Key> : a type that removes the specified keys from T.
  if (!model) throw new Error('Model arg is missing.');

  for (const key of keys) {
    delete model[key];
  }
  return model;
};

//  removes the password from User before returning it. 
export const excludeFromUser = (user: User): ClientUser => {
  return exclude(user, 'password');
};
