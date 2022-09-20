/* eslint-disable react/jsx-props-no-spreading */
import { forwardRef } from 'react';
import Image from 'next/image';
import {
  HStack,
  Avatar,
  Text,
  AvatarProps,
} from '@chakra-ui/react';

export interface ProfileAvatarProps extends AvatarProps {
  name: string;
  imagesrc?: string;
  shouldRenderName: boolean;
}

// the TL;DR is that this solves two problems:
// 1. Only the Next/Image component will preload. Without it, there's an image flicker
// on route transitions.
// 2. A ref is needed to be passed to any custom component so that the Chakra menu
// knows which node to mount relative too

const ProfileAvatar = forwardRef<
  HTMLDivElement,
  ProfileAvatarProps
>(({ shouldRenderName, ...props }, ref) => (
  <HStack
    {...props}
    spacing={3}
    ref={ref}
    className="header-avatar"
    p={2}
    _hover={{ backgroundColor: 'gray.200' }}
  >
    {shouldRenderName && <Text mr={2} color="gray.500">{props.name}</Text>}
    {
      props.imagesrc
        ? (
          <Image
            height={32}
            width={32}
            src={props.imagesrc}
            alt="user profile"
            style={{ borderRadius: '50%' }}
            priority
          />
        )
        : <Avatar {...props} />
    }
  </HStack>
));

ProfileAvatar.displayName = 'ProfileAvatar';

export default ProfileAvatar;
