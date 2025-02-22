import { Answer } from '@prisma/client';
import { RequiredNotNull} from '@/types';

// --------- Response types ----------
// used in queries and api responses

/**
 * user without password
 */
export type ClientAnswer = Omit<Answer, 'isCorrect'>;
