import { useQuery } from 'react-query';
import { Session } from 'next-auth';
import { getLayout } from '../client/components/layouts/Standard';
import { NextPageWithLayout } from './_app';
import { CreateSourceButton } from '../client/components/Sources/create/CreateSourceButton';
import { SourceResults } from '../client/components/Sources';
import { serversidePropsWrapper } from '../middleware';
import { SourceSearchParameters, SourceWithRelations } from '../db';
import { useFetchClient } from '../client/hooks';
import { safelyParseJson } from '../client/utils';

export interface HomeProps {
  stringifiedSources?: string;
  error?: string;
  session?: Session;
}

// eslint-disable-next-line @next/next/no-typos
export const getServerSideProps = serversidePropsWrapper(async ({
  context,
  controller,
  session,
}) => {
  const searchOpts = context.query as unknown as SourceSearchParameters;
  const sources = await controller.sources.getPage(searchOpts ?? {});
  return { props: { stringifiedSources: JSON.stringify(sources), session } };
});

const Home: NextPageWithLayout<HomeProps> = ({
  stringifiedSources = '[]',
}) => {
  const sources = safelyParseJson<SourceWithRelations[]>(stringifiedSources);
  const fetchClient = useFetchClient<SourceWithRelations[]>('/api/sources');
  const {
    data,
  } = useQuery(['sources'], fetchClient, { initialData: sources });

  return (
    <CreateSourceButton>
      <SourceResults sources={data ?? []} />
    </CreateSourceButton>
  );
};

Home.getLayout = getLayout;

export default Home;
