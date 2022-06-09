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
import { SearchSelect } from '../common/SearchSelect';
import { TagContainer } from '../common/TagContainer';
import { useCreateSourceControls, CreateSourceFormData } from '../../hooks';
import { Validators } from '../../../validation';

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
    setValue,
    formState: { errors },
  } = useForm<CreateSourceFormData>({
    resolver: yupResolver(Validators.sourceCreate),
  });

  const {
    tags,
    authors,
    onTagSelect,
    onAuthorSelect,
    removeTag,
    removeAuthor,
  } = useCreateSourceControls(setValue);

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
        <TagContainer items={authors} isEditing onDelete={removeAuthor} />
        <AppFormControl
          label="Author(s)"
          errorMessage={errors?.authorIds && 'One or more authors are not able to be added'}
        >
          <SearchSelect
            entity="author"
            allowCreate
            onSelect={onAuthorSelect}
            preSelected={authors}
          />
        </AppFormControl>
        <AppFormControl
          label="Description"
          errorMessage={errors?.description?.message}
        >
          <Textarea {...register('description')} />
        </AppFormControl>
        <TagContainer items={tags} isEditing onDelete={removeTag} />
        <AppFormControl
          label="Tags"
          errorMessage={errors?.tagIds && 'One or more tags are not able to be added'}
        >
          <SearchSelect
            entity="tag"
            allowCreate
            onSelect={onTagSelect}
            preSelected={tags}
          />
        </AppFormControl>
      </Flex>
      {children}
    </form>
  );
};
