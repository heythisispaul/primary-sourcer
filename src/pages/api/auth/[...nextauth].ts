/* eslint-disable no-param-reassign */
import nextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import DiscordProvider from 'next-auth/providers/discord';
import { Controller } from '../../../db';
// TODO: Get models to hook up with Mongo and NextAuth
// for now, just relying on tokens is fine

const nextAuthHandler = nextAuth({
  secret: '1234',
  providers: [
    FacebookProvider({
      clientId: process.env.FACEBOOK_AUTH_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_AUTH_CLIENT_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_AUTH_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET!,
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_AUTH_CLIENT_ID!,
      clientSecret: process.env.DISCORD_AUTH_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    signIn: async (signInResult) => {
      try {
        const profile = await Controller
          .users
          .getByExternalId(signInResult.user.id);

        if (profile) {
          await Controller.users.update(profile.id, {
            lastLogin: new Date(),
            pictureSrc: signInResult?.profile?.image,
          });
        }
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
    session: async ({ session, token }) => {
      try {
        const profile = await Controller
          .users.getByExternalId(token.sub!);

        session.providerId = token.sub!;
        session.profile = profile;
        session.success = true;
        return session;
      } catch (error) {
        console.error(error);
        return session;
      }
    },
  },
});

export default nextAuthHandler;
