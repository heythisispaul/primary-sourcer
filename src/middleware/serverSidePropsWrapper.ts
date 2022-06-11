/* eslint-disable no-unused-vars */
import {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  GetServerSideProps,
} from 'next';
import { Controller } from '../db';

export type WrappedServerSideProps<T = unknown> = (
  context: GetServerSidePropsContext,
  controller: typeof Controller,
) => Promise<GetServerSidePropsResult<T>>;

export const serversidePropsWrapper = <T>(
  wrapped: WrappedServerSideProps<T>,
): GetServerSideProps => async (context) => {
    try {
      const result = await wrapped(context, Controller);
      return result;
    } catch (error: unknown) {
      // @ts-ignore
      return { props: { error: error?.toString() } };
    }
  };
