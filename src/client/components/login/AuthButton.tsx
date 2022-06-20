import { FunctionComponent, memo } from 'react';
import { Button, Icon } from '@chakra-ui/react';
import { signIn } from 'next-auth/react';
import { FaFacebook, FaGoogle, FaDiscord } from 'react-icons/fa';

export interface AuthButtonProps {
  provider: 'facebook' | 'google' | 'discord';
}

export const AuthButton: FunctionComponent<AuthButtonProps> = memo(({ provider }) => {
  const icon = () => {
    switch (provider) {
      case 'facebook':
        return FaFacebook;
      case 'discord':
        return FaDiscord;
      default:
        return FaGoogle;
    }
  };

  const text = `Continue with ${provider.charAt(0).toUpperCase()}${provider.slice(1)}`;

  return (
    <Button
      leftIcon={<Icon as={icon()} />}
      onClick={() => signIn(provider)}
      colorScheme="orange"
      mt={3}
    >
      {text}
    </Button>
  );
});
