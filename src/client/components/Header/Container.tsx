import {
  Flex,
  Heading,
  Spacer,
  useMediaQuery,
} from '@chakra-ui/react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import LoginControls from './LoginControls';
import { ProfileMenu } from './ProfileMenu';

const Container = () => {
  const { data: session } = useSession();
  const [isDesktop] = useMediaQuery('(min-width: 800px)');

  const margin = isDesktop ? 3 : 0;

  return (
    <Flex bg="white" minW="max-content" alignItems="center" gap={2} boxShadow="md" as="header" p={2} mb={margin} minH="68px">
      <Link href="/">
        <Heading
          size="md"
          as="a"
          _hover={{ cursor: 'pointer' }}
        >
          Source Tracker
        </Heading>
      </Link>
      <Spacer />
      {
        session
          ? <ProfileMenu session={session} />
          : <LoginControls />
      }
    </Flex>
  );
};

export default Container;
