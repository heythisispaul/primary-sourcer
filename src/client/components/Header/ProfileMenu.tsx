import {
  Menu, MenuButton, MenuList, MenuItem, MenuDivider, useMediaQuery,
} from '@chakra-ui/react';
import Link from 'next/link';
import { FC, useRef } from 'react';
import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import ProfileAvatar from './ProfileAvatar';

export interface ProfileMenuProps {
  session: Session;
}

export const ProfileMenu: FC<ProfileMenuProps> = ({ session: { profile, user } }) => {
  const avatarRef = useRef();
  const [isLargerThan600] = useMediaQuery('(min-width: 600px)');
  const name = profile?.username || user?.name;

  return (
    <Menu>
      <MenuButton
        as={ProfileAvatar}
        name={name!}
        aria-label="Profile with options"
        cursor="pointer"
        // @ts-ignore
        ref={avatarRef}
        imagesrc={user?.image!}
        shouldRenderName={isLargerThan600}
      />
      <MenuList>
        <Link href="/">
          <MenuItem disabled>
            My Lists
          </MenuItem>
        </Link>
        <MenuDivider />
        <Link href="/create-profile?edit=true">
          <MenuItem disabled>
            Edit Username
          </MenuItem>
        </Link>
        <MenuItem onClick={() => signOut()}>
          Log out
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
