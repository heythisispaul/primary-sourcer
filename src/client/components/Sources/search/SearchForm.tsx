/* eslint-disable react/jsx-props-no-spreading */
import {
  FunctionComponent,
  useEffect,
  Dispatch,
  SetStateAction,
} from 'react';
import { useForm } from 'react-hook-form';
import { useDebouncedCallback } from 'use-debounce';
import {
  Button,
  Divider,
  Flex,
  Input,
  Switch,
} from '@chakra-ui/react';
import {
  useRelatableControls,
  SearchSourceFormData,
} from '../../../hooks';
import { AppFormControl } from '../../common/AppFormControl';
import { DEFAULT_SEARCH_DATA } from '../../../utils';
import { SearchSelect } from '../../common/SearchSelect';
import { TagContainer } from '../../common/TagContainer';
import { YearInput } from '../create/YearInput';

export type SearchFormProps = {
  // eslint-disable-next-line no-unused-vars
  onSearch: (data: SearchSourceFormData) => void;
  setExpandAll: Dispatch<SetStateAction<boolean>>;
  expandAll: boolean;
}

export const SearchForm: FunctionComponent<SearchFormProps> = ({
  onSearch,
  setExpandAll,
  expandAll,
}) => {
  const {
    setValue,
    handleSubmit,
    register,
    watch,
    getValues,
    reset,
    formState: { errors, isDirty },
  } = useForm<SearchSourceFormData>({
    defaultValues: DEFAULT_SEARCH_DATA,
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
  } = useRelatableControls(setValue);

  const submitHandler = handleSubmit((data: SearchSourceFormData) => {
    if (isDirty || areRelatablesDirty) {
      onSearch(data);
    }
  });

  const handleReset = () => {
    resetRelatables();
    reset({ ...DEFAULT_SEARCH_DATA }, { keepDirty: false });
    onSearch(DEFAULT_SEARCH_DATA);
  };

  const { onChange: titleOnChange, ...titleProps } = register('title');

  const debouncedTitleOnChange = useDebouncedCallback(titleOnChange, 300);

  // Basically, when any of these values change,
  // submit the form
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
    onSearch(getValues());
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
        <AppFormControl label="Expand all" display="flex" alignItems="center" controlFirst>
          <Switch
            onChange={() => setExpandAll((current) => !current)}
            mr={2}
            colorScheme="orange"
            isChecked={expandAll}
          />
        </AppFormControl>
        <AppFormControl label="My contributions only" display="flex" alignItems="center" controlFirst>
          <Switch
            isChecked={watch('meOnly')}
            onChange={() => setValue('meOnly', !meOnly)}
            mr={2}
            colorScheme="orange"
          />
        </AppFormControl>
        <Divider mt={2} mb={2} />
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
        <Divider mt={2} mb={2} />
        <AppFormControl
          label="Year (Min)"
          errorMessage={errors?.yearStart?.message}
        >
          <YearInput onChange={(value) => setValue('yearStart', value)} value={watch('yearStart') as any} debounce={300} />
        </AppFormControl>
        <AppFormControl
          label="Year (Max)"
          errorMessage={errors?.yearEnd?.message}
        >
          <YearInput onChange={(value) => setValue('yearEnd', value)} value={watch('yearEnd') as any} debounce={300} />
        </AppFormControl>
        <Flex justifyContent="flex-end">
          <Button
            type="button"
            onClick={handleReset}
            mt={2}
            colorScheme="orange"
          >
            Reset
          </Button>
        </Flex>
      </form>
    </Flex>
  );
};
