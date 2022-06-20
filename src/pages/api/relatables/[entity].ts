import {
  SourcerNextApiHandler,
  errorHandlingMiddleware,
  validationMiddleware,
  withSession,
} from '../../../middleware';
import { Validators } from '../../../validation';
import { Controller } from '../../../db';

const errorWrapper = errorHandlingMiddleware(['GET', 'POST', 'PATCH']);
const validationWrapper = validationMiddleware({
  schema: Validators.relatable,
});
const sessionWrapper = withSession({ requireSession: true });

// TODO: Allow for updates
const handler: SourcerNextApiHandler = async (req, res) => {
  const { entity } = req.query;
  // TODO: Make this Controller mapping more straightforward
  // @ts-ignore
  const mappedController = Controller[`${entity}s`];
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

export default errorWrapper(validationWrapper(sessionWrapper(handler)));
