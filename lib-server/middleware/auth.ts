import { getMe } from '@/lib-server/services/users';
import ApiError from '@/lib-server/error';
import { NextApiRequest, NextApiResponse } from 'next';

type NextHandler = (err?: any) => void;

export const requireAuth = async (
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextHandler
) => {
  const me = await getMe({ req });

  // dont attach req.user because it complicates types
  const error = me?.id ? undefined : new ApiError('You are not logged in.', 401);
  next(error);
};
