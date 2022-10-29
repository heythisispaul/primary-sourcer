/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-unused-vars
import NextAuth from 'next-auth';
// eslint-disable-next-line import/no-extraneous-dependencies
import { User } from '.prisma/client';

declare module '*.svg' {
  const content: any;
  export const ReactComponent: any;
  export default content;
}

declare module 'next-auth' {
  interface Session {
    success: boolean;
    profile?: User | null;
    providerId?: string;
  }
}
