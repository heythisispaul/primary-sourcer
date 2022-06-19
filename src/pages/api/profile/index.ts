import {
  SourcerNextApiHandler,
  middlewareChain,
} from '../../../middleware';
import { Validators } from '../../../validation';
import { Controller } from '../../../db';

const middlewareWrapper = middlewareChain({
  methods: ['GET', 'POST'],
  validationOpts: { schema: Validators.profile },
  sessionOpts: { requireSession: true },
});

const handler: SourcerNextApiHandler = async (req, res) => {
  const { providerId } = req.session!;

  if (req.method === 'POST') {
    const { username } = req.body;
    const createdUser = await Controller.users.create({
      username,
      externalId: providerId!,
    });
    return res.json(createdUser);
  }

  const currentUser = await Controller.users.getByExternalId(providerId!);
  return res.json(currentUser);
};

export default middlewareWrapper(handler);
