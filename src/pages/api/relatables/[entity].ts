import {
  SourcerNextApiHandler,
  errorHandlingMiddleware,
  validationMiddleware,
} from '../../../middleware';
import { Validators } from '../../../validation';
import { Controller } from '../../../db';

const errorWrapper = errorHandlingMiddleware(['GET', 'POST', 'PATCH']);
// TODO: replace with a generic 'relatables' validator
const validationWrapper = validationMiddleware({
  schema: Validators.authorCreate,
});

// TODO: Allow for updates
const handler: SourcerNextApiHandler = async (req, res) => {
  const { entity } = req.query;
  // @ts-ignore
  const mappedController = Controller[entity];

  if (!mappedController) {
    return res.status(404);
  }

  if (req.method === 'POST') {
    const createdRelatable = await mappedController.create(req.body);
    return res.json(createdRelatable);
  }

  const relatables = await mappedController.getOptions(req.query.search as string);
  return res.json(relatables);
};

export default errorWrapper(validationWrapper(handler));
