import {
  useState,
  useEffect,
  useCallback,
} from 'react';
import { UseFormSetValue } from 'react-hook-form';
import { SelectableOption } from '../components/common/SearchSelect';
import { SourceWithRelations } from '../../db';
import { Relatable, CreateSourceFormData } from './types';

// TODO: Why did I do this? Was there a reason I can't remember?
// Can't they all just use the same set of properties?
const relatableToSeletable = (items?: Relatable[]): SelectableOption[] => {
  if (!items) {
    return [];
  }

  return items.map(({ id, name }) => ({ value: id, label: name }));
};

const selectableToRelatable = (items?: SelectableOption[]): Relatable[] => {
  if (!items) {
    return [];
  }

  return items.map(({ label, value }) => ({ id: value, name: label }));
};

export const useRelatableControls = (
  setValue: UseFormSetValue<CreateSourceFormData>,
  sourceToEdit?: SourceWithRelations,
) => {
  const [areRelatablesDirty, setAreRelateablesDirty] = useState<boolean>(false);

  const [tags, setTags] = useState<SelectableOption[]>(
    relatableToSeletable(sourceToEdit?.tags),
  );
  const [authors, setAuthors] = useState<SelectableOption[]>(
    relatableToSeletable(sourceToEdit?.authors),
  );
  const [regions, setRegions] = useState<SelectableOption[]>(
    relatableToSeletable(sourceToEdit?.regions),
  );

  const [hasYears, setHasYears] = useState(sourceToEdit?.yearType !== 'NONE' ?? true);
  const [hasRange, setHasRange] = useState(sourceToEdit?.yearType === 'RANGE' ?? false);

  const onTagSelect = useCallback((tag: SelectableOption) => {
    setTags((currentTags) => [...currentTags, tag]);
    setAreRelateablesDirty(true);
  }, []);

  const onAuthorSelect = useCallback((author: SelectableOption) => {
    setAuthors((currentAuthors) => [...currentAuthors, author]);
    setAreRelateablesDirty(true);
  }, []);

  const onRegionSelect = useCallback((region: SelectableOption) => {
    setRegions((currentRegions) => [...currentRegions, region]);
    setAreRelateablesDirty(true);
  }, []);

  const removeTag = useCallback((id: string) => {
    setTags((currentTags) => currentTags.filter(({ value }) => value !== id));
    setAreRelateablesDirty(true);
  }, []);

  const removeAuthor = useCallback((id: string) => {
    setAuthors((currentAuthors) => currentAuthors.filter(({ value }) => value !== id));
    setAreRelateablesDirty(true);
  }, []);

  const removeRegion = useCallback((id: string) => {
    setRegions((currentRegions) => currentRegions.filter(({ value }) => value !== id));
    setAreRelateablesDirty(true);
  }, []);

  const toggleHasYears = useCallback(() => {
    setHasYears((currentHasYears) => !currentHasYears);
    setAreRelateablesDirty(true);
  }, []);

  const toggleHasRange = useCallback(() => {
    setHasRange((currentHasRange) => !currentHasRange);
    setAreRelateablesDirty(true);
  }, []);

  const resetRelatables = useCallback(() => {
    setAreRelateablesDirty(false);
    setRegions([]);
    setTags([]);
    setAuthors([]);
  }, []);

  useEffect(() => {
    const tagIds = tags.map(({ value }) => value);
    setValue('tagIds', tagIds);
    setValue('tags', selectableToRelatable(tags));
  }, [tags, setValue]);

  useEffect(() => {
    const authorIds = authors.map(({ value }) => value);
    setValue('authorIds', authorIds);
    setValue('authors', selectableToRelatable(authors));
  }, [authors, setValue]);

  useEffect(() => {
    const regionIds = regions.map(({ value }) => value);
    setValue('regionIds', regionIds);
    setValue('regions', selectableToRelatable(regions));
  }, [regions, setValue]);

  useEffect(() => {
    if (!hasYears) {
      setValue('yearType', 'NONE');
    } else {
      setValue(
        'yearType',
        hasRange ? 'RANGE' : 'POINT',
      );
    }
  }, [hasYears, hasRange, setValue]);

  return {
    tags,
    onTagSelect,
    removeTag,
    authors,
    onAuthorSelect,
    removeAuthor,
    regions,
    onRegionSelect,
    removeRegion,
    hasYears,
    toggleHasYears,
    hasRange,
    toggleHasRange,
    areRelatablesDirty,
    resetRelatables,
  };
};
