import { NextApiResponse } from 'next';
import {
  errorHandlingMiddleware,
  SourcerNextApiHandler,
  withSession,
} from '../../../middleware';
import { Controller } from '../../../db';

const sessionWrapper = withSession();
const errorWrapper = errorHandlingMiddleware(['GET', 'PATCH', 'DELETE']);

const unAuthenticated = (res: NextApiResponse) => res
  .status(401).json({ error: true, message: 'Missing profile Id in session' });

const unAuthorized = (res: NextApiResponse) => res
  .status(403).json({ error: true, message: 'You do not have permission to perform this action' });

const handler: SourcerNextApiHandler = async (req, res) => {
  const [id] = [req.query.id].flat();
  const loggedInUser = req?.session?.profile?.id;

  if (req.method === 'PATCH') {
    if (!loggedInUser) {
      return unAuthenticated(res);
    }
    const sourceToUpdate = await Controller.sources.get(id);
    if (sourceToUpdate?.createdById === loggedInUser) {
      const updatedSource = await Controller.sources.update(id, req.body);
      return res.json(updatedSource);
    }

    return unAuthorized(res);
  }

  if (req.method === 'DELETE') {
    if (!loggedInUser) {
      return unAuthenticated(res);
    }
    const sourceToDelete = await Controller.sources.get(id);
    if (sourceToDelete?.createdById === loggedInUser) {
      const deletedSource = await Controller.sources.delete(id);
      return res.json(deletedSource);
    }

    return unAuthorized(res);
  }

  const source = await Controller.sources.get(id);
  return res.json(source);
};

export default errorWrapper(sessionWrapper(handler));
