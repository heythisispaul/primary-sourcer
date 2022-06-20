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
  schema: Validators.profile,
});
const sessionWraper = withSession();

const handler: SourcerNextApiHandler = async (req, res) => {
  const { providerId, user } = req.session!;

  if (req.method === 'POST') {
    const { username } = req.body;
    const createdUser = await Controller.users.create({
      username,
      externalId: providerId!,
      pictureSrc: user?.image ?? null,
    });
    return res.json(createdUser);
  }

  const currentUser = await Controller.users.getByExternalId(providerId!);
  return res.json(currentUser);
};

export default errorWrapper(validationWrapper(sessionWraper(handler)));
