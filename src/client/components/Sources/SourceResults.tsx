/* eslint-disable react/no-unescaped-entities */
import {
  FunctionComponent,
  useState,
  useRef,
  useMemo,
  Dispatch,
  SetStateAction,
} from 'react';
import {
  Flex,
  Text,
  Spinner,
  useMediaQuery,
} from '@chakra-ui/react';
import { WarningTwoIcon } from '@chakra-ui/icons';
import { SourceRow } from './SourceRow';
import { SearchForm } from './search/SearchForm';
import { Paginator } from './Paginator';
import { ResultControls } from './ResultControls';
import { SourceWithRelations } from '../../../db';
import { SearchSourceFormData } from '../../hooks';

export interface SourceResultProps {
  sources?: SourceWithRelations[];
  isFetching: boolean;
  setSourceSearchData: Dispatch<SetStateAction<SearchSourceFormData>>;
  sourceSearchData: SearchSourceFormData;
}

export const SourceResults: FunctionComponent<SourceResultProps> = ({
  sources,
  isFetching,
  setSourceSearchData,
  sourceSearchData,
}) => {
  const [isDesktop] = useMediaQuery('(min-width: 800px)');
  const [activeId, setActiveId] = useState<string>('');
  const [expandAll, setExpandAll] = useState(false);
  const { current: setIdCallback } = useRef((id: string) => setActiveId(id));

  const content = useMemo(() => {
    const hasNoSources = !sources || !sources.length;
    if (isFetching) {
      return (
        <Flex justifyContent="center" alignItems="center" direction="column" flexGrow={1}>
          <Spinner colorScheme="orange" size="xl" />
        </Flex>
      );
    }

    if (hasNoSources) {
      return (
        <Flex justifyContent="center" alignItems="center" direction="column" flexGrow={1}>
          <WarningTwoIcon
            color="gray.400"
            fontSize="3em"
            marginTop="5vh"
          />
          <Text mt={2} color="gray.400">
            Doesn't look like there's anything here
          </Text>
        </Flex>
      );
    }

    // might be cool to use some skeletons isntead of a spinner
    return (
      <Flex flexDirection="column" alignItems="center" flexGrow={1} gap={2}>
        {sources && sources.map((source) => (
          <SourceRow
            key={source.id}
            activeId={activeId}
            source={source}
            setActiveId={setIdCallback}
            expandAll={expandAll}
          />
        ))}
      </Flex>
    );
  }, [isFetching, activeId, setIdCallback, sources, expandAll]);

  return (
    <Flex w="100%" gap={2}>
      {isDesktop && (
        <SearchForm
          onSearch={setSourceSearchData}
          setExpandAll={setExpandAll}
          expandAll={expandAll}
        />
      )}
      <Flex flexDirection="column" w="100%" justifyContent="space-between">
        {!isDesktop && (
          <ResultControls
            setSourceSearchData={setSourceSearchData}
            sourceSearchData={sourceSearchData}
          />
        )}
        {content}
        <Paginator
          isFetching={isFetching}
          setSourceSearchData={setSourceSearchData}
          page={sourceSearchData.offset ?? 0}
          currentSourceLength={sources?.length ?? 0}
        />
      </Flex>
    </Flex>
  );
};
