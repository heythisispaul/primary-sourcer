import { Flex, Heading, Spacer } from '@chakra-ui/react';
import Link from 'next/link';
import LoginControls from './LoginControls';

const Container = () => (
  <Flex bg="white" minW="max-content" alignItems="center" gap={2} boxShadow="md" as="header" p={2} mb={3}>
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
    <LoginControls />
  </Flex>
);

export default Container;
