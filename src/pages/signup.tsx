import { getLayout } from '../client/components/layouts/Standard';
import { NextPageWithLayout } from './_app';
import { serversidePropsWrapper } from '../middleware';
import { LoginForm } from '../client/components/login/LoginForm';

export const getServerSideProps = serversidePropsWrapper(async ({ session }) => {
  if (session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  return { props: {} };
});

const Signup: NextPageWithLayout = () => (
  <LoginForm title="Sign Up" />
);

Signup.getLayout = getLayout;

export default Signup;
