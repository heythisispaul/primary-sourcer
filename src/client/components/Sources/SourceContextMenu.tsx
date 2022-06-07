import { FunctionComponent } from 'react';
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
  setIsInEditMode: () => void;
}

export const SourceContextMenu: FunctionComponent<SourceContextMenuProps> = ({
  isInEditMode,
  setIsInEditMode,
}) => (
  <Menu colorScheme="orange">
    <MenuButton
      as={IconButton}
      aria-label="page options"
      icon={<HamburgerIcon />}
      variant="outline"
    />
    <MenuList>
      <MenuItem disabled={isInEditMode} onClick={setIsInEditMode}>
        Edit
      </MenuItem>
      <MenuItem disabled>
        Delete
      </MenuItem>
    </MenuList>
  </Menu>
);
