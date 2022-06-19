import { getSession } from 'next-auth/react';
import { SourcerNextApiHandler, SourcerApiRequest } from './types';

export interface WithSessionInit {
  // eslint-disable-next-line no-unused-vars
  ownershipChecker?: (req: SourcerApiRequest) => boolean;
  requireSession?: boolean;
}

export const withSession = ({
  ownershipChecker,
  requireSession,
}: WithSessionInit) => (wrapped: SourcerNextApiHandler): SourcerNextApiHandler => async (
  req,
  res,
) => {
  const session = await getSession({ req });
  if (requireSession && !session) {
    return res.status(401).json({ error: true });
  }

  req.session = session;
  if (ownershipChecker && !ownershipChecker(req)) {
    return res.status(403).json({ error: true });
  }
  return wrapped(req, res);
};
