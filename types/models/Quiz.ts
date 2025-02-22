import { Answer } from '@prisma/client';
import { SortDirection } from '@/types';

// --------- Query params request types ----------
// used in queries, api args validation and services

export type QuizGetData = Partial<{
    id: string, 
    page: number;
    limit: number;
    userId: string;
    email: string;
    username: string;
    searchTerm: string;
    sortDirection: SortDirection;
    published: boolean;
  }>;
  