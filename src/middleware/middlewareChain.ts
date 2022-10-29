import { WithSessionInit } from './withSession';
import { HttpMethod } from './errorWrapper';
import { ValidationOptionsForMethod } from './validate';
import { SourcerNextApiHandler } from './types';

// TODO: actually get this stuff to work
export interface MiddlewareChainInit {
  validationOpts?: ValidationOptionsForMethod;
  methods?: HttpMethod[];
  sessionOpts?: WithSessionInit;
}

export const ALL_METHODS: HttpMethod[] = [
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
    (a, b) => async (...args: any) => a(b(...args)),
  );
};
