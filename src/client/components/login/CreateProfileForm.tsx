/* eslint-disable react/jsx-props-no-spreading */
import { FunctionComponent } from 'react';
import {
  Flex,
  Button,
  Heading,
  Divider,
  Input,
} from '@chakra-ui/react';
import { Session } from 'next-auth';
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

export const CreateProfileForm: FunctionComponent<{ session: Session }> = ({ session }) => {
  const router = useRouter();
  const isEditUsernameMode = !!router?.query?.edit;
  const username = session?.profile?.username ?? '';
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<CreateProfileFormData>({
    resolver: yupResolver(Validators.profile),
    defaultValues: { username },
  });

  const fetchClient = useFetchClient<User, CreateProfileFormData>('/api/profile', (data) => ({
    method: isEditUsernameMode ? 'PATCH' : 'POST',
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
      maxH="325px"
      p={5}
      mt="5vh"
    >
      <Heading fontSize="2xl" mb={2}>
        {`${isEditUsernameMode ? 'Edit' : 'Create'} Profile`}
      </Heading>
      <Divider />
      {/* @ts-ignore */}
      <form onSubmit={handleSubmit(mutate)}>
        <Flex direction="column" justifyContent="center" mt={2} gap={3}>
          <AppFormControl
            label="Username"
            errorMessage={errors?.username?.message}
            helperText="This will be public to other users"
          >
            <Input autoComplete="off" {...register('username')} />
          </AppFormControl>
          <Button
            type="submit"
            colorScheme="orange"
            isLoading={isLoading}
          >
            {isEditUsernameMode ? 'Update' : 'Create'}
          </Button>
          <Button
            variant="outline"
            colorScheme="orange"
            disabled={isLoading}
            onClick={() => (isEditUsernameMode ? router.push('/') : signOut())}
          >
            Cancel
          </Button>
        </Flex>
      </form>
    </Flex>
  );
};
