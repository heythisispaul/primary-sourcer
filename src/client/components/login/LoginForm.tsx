import { FunctionComponent } from 'react';
import {
  Flex,
  Heading,
  Divider,
  Button,
} from '@chakra-ui/react';
import { ChevronLeftIcon } from '@chakra-ui/icons';
import Link from 'next/link';
import { AuthButton } from './AuthButton';

export interface LoginFormProps {
  title?: string;
}

export const LoginForm: FunctionComponent<LoginFormProps> = ({
  title = 'Log In',
}) => (
  <Flex
    borderColor="gray.300"
    borderRadius="8px"
    flexDirection="column"
    bg="white"
    justifyContent="space-around"
    alignItems="center"
    maxH="250px"
    p={5}
    mt="5vh"
  >
    <Heading fontSize="2xl" mb={2}>
      {title}
    </Heading>
    <Divider />
    <Flex direction="column" justifyContent="center" mt={2}>
      <AuthButton provider="google" />
      <AuthButton provider="facebook" />
    </Flex>
    <Link href="/">
      <Button
        variant="link"
        mt={4}
        colorScheme="orange"
        leftIcon={<ChevronLeftIcon />}
      >
        Back
      </Button>
    </Link>
  </Flex>
);
