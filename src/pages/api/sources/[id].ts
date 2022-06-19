import {
  errorHandlingMiddleware,
  SourcerNextApiHandler,
} from '../../../middleware';
import { Controller } from '../../../db';

const errorWrapper = errorHandlingMiddleware(['GET', 'PATCH']);

const handler: SourcerNextApiHandler = async (req, res) => {
  const [id] = [req.query.id].flat();

  if (req.method === 'PATCH') {
    console.log(req.body);
    const updatedSource = await Controller.sources.update(id, req.body);
    return res.json(updatedSource);
  }

  const source = await Controller.sources.get(id);
  return res.json(source);
};

export default errorWrapper(handler);
