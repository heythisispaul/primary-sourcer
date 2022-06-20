import {
  errorHandlingMiddleware,
  validationMiddleware,
  SourcerNextApiHandler,
  withSession,
} from '../../../middleware';
import { Validators } from '../../../validation';
import { Controller } from '../../../db';

const errorWrapper = errorHandlingMiddleware(['POST', 'GET']);
const validationWrapper = validationMiddleware({
  schema: Validators.sourceCreate,
});
const sessionWrapper = withSession();

const handler: SourcerNextApiHandler = async (req, res) => {
  if (req.method === 'POST') {
    const createdById = req.session?.profile?.id;
    if (!createdById) {
      return res.status(401).json({ error: true, message: 'Missing profile Id in session' });
    }
    const createdSource = await Controller.sources.create({
      ...req.body,
      createdById,
    });
    return res.json(createdSource);
  }

  console.log(req.query);
  const sources = await Controller.sources.getPage({});
  return res.json(sources);
};

export default errorWrapper(validationWrapper(sessionWrapper(handler)));
