import { FunctionComponent } from 'react';
import {
  HStack,
  Tag,
  TagLabel,
  TagCloseButton,
} from '@chakra-ui/react';

// This is lazy, but it can either take in a relatable data model
// or a react-select option
export interface TagContainerProps {
  items: {
    label?: string,
    value?: string,
    name?: string;
    id?: string;
  }[];
  isEditing: boolean;
  // eslint-disable-next-line no-unused-vars
  onDelete: (id: string) => void;
}

export const TagContainer: FunctionComponent<TagContainerProps> = ({
  items,
  isEditing,
  onDelete,
}) => (
  <HStack align="baseline" spacing={2}>
    {
      items.map(({
        label, value, name, id,
      }) => (
        <Tag
          key={value}
          borderRadius="full"
          colorScheme="orange"
        >
          <TagLabel>{label || name}</TagLabel>
          {isEditing && <TagCloseButton onClick={() => onDelete(value || id as string)} />}
        </Tag>
      ))
    }
  </HStack>
);
