import { Flex, Heading, Spacer } from '@chakra-ui/react';
import LoginControls from './LoginControls';

const Container = () => (
  <Flex minW="max-content" alignItems="center" gap={2} boxShadow="md" as="header" p={2} mb={3}>
    <Heading size="md">Source Tracker</Heading>
    <Spacer />
    <LoginControls />
  </Flex>
);

export default Container;
