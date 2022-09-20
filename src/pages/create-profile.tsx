import { Session } from 'next-auth';
import { getLayout } from '../client/components/layouts/Standard';
import { NextPageWithLayout } from './_app';
import { serversidePropsWrapper } from '../middleware';
import { CreateProfileForm } from '../client/components/login/CreateProfileForm';

export type LoginPageProps = {
  session: Session;
}

export const getServerSideProps = serversidePropsWrapper(async ({ context, session }) => {
  // If the user is not logged in, redirect them to the homepage:
  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  // If the user already has a username, set the appropriate query string so the
  // form knows its an update not a create.
  if (session?.profile?.username && !context?.query?.edit) {
    return {
      redirect: {
        destination: '/create-profile?edit=true',
        permanent: false,
      },
    };
  }

  return { props: { session } };
});

const Login: NextPageWithLayout<LoginPageProps> = ({ session }) => (
  <CreateProfileForm session={session} />
);

Login.getLayout = getLayout;

export default Login;
