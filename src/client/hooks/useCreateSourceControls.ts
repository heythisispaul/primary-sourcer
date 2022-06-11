import { useState, useCallback, useEffect } from 'react';
import { UseFormSetValue } from 'react-hook-form';
import { SourceWithRelations } from '../../db';
import { SelectableOption } from '../components/common/SearchSelect';

export interface CreateSourceFormData {
  title: string;
  href: string;
  description?: string;
  tagIds: string[];
  authorIds: string[];
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

  const onTagSelect = useCallback((tag: SelectableOption) => {
    setTags((currentTags) => [...currentTags, tag]);
  }, []);

  const onAuthorSelect = useCallback((author: SelectableOption) => {
    setAuthors((currentAuthors) => [...currentAuthors, author]);
  }, []);

  const removeTag = useCallback((id: string) => {
    setTags((currentTags) => currentTags.filter(({ value }) => value !== id));
  }, []);

  const removeAuthor = useCallback((id: string) => {
    setAuthors((currentAuthors) => currentAuthors.filter(({ value }) => value !== id));
  }, []);

  useEffect(() => {
    const tagIds = tags.map(({ value }) => value);
    formUpdater('tagIds', tagIds);
  }, [tags, formUpdater]);

  useEffect(() => {
    const authorIds = authors.map(({ value }) => value);
    formUpdater('authorIds', authorIds);
  }, [authors, formUpdater]);

  return {
    tags,
    onTagSelect,
    removeTag,
    authors,
    onAuthorSelect,
    removeAuthor,
  };
};
