import { AnyObjectSchema } from 'yup';
import { validate } from '../validation';
import { SourcerNextApiHandler, ValidationSelector } from './types';

export interface ValidationOptionsForMethod {
  [key: string]: {
    schema: AnyObjectSchema;
    selector?: ValidationSelector;
    forceNext?: boolean;
  }
}

const validateMiddleware = (
  validationOptions: ValidationOptionsForMethod,
) => (wrapped: SourcerNextApiHandler): SourcerNextApiHandler => async (req, res) => {
  if (!req.validationErrors) {
    req.validationErrors = [];
  }

  const validatorConfig = validationOptions[req.method ?? ''];

  if (validatorConfig) {
    const { selector, schema, forceNext } = validatorConfig;
    const value = selector ? selector(req) : req.body;
    const validationError = await validate(schema, value);
    if (validationError && !forceNext) {
      return res.status(400).json({
        error: validationError,
      });
    }
    req.validationErrors.push(validationError as string);
  }
  return wrapped(req, res);
};

export default validateMiddleware;
