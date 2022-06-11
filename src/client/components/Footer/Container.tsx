import { FunctionComponent } from 'react';
import { Flex, Link } from '@chakra-ui/react';
import { GitHubIcon } from './GitHubIcon';

export const Container: FunctionComponent = () => (
  <Flex w="100vw" h="60px" justifyContent="center" alignItems="center" bg="white">
    <Link href="https://github.com/heythisispaul/primary-sourcer">
      <GitHubIcon color="gray.400" fontSize="2em" />
    </Link>
  </Flex>
);
