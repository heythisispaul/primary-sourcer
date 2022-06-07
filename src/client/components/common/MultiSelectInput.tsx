import { FunctionComponent, useState } from 'react';
import { AsyncCreatableSelect } from 'chakra-react-select';
import { useDebounce } from 'use-debounce';
import { useQuery, useMutation } from 'react-query';

export interface MultiSelectInputProps {
  entity: 'author' | 'tag';
}

export const MultiSelectInput: FunctionComponent<MultiSelectInputProps> = ({
  entity,
}) => {
  const [input, setInput] = useState('');
  const [debouncedInput] = useDebounce(input, 500);
  const searchKey = ['options', entity, debouncedInput];
  const path = `/api/relatables/${entity}`;

  const searchResults = useQuery(searchKey, async () => {
    const result = await fetch(path);
    const data = await result.json();
    console.log(data);
    return data;
  });

  const addEntity = useMutation(async (createData) => {
    const result = await fetch(path, {
      method: 'POST',
      body: JSON.stringify(createData),
    });
    const data = await result.json();
    return data;
  });

  return (
    <AsyncCreatableSelect
      isMulti
      onInputChange={(value) => setInput(value)}
    />
  );
};
