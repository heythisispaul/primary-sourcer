import { FunctionComponent, SyntheticEvent, useMemo } from 'react';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  MenuDivider,
} from '@chakra-ui/react';
import {
  HamburgerIcon,
  EditIcon,
  DeleteIcon,
  AddIcon,
} from '@chakra-ui/icons';

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

  const ownerControls = useMemo(() => {
    if (!canEdit) {
      return null;
    }

    return (
      <>
        <MenuDivider />
        <MenuItem
          isDisabled={isInEditMode}
          onClick={onClickWrapper(onEdit)}
          icon={<EditIcon />}
        >
          Edit
        </MenuItem>
        <MenuItem
          isDisabled={isInEditMode}
          onClick={onClickWrapper(onDelete)}
          icon={<DeleteIcon />}
        >
          Delete
        </MenuItem>
      </>
    );
  }, [isInEditMode, canEdit, onEdit, onDelete]);

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
        <MenuItem isDisabled icon={<AddIcon />}>
          Add To List
        </MenuItem>
        {ownerControls}
      </MenuList>
    </Menu>
  );
};
