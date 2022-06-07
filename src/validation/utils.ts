/* eslint-disable no-unsafe-optional-chaining */
import { AnyObjectSchema } from 'yup';

export const mustBeFewerThan = (max: number, message?: string) => [
  max,
  message || `Must be few than ${max} characters`,
] as const;

export const validate = async <T>(schema: AnyObjectSchema, value: T) => {
  try {
    await schema.validate(value);
    return null;
  } catch (validationError) {
    // @ts-ignore
    const [message] = (validationError as unknown)?.errors;
    return message as string;
  }
};
