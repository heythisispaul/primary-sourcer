import { useState, useCallback, useEffect } from 'react';
import { UseFormSetValue } from 'react-hook-form';
import { SelectableOption } from '../components/common/SearchSelect';

export interface CreateSourceFormData {
  title: string;
  href: string;
  description?: string;
  tagIds: string[];
  authorIds: string[];
}

export const useCreateSourceControls = (formUpdater: UseFormSetValue<CreateSourceFormData>) => {
  const [tags, setTags] = useState<SelectableOption[]>([]);
  const [authors, setAuthors] = useState<SelectableOption[]>([]);

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
