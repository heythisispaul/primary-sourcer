import { FunctionComponent, useState, useRef } from 'react';
import {
  Box,
  Collapse,
  Heading,
  Text,
  Flex,
} from '@chakra-ui/react';
import { TagBadge } from './TagBadge';
import { SourceContextMenu } from './SourceContextMenu';
import { SourceWithRelations } from '../../../db';

export interface SourceRowProps {
  activeId: string;
  // eslint-disable-next-line no-unused-vars
  setActiveId: (index: string) => void;
  source: SourceWithRelations;
}

export const SourceRow: FunctionComponent<SourceRowProps> = ({
  activeId,
  setActiveId,
  source: {
    id,
    title,
    tags,
    description,
  },
}) => {
  const [isInEditMode, setIsInEditMode] = useState(false);
  const { current: setIsEditing } = useRef(() => setIsInEditMode(true));
  const isExpanded = Boolean((activeId === id) && description);

  return (
    <Box onClick={() => setActiveId(id)}>
      <SourceContextMenu isInEditMode={isInEditMode} setIsInEditMode={setIsEditing} />
      <Flex align="baseline">
        <Heading size="md">{title}</Heading>
        {
          tags.map((tag) => (
            <TagBadge
              tag={tag}
              isEditMode={isInEditMode}
              // TODO: add this to an array of ids to delete on 'Save' click.
              onTagRemove={(tagId) => console.log(tagId)}
            />
          ))
        }
      </Flex>
      <Collapse in={isExpanded}>
        <Text>
          {description}
        </Text>
      </Collapse>
      <Collapse in={isInEditMode}>
        <Text>Save and undo buttons go here</Text>
      </Collapse>
    </Box>
  );
};
