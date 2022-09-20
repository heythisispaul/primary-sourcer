/* eslint-disable react/jsx-props-no-spreading */
import { FunctionComponent, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDebouncedCallback } from 'use-debounce';
import {
  Flex,
  Input,
} from '@chakra-ui/react';
import {
  useUrlParamsUpdate,
  useRelatableControls,
  SearchSourceFormData,
} from '../../../hooks';
import { AppFormControl } from '../../common/AppFormControl';
import { parseBase64ToObject } from '../../../../utils';
import { SearchSelect } from '../../common/SearchSelect';
import { TagContainer } from '../../common/TagContainer';
import { YearInput } from '../create/YearInput';

export const SearchForm: FunctionComponent = () => {
  const [searchString, setSearchString] = useUrlParamsUpdate('search');
  const parsedSearchValues = parseBase64ToObject(searchString);
  const setDefaults = {
    authorsInclusive: parsedSearchValues?.authorsInclusive ?? true,
    tagsInclusive: parsedSearchValues?.tagsInclusive ?? true,
    regionsInclusive: parsedSearchValues?.regionsInclusive ?? true,
  };
  const {
    setValue,
    handleSubmit,
    register,
    watch,
    getValues,
    reset,
    formState: { errors, isDirty },
  } = useForm<SearchSourceFormData>({
    defaultValues: {
      ...parsedSearchValues,
      ...setDefaults,
    },
  });

  const {
    authors,
    removeAuthor,
    onAuthorSelect,
    regions,
    removeRegion,
    onRegionSelect,
    tags,
    onTagSelect,
    removeTag,
    resetRelatables,
    areRelatablesDirty,
  } = useRelatableControls(setValue as any, parsedSearchValues);

  const submitHandler = handleSubmit((data: SearchSourceFormData) => {
    if (isDirty) {
      const submitBuffer = Buffer.from(JSON.stringify(data));
      setSearchString(submitBuffer.toString('base64'));
    }
  });

  const handleReset = () => {
    resetRelatables();
    reset(undefined, { keepDirty: false });
    setSearchString(null);
  };

  const { onChange: titleOnChange, ...titleProps } = register('title');

  const debouncedTitleOnChange = useDebouncedCallback(titleOnChange, 500);

  const {
    title,
    authorIds,
    tagIds,
    regionIds,
    yearEnd,
    yearStart,
    meOnly,
    tagsInclusive,
    regionsInclusive,
    authorsInclusive,
  } = watch();

  useEffect(() => {
    console.log('firing');
    const values = getValues();
    if (isDirty || areRelatablesDirty) {
      const submitBuffer = Buffer.from(JSON.stringify(values));
      setSearchString(submitBuffer.toString('base64'));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    title,
    authorIds?.length,
    tagIds?.length,
    regionIds?.length,
    yearEnd,
    yearStart,
    meOnly,
    tagsInclusive,
    regionsInclusive,
    authorsInclusive,
    isDirty,
    getValues,
    areRelatablesDirty,
  ]);

  return (
    <Flex
      p={3}
      marginBottom={2}
      border="1px"
      borderColor="gray.300"
      borderRadius="8px"
      flexDirection="column"
      bg="white"
    >
      <form onSubmit={submitHandler}>
        <AppFormControl label="Search">
          <Input
            onChange={debouncedTitleOnChange}
            {...titleProps}
            placeholder="Title"
          />
        </AppFormControl>
        <AppFormControl
          label="Author(s)"
          errorMessage={errors?.authorIds && 'There was an error with your author selections'}
        >
          <SearchSelect
            entity="author"
            onSelect={onAuthorSelect}
            preSelected={authors}
          />
        </AppFormControl>
        <TagContainer
          items={authors}
          isEditing
          onDelete={removeAuthor}
          tagProps={{ colorScheme: 'blue' }}
          mb={2}
          onIncludeAll={(value) => setValue('authorsInclusive', value)}
          includeAll={watch('authorsInclusive')}
        />
        <AppFormControl
          label="Regions"
          errorMessage={errors?.regionIds && 'There was an error with your region selections'}
        >
          <SearchSelect
            entity="region"
            onSelect={onRegionSelect}
            preSelected={regions}
          />
        </AppFormControl>
        <TagContainer
          items={regions}
          isEditing
          onDelete={removeRegion}
          mb={2}
          tagProps={{ colorScheme: 'red' }}
          onIncludeAll={(value) => setValue('regionsInclusive', value)}
          includeAll={watch('regionsInclusive')}
        />
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
        <TagContainer
          items={tags}
          isEditing
          onDelete={removeTag}
          mb={2}
          tagProps={{ colorScheme: 'orange' }}
          onIncludeAll={(value) => setValue('tagsInclusive', value)}
          includeAll={watch('tagsInclusive')}
        />
        <AppFormControl
          label="Year (from)"
          errorMessage={errors?.yearStart?.message}
        >
          <YearInput
            onChange={(value) => setValue('yearStart', value)}
            initialValue={getValues('yearStart') as any}
          />
        </AppFormControl>
        <AppFormControl
          label="Year (To)"
          errorMessage={errors?.yearStart?.message}
        >
          <YearInput
            onChange={(value) => setValue('yearEnd', value)}
            initialValue={getValues('yearEnd') as any}
          />
        </AppFormControl>
        <button type="button" onClick={handleReset}>reset</button>
      </form>
    </Flex>
  );
};
