/* eslint-disable no-unused-vars */
import { NextApiRequest, NextApiResponse } from 'next';

export type SourcerApiRequest = NextApiRequest & { validationErrors: string[] };

export type ValidationSelector = <T = unknown>(req: SourcerApiRequest) => T;

export type SourcerNextApiHandler<T = unknown> = (
  req: SourcerApiRequest,
  res: NextApiResponse<T>
) => unknown | Promise<unknown>;

// eslint-disable-next-line no-shadow
export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PATCH = 'PATCH'
}
