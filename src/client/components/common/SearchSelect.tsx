/* eslint-disable no-unused-vars */
import { FunctionComponent, useState, useMemo } from 'react';
import { CreatableSelect, Select } from 'chakra-react-select';
import { useDebounce } from 'use-debounce';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Tag, Author, Region } from '@prisma/client';

export interface SelectableOption {
  value: string;
  label: string;
  isDisabled?: boolean;
}

export interface MultiSelectInputProps {
  entity: 'author' | 'tag' | 'region';
  onSelect: (option: SelectableOption) => void;
  allowCreate?: boolean;
  preSelected?: SelectableOption[];
  max?: number;
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

// TODO: Clean up the type system here. The react-select-chakra ones are ...less than great.
export const SearchSelect: FunctionComponent<MultiSelectInputProps> = ({
  entity,
  allowCreate,
  onSelect,
  preSelected = [],
  max = 6,
}) => {
  const [input, setInput] = useState('');
  const [debouncedInput] = useDebounce(input, 500);
  const searchKey = ['options', entity, debouncedInput];
  const path = `/api/relatables/${entity}?search=${debouncedInput}`;
  const Component = allowCreate ? CreatableSelect : Select;

  const {
    data: fetchedOptions,
    isLoading: isSearching,
  } = useQuery(searchKey, async () => {
    const result = await fetch(path);
    const data = await result.json();
    return data;
  });

  const {
    mutate,
    isLoading: isMutating,
  } = useMutation<Tag | Author | Region, Error, string>(async (name) => {
    const result = await fetch(path, {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
    const data = await result.json();
    return data;
  }, {
    onSuccess: (newRelatable) => {
      const [result] = RelatableToSelectable([newRelatable]);
      onSelect(result);
    },
  });

  const options = useMemo(
    () => RelatableToSelectable(fetchedOptions ?? [], preSelected),
    [fetchedOptions, preSelected],
  );

  return (
    <Component
      allowCreateWhileLoading={false}
      colorScheme="orange"
      options={options as any}
      onInputChange={(value) => setInput(value.trim())}
      isLoading={isSearching || isMutating}
      value={input}
      onCreateOption={mutate}
      onChange={(selected: unknown) => onSelect(selected as SelectableOption)}
      isDisabled={preSelected && preSelected.length >= max}
    />
  );
};
