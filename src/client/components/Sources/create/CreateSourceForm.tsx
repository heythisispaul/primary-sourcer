/* eslint-disable react/jsx-props-no-spreading */
import { FunctionComponent, ReactNode } from 'react';
import {
  Input,
  Flex,
  Textarea,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { AppFormControl } from '../../common/AppFormControl';
import { SearchSelect } from '../../common/SearchSelect';
import { TagContainer } from '../../common/TagContainer';
import { useCreateSourceControls, CreateSourceFormData } from '../../../hooks';
import { Validators } from '../../../../validation';
import { SourceWithRelations } from '../../../../db';

export interface CreateSourceFormProps {
  // eslint-disable-next-line no-unused-vars
  onSubmit: (data: CreateSourceFormData) => void | Promise<void>;
  children: ReactNode;
  sourceToEdit?: SourceWithRelations;
}

export const CreateSourceForm: FunctionComponent<CreateSourceFormProps> = ({
  onSubmit,
  children,
  sourceToEdit,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateSourceFormData>({
    resolver: yupResolver(Validators.sourceCreate),
    defaultValues: { ...sourceToEdit, description: sourceToEdit?.description ?? '' },
  });

  const {
    tags,
    authors,
    onTagSelect,
    onAuthorSelect,
    removeTag,
    removeAuthor,
  } = useCreateSourceControls(setValue, sourceToEdit);

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
        <TagContainer items={authors} isEditing onDelete={removeAuthor} tagProps={{ colorScheme: 'blue' }} mb={2} />
        <AppFormControl
          label="Author(s)"
          errorMessage={errors?.authorIds && 'There was an error with your Author selections'}
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
        <TagContainer items={tags} isEditing onDelete={removeTag} mb={2} tagProps={{ colorScheme: 'orange' }} />
        <AppFormControl
          label="Tags"
          errorMessage={errors?.tagIds && 'There was an error with your tag selections'}
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
