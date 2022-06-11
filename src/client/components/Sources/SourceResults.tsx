/* eslint-disable react/no-unescaped-entities */
import { FunctionComponent, useState, useRef } from 'react';
import { Flex, Text } from '@chakra-ui/react';
import { WarningTwoIcon } from '@chakra-ui/icons';
import { SourceRow } from './SourceRow';
import { SourceWithRelations } from '../../../db';

export interface SourceResultProps {
  sources: SourceWithRelations[];
}

export const SourceResults: FunctionComponent<SourceResultProps> = ({ sources }) => {
  const [activeId, setActiveId] = useState<string>('');
  const { current: setIdCallback } = useRef((id: string) => setActiveId(id));

  if (!sources || !sources.length) {
    return (
      <Flex justifyContent="center" alignItems="center" direction="column">
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

  return (
    <Flex flexDirection="column" alignItems="center" w="100%" gap={2}>
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
};
