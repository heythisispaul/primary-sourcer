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
}

export const SourceContextMenu: FunctionComponent<SourceContextMenuProps> = ({
  isInEditMode,
  onEdit,
  onDelete,
}) => {
  const onClickWrapper = (on: () => void) => (e: SyntheticEvent) => {
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
        <MenuItem disabled={isInEditMode} onClick={onClickWrapper(onEdit)}>
          Edit
        </MenuItem>
        <MenuItem disabled onClick={onClickWrapper(onDelete)}>
          Delete
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
