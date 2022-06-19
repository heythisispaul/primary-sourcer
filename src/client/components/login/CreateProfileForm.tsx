/* eslint-disable react/jsx-props-no-spreading */
import { FunctionComponent } from 'react';
import {
  Flex,
  Button,
  Heading,
  Divider,
  Input,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from 'react-query';
import { signOut } from 'next-auth/react';
import { User } from '@prisma/client';
import { useFetchClient } from '../../hooks';
import { Validators } from '../../../validation';
import { AppFormControl } from '../common/AppFormControl';

export interface CreateProfileFormData {
  username: string;
}

export const CreateProfileForm: FunctionComponent = () => {
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<CreateProfileFormData>({ resolver: yupResolver(Validators.username) });

  const fetchClient = useFetchClient<User, CreateProfileFormData>('/api/profile', (data) => ({
    method: 'POST',
    body: JSON.stringify(data),
  }));

  const { mutate, isLoading } = useMutation<User, Error, CreateProfileFormData>(fetchClient, {
    onSuccess: () => router.push('/'),
  });

  return (
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
        Create Profile
      </Heading>
      <Divider />
      {/* @ts-ignore */}
      <form onSubmit={handleSubmit(mutate)}>
        <Flex direction="column" justifyContent="center" mt={2}>
          <AppFormControl
            label="Username"
            errorMessage={errors?.username?.message}
          >
            <Input {...register('username')} />
          </AppFormControl>
          <Button
            type="submit"
            colorScheme="orange"
            isLoading={isLoading}
          >
            Create
          </Button>
          <Button
            colorScheme="orange"
            disabled={isLoading}
            onClick={() => signOut()}
          >
            Cancel
          </Button>
        </Flex>
      </form>
    </Flex>
  );
};
