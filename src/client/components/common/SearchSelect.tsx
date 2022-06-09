/* eslint-disable no-unused-vars */
import { FunctionComponent, useState } from 'react';
import { AsyncCreatableSelect, AsyncSelect } from 'chakra-react-select';
import { useDebounce } from 'use-debounce';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Tag, Author } from '@prisma/client';

export interface SelectableOption {
  value: string;
  label: string;
  isDisabled?: boolean;
}

export interface MultiSelectInputProps {
  entity: 'author' | 'tag';
  onSelect: (option: SelectableOption) => void;
  allowCreate?: boolean;
  preSelected?: SelectableOption[];
}

const RelatableToSelectable = (
  entities: Tag[] | Author[],
  selected: SelectableOption[] = [],
) => entities.map(({ name, id }): SelectableOption => {
  const isDisabled = selected.some(({ value: selectedId }) => id === selectedId);
  return {
    value: id,
    label: name,
    isDisabled,
  };
});

const getSkippableIds = (selections: SelectableOption[]) => (
  JSON.stringify(selections.map(({ value }) => value))
);

// TODO: Clean up the type system here. The react-select-chakra ones are ...less than great.
export const SearchSelect: FunctionComponent<MultiSelectInputProps> = ({
  entity,
  allowCreate,
  onSelect,
  preSelected = [],
}) => {
  const [input, setInput] = useState('');
  const [debouncedInput] = useDebounce(input, 500);
  const queryClient = useQueryClient();
  const searchKey = ['options', entity, debouncedInput];
  const path = `/api/relatables/${entity}?search=${debouncedInput}`;
  const Component = allowCreate ? AsyncCreatableSelect : AsyncSelect;

  const searchResults = useQuery(searchKey, async () => {
    const result = await fetch(path);
    const data = await result.json();
    return data;
  });

  const onAdd = (addedOption: SelectableOption) => {
    queryClient.invalidateQueries('options');
    onSelect(addedOption);
  };

  const { mutate, isLoading } = useMutation<Tag | Author, Error, string>(async (name) => {
    const result = await fetch(path, {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
    const data = await result.json();
    return data;
  }, {
    onSuccess: (newRelatable) => {
      const [result] = RelatableToSelectable([newRelatable]);
      queryClient.invalidateQueries('options');
      onSelect(result);
    },
  });

  return (
    <Component
      colorScheme="orange"
      onInputChange={(value) => setInput(value.trim())}
      isLoading={searchResults.isLoading || isLoading}
      loadOptions={(_, callback) => {
        if (!searchResults.isLoading) {
          callback(RelatableToSelectable(searchResults.data ?? [], preSelected) as any);
        }
      }}
      value={input}
      onCreateOption={(name) => mutate(name)}
      onChange={(selected: unknown) => onAdd(selected as SelectableOption)}
    />
  );
};
