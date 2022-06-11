import { FunctionComponent } from 'react';
import {
  Collapse,
  Text,
  Flex,
  Link,
  useMediaQuery,
} from '@chakra-ui/react';
import { SourceContextMenu } from './SourceContextMenu';
import { TagContainer } from '../common/TagContainer';
import { SourceWithRelations } from '../../../db';
import { toUSDate, toURL } from '../../utils';
import { useEditingSourceControls } from '../../hooks';

export interface SourceRowProps {
  activeId: string;
  // eslint-disable-next-line no-unused-vars
  setActiveId: (index: string) => void;
  source: SourceWithRelations;
}

export const SourceRow: FunctionComponent<SourceRowProps> = ({
  activeId,
  setActiveId,
  source,
}) => {
  const {
    id,
    title,
    href,
    authors,
    tags,
    description,
    createdAt,
  } = source;
  const { setSourceToEdit, sourceToEdit } = useEditingSourceControls();
  const isInEditMode = Boolean(sourceToEdit);
  const [isDesktop] = useMediaQuery('(min-width: 600px)');
  const isExpanded = Boolean((activeId === id));
  const { host } = toURL(href);

  const sourceAndAuthors = (
    <Flex align="baseline">
      <Text ml={2} fontSize=".8em" color="gray.400">by</Text>
      <TagContainer
        items={authors}
        isEditing={false}
        onDelete={() => {}}
        tagProps={{ colorScheme: 'gray', size: 'sm' }}
      />
      <Text fontSize=".8em" color="gray.400" mb={2} pl={1}>
        {`${host}`}
      </Text>
    </Flex>
  );

  return (
    <Flex
      onClick={() => setActiveId(isExpanded ? '' : id)}
      w="100%"
      p={2}
      border="1px"
      borderColor="gray.300"
      borderRadius="8px"
      flexDirection="column"
      bg="white"
      _hover={{ cursor: 'pointer' }}
    >
      <Flex align="baseline" w="100%" justifyContent="space-between" p={1}>
        <Flex justifyContent="center" align="baseline" paddingBottom="0px">
          <Link isExternal href={href} fontSize="1.2em" fontWeight="bold">
            {title}
          </Link>
          {isDesktop && sourceAndAuthors}

        </Flex>
        <SourceContextMenu
          isInEditMode={isInEditMode}
          onEdit={() => setSourceToEdit(source)}
          onDelete={() => {}}
        />
      </Flex>
      {!isDesktop && sourceAndAuthors}
      <TagContainer
        items={tags}
        onDelete={() => {}}
        isEditing={false}
        tagProps={{ colorScheme: 'orange' }}
      />
      <Collapse in={isExpanded}>
        <Text pl={1}>
          {description}
        </Text>
        <Text fontSize=".8em" color="gray.400" mt={2}>
          {`Created ${toUSDate(createdAt)}`}
        </Text>
      </Collapse>
    </Flex>
  );
};
