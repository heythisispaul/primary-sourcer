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
    schema: Validators.authorCreate,
  },
});

// TODO: Allow for updates
const handler: SourcerNextApiHandler = async (req, res) => {
  if (req.method === 'POST') {
    const createdAuthor = await Controller.createAuthor(req.body);
    return res.json(createdAuthor);
  }

  console.log(req.query.search);
  const authors = await Controller.getAuthorOptions(req.query.search as string);
  return res.json(authors);
};

export default errorWrapper(validationWrapper(handler));
