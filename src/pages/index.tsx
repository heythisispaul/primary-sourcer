import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Session } from 'next-auth';
import { getLayout } from '../client/components/layouts/Standard';
import { NextPageWithLayout } from './_app';
import { CreateSourceButton } from '../client/components/Sources/create/CreateSourceButton';
import { SourceResults } from '../client/components/Sources';
import { serversidePropsWrapper } from '../middleware';
import { parseBase64ToObject } from '../utils';
import { SourceWithRelations } from '../db';
import { safelyParseJson, DEFAULT_SEARCH_DATA } from '../client/utils';
import { SearchSourceFormData } from '../client/hooks';

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
  const sourceSearchOptions = context.query?.search as string;
  const sources = await controller.sources.getPage(parseBase64ToObject(sourceSearchOptions) ?? {});
  return { props: { stringifiedSources: JSON.stringify(sources), session } };
});

const Home: NextPageWithLayout<HomeProps> = ({
  stringifiedSources = '[]',
}) => {
  const [sourceSearchData, setSourceSearchData] = useState<SearchSourceFormData>(
    DEFAULT_SEARCH_DATA,
  );
  const sourceQueryKey = ['sources', sourceSearchData];
  const queryClient = useQueryClient();

  // TODO: fetch the next page offset on page change and store it to the cache
  const fetchSources = async () => {
    const dataString = Buffer.from(JSON.stringify(sourceSearchData)).toString('base64');
    const response = await fetch(`/api/sources?filter=${dataString}`);
    const sourceData = await response.json();
    return sourceData as SourceWithRelations[];
  };

  // Populate the cache with the SSR'd data:
  useEffect(() => {
    const sources = safelyParseJson<SourceWithRelations[]>(stringifiedSources);
    queryClient.setQueryData(['sources', DEFAULT_SEARCH_DATA], sources);
  }, [queryClient, stringifiedSources]);

  const {
    data,
    isFetching,
  } = useQuery(
    sourceQueryKey,
    fetchSources,
    { staleTime: 60000 },
  );

  return (
    <CreateSourceButton>
      <SourceResults
        sources={data}
        isFetching={isFetching}
        setSourceSearchData={setSourceSearchData}
        sourceSearchData={sourceSearchData}
      />
    </CreateSourceButton>
  );
};

Home.getLayout = getLayout;

export default Home;
