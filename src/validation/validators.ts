import { string, object } from 'yup';
import { mustBeFewerThan } from './utils';

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
  });

  export const authorCreate = object({
    name: string()
      .min(5, 'Must be at least 5 characters')
      .max(...mustBeFewerThan(100))
      .required('Name is required'),
  });

  export const tagCreate = object({
    name: string()
      .min(3, 'Must be at least 3 characters')
      .max(...mustBeFewerThan(25))
      .required('Name is required'),
  });
}
