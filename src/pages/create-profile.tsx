import { getLayout } from '../client/components/layouts/Standard';
import { NextPageWithLayout } from './_app';
import { serversidePropsWrapper } from '../middleware';
import { CreateProfileForm } from '../client/components/login/CreateProfileForm';

export const getServerSideProps = serversidePropsWrapper(async ({ session }) => {
  console.log(session);
  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  return { props: {} };
});

const Login: NextPageWithLayout = () => (
  <CreateProfileForm />
);

Login.getLayout = getLayout;

export default Login;
