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

const controllerMethodMap = {
  author: {
    create: Controller.createAuthor,
    getOptions: Controller.getAuthorOptions,
  },
  tag: {
    create: Controller.createTag,
    getOptions: Controller.getTagOptions,
  },
  region: {
    create: Controller.createRegion,
    getOptions: Controller.getRegionOptions,
  },
};

// TODO: Allow for updates
const handler: SourcerNextApiHandler = async (req, res) => {
  const { entity } = req.query;
  // @ts-ignore
  const controller = controllerMethodMap[entity];
  console.log(entity);

  if (!controller) {
    return res.status(404);
  }

  if (req.method === 'POST') {
    const createdRelatable = await controller.create(req.body);
    return res.json(createdRelatable);
  }

  const relatables = await controller.getOptions(req.query.search as string);
  return res.json(relatables);
};

export default errorWrapper(validationWrapper(handler));
