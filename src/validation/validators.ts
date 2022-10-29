/* eslint-disable consistent-return */
import {
  string,
  object,
  array,
  number,
  NumberSchema,
} from 'yup';
import { mustBeFewerThan } from './utils';

// TODO: simplify all of the 'relatables' into one schema
export namespace Validators {
  const sourceTitle = string()
    .min(4, 'Must be at least 4 characters')
    .max(200, 'Must be fewer than 200 characters');

  const sourceDescription = string()
    .max(...mustBeFewerThan(250));

  export const sourceCreate = object({
    title: sourceTitle
      .required('Title is required'),
    description: sourceDescription,
    href: string()
      .url('Must be a valid URL')
      .required('Source is required'),
    tagIds: array().of(string()).min(1).max(10),
    authorIds: array().of(string()).min(1).max(10),
    yearType: string().oneOf(['NONE', 'POINT', 'RANGE']),
    yearStart: number().min(-10000).nullable(),
    // @ts-ignore
    yearEnd: number().nullable().when(['yearType', 'yearStart'], (yearType: string, yearStart: number, schema: NumberSchema) => {
      schema.max(2500);
      if (yearType === 'RANGE') {
        return schema.min(yearStart, 'Must be greater than year end range');
      }
      return schema;
    }),
  }).strict();

  export const relatable = object({
    name: string()
      .min(4, 'Must be at least 4 characters')
      .max(...mustBeFewerThan(100))
      .required('Name is required'),
  });

  export const profile = object({
    username: string()
      .min(3, 'must be at least 3 characters')
      .max(...mustBeFewerThan(25))
      .required('Username is required'),
  });
}
