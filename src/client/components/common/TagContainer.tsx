/* eslint-disable react/jsx-props-no-spreading */
import { FunctionComponent } from 'react';
import {
  Flex,
  FlexProps,
  Tag,
  TagLabel,
  TagCloseButton,
  TagProps,
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
  tagProps?: TagProps;
}

export const TagContainer: FunctionComponent<TagContainerProps & FlexProps> = ({
  items,
  isEditing,
  onDelete,
  tagProps = {},
  ...rest // FlexProps
}) => (
  <Flex {...rest} direction="row" align="baseline" flexWrap="wrap" alignContent="space-around">
    {
      items.map(({
        label, value, name, id,
      }) => (
        <Tag
          key={value || id}
          borderRadius="full"
          m={1}
          {...tagProps}
        >
          <TagLabel>{label || name}</TagLabel>
          {isEditing && <TagCloseButton onClick={() => onDelete(value || id as string)} />}
        </Tag>
      ))
    }
  </Flex>
);
