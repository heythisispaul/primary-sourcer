/* eslint-disable no-unused-vars */
import {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  GetServerSideProps,
} from 'next';
import { Session } from 'next-auth';
import { getSession } from 'next-auth/react';
import { Controller } from '../db';

export type WrappedServersideArgs = {
  context: GetServerSidePropsContext,
  controller: typeof Controller,
  session?: Session | null,
};

export type WrappedServerSideProps<T = unknown> = (
  args: WrappedServersideArgs,
) => Promise<GetServerSidePropsResult<T>>;

export const serversidePropsWrapper = <T>(
  wrapped: WrappedServerSideProps<T>,
): GetServerSideProps => async (context) => {
    try {
      const session = await getSession(context);

      // if (session && !session.profile) {
      //   return {
      //     redirect: {
      //       destination: '/create-profile',
      //       permanent: false,
      //     },
      //   };
      // }

      const result = await wrapped({ context, controller: Controller, session });
      return result;
    } catch (error: unknown) {
      // @ts-ignore
      return { props: { error: error?.toString() } };
    }
  };
