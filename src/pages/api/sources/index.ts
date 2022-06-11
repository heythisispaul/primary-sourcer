import {
  errorHandlingMiddleware,
  validationMiddleware,
  SourcerNextApiHandler,
} from '../../../middleware';
import { Validators } from '../../../validation';
import { Controller } from '../../../db';

const errorWrapper = errorHandlingMiddleware(['POST', 'GET']);
const validationWrapper = validationMiddleware({
  schema: Validators.sourceCreate,
});

const handler: SourcerNextApiHandler = async (req, res) => {
  if (req.method === 'POST') {
    const createdSource = await Controller.createSource(req.body);
    return res.json(createdSource);
  }

  console.log(req.query);
  const sources = await Controller.getPageOfSources({});
  return res.json(sources);
};

export default errorWrapper(validationWrapper(handler));
