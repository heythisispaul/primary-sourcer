import { getLayout } from '../client/components/layouts/Standard';
import { NextPageWithLayout } from './_app';
import { CreateSourceButton } from '../client/components/Sources/CreateSourceButton';

const Home: NextPageWithLayout = () => {
  console.log('meow');
  return (
    <>
      <div>hello</div>
      <CreateSourceButton />
    </>
  );
};

Home.getLayout = getLayout;

export default Home;
