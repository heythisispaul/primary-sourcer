import {
  Menu,
  MenuButton,
  IconButton,
  MenuList,
  MenuItem,
  Button,
  ButtonGroup,
  useMediaQuery,
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';

const LoginControls = () => {
  const [isDesktop] = useMediaQuery('(min-width: 600px)');

  if (isDesktop) {
    return (
      <ButtonGroup gap={2} colorScheme="orange">
        <Button disabled variant="outline">
          Log In
        </Button>
        <Button disabled>
          Sign Up
        </Button>
      </ButtonGroup>
    );
  }

  return (
    <Menu colorScheme="orange">
      <MenuButton
        as={IconButton}
        aria-label="page options"
        icon={<HamburgerIcon />}
        variant="outline"
      />
      <MenuList>
        <MenuItem disabled>
          Log In
        </MenuItem>
        <MenuItem disabled>
          Sign Up
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default LoginControls;
