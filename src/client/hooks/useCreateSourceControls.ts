import { useState, useCallback, useEffect } from 'react';
import { UseFormSetValue } from 'react-hook-form';
import { Source } from '@prisma/client';
import { SourceWithRelations } from '../../db';
import { SelectableOption } from '../components/common/SearchSelect';

export interface CreateSourceFormData {
  title: string;
  href: string;
  description?: string;
  tagIds: string[];
  authorIds: string[];
  regionIds: string[];
  yearType: Source['yearType'];
  yearStart?: number;
  yearEnd?: number;
}

const relatableToSource = (items?: {id: string, name: string}[]): SelectableOption[] => {
  if (!items) {
    return [];
  }

  return items.map(({ id, name }) => ({ value: id, label: name }));
};

export const useCreateSourceControls = (
  formUpdater: UseFormSetValue<CreateSourceFormData>,
  sourceToEdit?: SourceWithRelations,
) => {
  const [tags, setTags] = useState<SelectableOption[]>(
    relatableToSource(sourceToEdit?.tags),
  );
  const [authors, setAuthors] = useState<SelectableOption[]>(
    relatableToSource(sourceToEdit?.authors),
  );
  const [regions, setRegions] = useState<SelectableOption[]>(
    relatableToSource(sourceToEdit?.regions),
  );

  const [hasYears, setHasYears] = useState(sourceToEdit?.yearType !== 'NONE' ?? true);
  const [hasRange, setHasRange] = useState(sourceToEdit?.yearType === 'RANGE' ?? false);

  const onTagSelect = useCallback((tag: SelectableOption) => {
    setTags((currentTags) => [...currentTags, tag]);
  }, []);

  const onAuthorSelect = useCallback((author: SelectableOption) => {
    setAuthors((currentAuthors) => [...currentAuthors, author]);
  }, []);

  const onRegionSelect = useCallback((region: SelectableOption) => {
    setRegions((currentRegions) => [...currentRegions, region]);
  }, []);

  const removeTag = useCallback((id: string) => {
    setTags((currentTags) => currentTags.filter(({ value }) => value !== id));
  }, []);

  const removeAuthor = useCallback((id: string) => {
    setAuthors((currentAuthors) => currentAuthors.filter(({ value }) => value !== id));
  }, []);

  const removeRegion = useCallback((id: string) => {
    setRegions((currentRegions) => currentRegions.filter(({ value }) => value !== id));
  }, []);

  const toggleHasYears = useCallback(() => {
    setHasYears((currentHasYears) => !currentHasYears);
  }, []);

  const toggleHasRange = useCallback(() => {
    setHasRange((currentHasRange) => !currentHasRange);
  }, []);

  useEffect(() => {
    const tagIds = tags.map(({ value }) => value);
    formUpdater('tagIds', tagIds);
  }, [tags, formUpdater]);

  useEffect(() => {
    const authorIds = authors.map(({ value }) => value);
    formUpdater('authorIds', authorIds);
  }, [authors, formUpdater]);

  useEffect(() => {
    const regionIds = regions.map(({ value }) => value);
    formUpdater('regionIds', regionIds);
  }, [regions, formUpdater]);

  useEffect(() => {
    if (!hasYears) {
      formUpdater('yearType', 'NONE');
    } else {
      formUpdater(
        'yearType',
        hasRange ? 'RANGE' : 'POINT',
      );
    }
  }, [hasYears, hasRange, formUpdater]);

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
  };
};
