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
import Link from 'next/link';
import { HamburgerIcon } from '@chakra-ui/icons';

const LoginControls = () => {
  const [isDesktop] = useMediaQuery('(min-width: 600px)');

  if (isDesktop) {
    return (
      <ButtonGroup gap={2} colorScheme="orange">
        <Link href="/login">
          <Button variant="outline">
            Log In
          </Button>
        </Link>
        <Link href="/signup">
          <Button>
            Sign Up
          </Button>
        </Link>
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
        <Link href="/login">
          <MenuItem disabled>
            Log In
          </MenuItem>
        </Link>
        <Link href="/signup">
          <MenuItem>
            Sign Up
          </MenuItem>
        </Link>
      </MenuList>
    </Menu>
  );
};

export default LoginControls;
