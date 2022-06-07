import { FunctionComponent } from 'react';
import { Tag, TagLabel, TagCloseButton } from '@chakra-ui/react';
import { Tag as SourceTag } from '@prisma/client';

export interface TagBadgesProps {
  tag: Pick<SourceTag, 'id' | 'name'>;
  isEditMode: boolean;
  // eslint-disable-next-line no-unused-vars
  onTagRemove: (id: string) => void | Promise<void>;
}

export const TagBadge: FunctionComponent<TagBadgesProps> = ({ tag, isEditMode, onTagRemove }) => (
  <Tag
    size="md"
    colorScheme="orange"
  >
    <TagLabel textTransform="uppercase">
      {tag.name}
    </TagLabel>
    {isEditMode && <TagCloseButton onClick={() => onTagRemove(tag.id)} />}
  </Tag>
);
