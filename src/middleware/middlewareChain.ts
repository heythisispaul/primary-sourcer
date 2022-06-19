import { withSession, WithSessionInit } from './withSession';
import errorHandlingMiddleware, { HttpMethod } from './errorWrapper';
import validateMiddleware, { ValidationOptionsForMethod } from './validate';
import { SourcerNextApiHandler } from './types';

export interface MiddlewareChainInit {
  validationOpts?: ValidationOptionsForMethod;
  methods?: HttpMethod[];
  sessionOpts?: WithSessionInit;
}

const ALL_METHODS: HttpMethod[] = [
  'DELETE',
  'GET',
  'PATCH',
  'POST',
  'PUT',
];

// The gift that keeps on giving: https://github.com/reduxjs/redux/blob/master/src/compose.ts
export const compose = (...funcs: SourcerNextApiHandler<any>[]) => {
  if (funcs.length === 0) {
    // infer the argument type so it is usable in inference down the line
    return <T>(arg: T) => arg;
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce(
    // @ts-ignore
    (a, b) => (...args: any) => a(b(...args)),
  );
};

export const middlewareChain = <T>({
  validationOpts,
  methods,
  sessionOpts = {},
}: MiddlewareChainInit) => (
    wrapped: SourcerNextApiHandler<T>,
  ): SourcerNextApiHandler<any> => {
    const httpMethods = methods ?? ALL_METHODS;
    const funcs = [
      errorHandlingMiddleware(httpMethods),
      withSession(sessionOpts),
    ];

    if (validationOpts) {
      funcs.push(validateMiddleware(validationOpts));
    }

    // @ts-ignore
    return compose([...funcs, wrapped]);
  };
