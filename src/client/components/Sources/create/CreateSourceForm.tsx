/* eslint-disable react/jsx-props-no-spreading */
import { FunctionComponent, ReactNode } from 'react';
import {
  Input,
  Flex,
  Textarea,
  Switch,
  Collapse,
  Button,
} from '@chakra-ui/react';
import { ArrowDownIcon, ArrowUpIcon } from '@chakra-ui/icons';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { AppFormControl } from '../../common/AppFormControl';
import { SearchSelect } from '../../common/SearchSelect';
import { TagContainer } from '../../common/TagContainer';
import { YearInput } from './YearInput';
import { useCreateSourceControls, CreateSourceFormData } from '../../../hooks';
import { Validators } from '../../../../validation';
import { SourceWithRelations } from '../../../../db';
import { thisYear } from '../../../utils';

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
    watch,
    formState: { errors },
  } = useForm<CreateSourceFormData>({
    resolver: yupResolver(Validators.sourceCreate),
    defaultValues: {
      ...sourceToEdit,
      description: sourceToEdit?.description ?? '',
      yearStart: sourceToEdit?.yearStart ?? undefined,
      yearEnd: sourceToEdit?.yearEnd ?? undefined,
    },
  });

  const {
    tags,
    authors,
    regions,
    onTagSelect,
    onAuthorSelect,
    onRegionSelect,
    removeTag,
    removeAuthor,
    removeRegion,
    hasYears,
    toggleHasYears,
    hasRange,
    toggleHasRange,
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
          errorMessage={errors?.authorIds && 'There was an error with your author selections'}
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
        <TagContainer items={regions} isEditing onDelete={removeRegion} mb={2} tagProps={{ colorScheme: 'red' }} />
        <AppFormControl
          label="Regions"
          errorMessage={errors?.regionIds && 'There was an error with your region selections'}
        >
          <SearchSelect
            entity="region"
            allowCreate
            onSelect={onRegionSelect}
            preSelected={regions}
          />
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
        <AppFormControl label="Has Relevant Years" mt={2} errorMessage={errors?.yearType?.message}>
          <Switch isChecked={hasYears} onChange={toggleHasYears} ml={2} colorScheme="orange" />
        </AppFormControl>
        <Collapse in={hasYears}>
          <Flex direction="column">
            <AppFormControl
              label={hasRange ? 'Year (from)' : 'Relevant Year'}
              errorMessage={errors?.yearStart?.message}
            >
              <YearInput
                onChange={(value) => setValue('yearStart', value)}
                initialValue={watch('yearStart') ?? thisYear}
              />
            </AppFormControl>
            <Collapse in={hasRange}>
              <AppFormControl label="Year (to)" errorMessage={errors?.yearEnd?.message}>
                <YearInput
                  onChange={(value) => setValue('yearEnd', value)}
                  initialValue={watch('yearEnd') ?? thisYear}
                />
              </AppFormControl>
            </Collapse>
            <Button
              onClick={toggleHasRange}
              colorScheme="orange"
              variant="ghost"
              rightIcon={hasRange ? <ArrowUpIcon /> : <ArrowDownIcon />}
              mt={3}
            >
              {hasRange ? 'Single year' : 'Use range'}
            </Button>
          </Flex>
        </Collapse>
      </Flex>
      {children}
    </form>
  );
};
