import {
  SourcerNextApiHandler,
  errorHandlingMiddleware,
  validationMiddleware,
} from '../../../middleware';
import { Validators } from '../../../validation';
import { Controller } from '../../../db';

const errorWrapper = errorHandlingMiddleware(['GET', 'POST']);
const validationWrapper = validationMiddleware({
  POST: {
    schema: Validators.tagCreate,
  },
});

// TODO: Allow for updates
const handler: SourcerNextApiHandler = async (req, res) => {
  if (req.method === 'POST') {
    const body = JSON.parse(req.body);
    const createdTag = await Controller.createTag(body);
    return res.json(createdTag);
  }

  const tags = await Controller.getTagOptions(req.query.search as string);
  return res.json(tags);
};

export default errorWrapper(validationWrapper(handler));
