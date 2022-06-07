import { FunctionComponent, useState, useRef } from 'react';
import { Flex } from '@chakra-ui/react';
import { SourceRow } from './SourceRow';
import { SourceWithRelations } from '../../../db';

export interface SourceResultProps {
  sources: SourceWithRelations[];
}

export const SourceResults: FunctionComponent<SourceResultProps> = ({ sources }) => {
  const [activeId, setActiveId] = useState<string>('');
  const { current: setIdCallback } = useRef((id: string) => setActiveId(id));

  return (
    <Flex flexDirection="column" w="100%" gap={2}>
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
