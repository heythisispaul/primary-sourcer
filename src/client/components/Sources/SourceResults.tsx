/* eslint-disable react/no-unescaped-entities */
import {
  FunctionComponent,
  useState,
  useRef,
  useMemo,
} from 'react';
import { Flex, Text, Spinner } from '@chakra-ui/react';
import { WarningTwoIcon } from '@chakra-ui/icons';
import { SourceRow } from './SourceRow';
import { SearchForm } from './search/SearchForm';
import { SourceWithRelations } from '../../../db';

export interface SourceResultProps {
  sources?: SourceWithRelations[];
  isFetching: boolean;
  // eslint-disable-next-line no-unused-vars
  setSourceSearchData: (stuff: any) => void;
}

export const SourceResults: FunctionComponent<SourceResultProps> = ({
  sources,
  isFetching,
  setSourceSearchData,
}) => {
  const [activeId, setActiveId] = useState<string>('');
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
        {sources.map((source) => (
          <SourceRow
            key={source.id}
            activeId={activeId}
            source={source}
            setActiveId={setIdCallback}
          />
        ))}
      </Flex>
    );
  }, [isFetching, activeId, setIdCallback, sources]);

  return (
    <Flex w="100%" gap={2}>
      <SearchForm onSearch={setSourceSearchData} />
      {content}
    </Flex>
  );
};
