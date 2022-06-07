/* eslint-disable react/jsx-props-no-spreading */
import { FunctionComponent, ReactNode } from 'react';
import {
  Input,
  Flex,
  Textarea,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { AppFormControl } from '../common/AppFormControl';
import { Validators } from '../../../validation';

export interface CreateSourceFormData {
  title: string;
  href: string;
  description?: string;
  tagIds: string[];
  authorIds: string[];
}

export interface CreateSourceFormProps {
  // eslint-disable-next-line no-unused-vars
  onSubmit: (data: CreateSourceFormData) => void | Promise<void>;
  children: ReactNode;
}

export const CreateSourceForm: FunctionComponent<CreateSourceFormProps> = ({
  onSubmit,
  children,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateSourceFormData>({
    resolver: yupResolver(Validators.sourceCreate),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex flexDirection="column">
        <AppFormControl
          label="Title"
          errorMessage={errors?.title?.message}
        >
          <Input {...register('title')} />
        </AppFormControl>
        <AppFormControl
          label="Source URL"
          errorMessage={errors?.href?.message}
        >
          <Input {...register('href')} />
        </AppFormControl>
        <AppFormControl
          label="Description"
          errorMessage={errors?.description?.message}
        >
          <Textarea {...register('description')} />
        </AppFormControl>
      </Flex>
      {children}
    </form>
  );
};
