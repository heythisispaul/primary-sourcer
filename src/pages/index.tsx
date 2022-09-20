import { useQuery } from 'react-query';
import { Session } from 'next-auth';
import { getLayout } from '../client/components/layouts/Standard';
import { NextPageWithLayout } from './_app';
import { CreateSourceButton } from '../client/components/Sources/create/CreateSourceButton';
import { SourceResults } from '../client/components/Sources';
import { serversidePropsWrapper } from '../middleware';
import { parseBase64ToObject } from '../utils';
import { SourceWithRelations } from '../db';
import { useFetchClient, useUrlParamsUpdate } from '../client/hooks';
import { safelyParseJson } from '../client/utils';

export interface HomeProps {
  stringifiedSources?: string;
  error?: string;
  session?: Session;
}

export const getServerSideProps = serversidePropsWrapper(async ({
  context,
  controller,
  session,
}) => {
  const searchOpts = context.query as any;
  const sources = await controller.sources.getPage(parseBase64ToObject(searchOpts.search) ?? {});
  return { props: { stringifiedSources: JSON.stringify(sources), session } };
});

const Home: NextPageWithLayout<HomeProps> = ({
  stringifiedSources = '[]',
}) => {
  const [queryString] = useUrlParamsUpdate('search');
  const sourceQueryKey = ['sources', queryString];
  const sources = safelyParseJson<SourceWithRelations[]>(stringifiedSources);

  console.log(sourceQueryKey);

  const fetchClient = useFetchClient<SourceWithRelations[]>(`/api/sources?filter=${queryString}`);
  const {
    data,
    isFetching,
  } = useQuery(sourceQueryKey, fetchClient, { initialData: sources, staleTime: 180 });

  console.log(isFetching);

  return (
    <CreateSourceButton>
      <SourceResults sources={data ?? undefined} isFetching={isFetching} />
    </CreateSourceButton>
  );
};

Home.getLayout = getLayout;

export default Home;
