/* eslint-disable no-unused-vars */
import { NextApiRequest, NextApiResponse } from 'next';
import { Session } from 'next-auth';

export type SourcerApiRequest = NextApiRequest & {
  validationErrors: string[];
  session: Session | null;
};

export type ValidationSelector = <T = unknown>(req: SourcerApiRequest) => T;

export type SourcerNextApiHandler<T = any> = (
  req: SourcerApiRequest,
  res: NextApiResponse<T>
) => any | Promise<any>;

// eslint-disable-next-line no-shadow
export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PATCH = 'PATCH'
}
