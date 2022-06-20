import { FunctionComponent, SyntheticEvent } from 'react';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';

export interface SourceContextMenuProps {
  isInEditMode: boolean;
  onEdit: () => void;
  onDelete: () => void;
  canEdit?: boolean;
}

export const SourceContextMenu: FunctionComponent<SourceContextMenuProps> = ({
  isInEditMode,
  onEdit,
  onDelete,
  canEdit,
}) => {
  const onClickWrapper = (on: () => void) => (e: SyntheticEvent) => {
    e.stopPropagation();
    e.preventDefault();
    on();
  };

  return (
    <Menu colorScheme="orange">
      <MenuButton
        size="sm"
        as={IconButton}
        aria-label="page options"
        icon={<HamburgerIcon />}
        variant="outline"
        onClick={(e) => e.stopPropagation()}
      />
      <MenuList>
        <MenuItem isDisabled={isInEditMode || !canEdit} onClick={onClickWrapper(onEdit)}>
          Edit
        </MenuItem>
        <MenuItem isDisabled={isInEditMode || !canEdit} onClick={onClickWrapper(onDelete)}>
          Delete
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
