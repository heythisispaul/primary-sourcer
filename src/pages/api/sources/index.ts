import {
  errorHandlingMiddleware,
  validationMiddleware,
  SourcerNextApiHandler,
  withSession,
} from '../../../middleware';
import { Validators } from '../../../validation';
import { Controller } from '../../../db';
import { omit, parseBase64ToObject } from '../../../utils';

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
    const inputData = omit<any>(req.body, 'regions', 'authors', 'tags');
    const createdSource = await Controller.sources.create({
      ...inputData,
      createdById,
    });
    return res.json(createdSource);
  }

  const sources = await Controller.sources.getPage(
    parseBase64ToObject(req.query.filter as string) ?? {},
  );
  return res.json(sources);
};

export default errorWrapper(validationWrapper(sessionWrapper(handler)));
