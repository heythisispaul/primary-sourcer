import { AnyObjectSchema } from 'yup';
import { validate } from '../validation';
import { SourcerNextApiHandler, ValidationSelector } from './types';

export type ValidationOptionsForMethod = {
  schema: AnyObjectSchema;
  selector?: ValidationSelector;
  forceNext?: boolean;
}

const validateMiddleware = (
  validationOptions: ValidationOptionsForMethod,
) => (wrapped: SourcerNextApiHandler): SourcerNextApiHandler => async (req, res) => {
  if (!req.validationErrors) {
    req.validationErrors = [];
  }

  const verbsToSkip = ['GET', 'DELETE', 'OPTIONS'];

  if (verbsToSkip.includes(req.method || '')) {
    return wrapped(req, res);
  }

  console.log('validating');
  console.log(req.body);
  const { selector, schema, forceNext } = validationOptions;
  const value = selector ? selector(req) : req.body;
  const validationError = await validate(schema, value);
  if (validationError && !forceNext) {
    return res.status(400).json({
      error: validationError,
    });
  }
  req.validationErrors.push(validationError as string);
  return wrapped(req, res);
};

export default validateMiddleware;
