import {
  FunctionComponent,
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
} from 'react';
import {
  Flex,
  Input,
  Switch,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import { useDebouncedCallback } from 'use-debounce';
import { SearchSourceFormData } from '../../hooks';

export type ResultControlsProps = {
  setSourceSearchData: Dispatch<SetStateAction<SearchSourceFormData>>;
  sourceSearchData: SearchSourceFormData;
};

export const ResultControls: FunctionComponent<ResultControlsProps> = ({
  setSourceSearchData,
  sourceSearchData,
}) => {
  const [internalValue, setInternalValue] = useState<string>('');
  const debouncedStateUpdate = useDebouncedCallback((newValue: string) => {
    setSourceSearchData((currentData) => ({
      ...currentData,
      title: newValue,
    }));
  }, 400);

  useEffect(() => {
    debouncedStateUpdate(internalValue);
  }, [internalValue, debouncedStateUpdate]);

  return (
    <Flex
      alignItems="baseline"
      bg="white"
      borderTop="1px"
      borderColor="gray.300"
      p={3}
      gap={3}
      mb={3}
      mt={0}
    >
      <FormControl>
        <Input
          placeholder="Search"
          value={internalValue}
          onChange={(e) => setInternalValue(e.target.value)}
        />
      </FormControl>
      <FormControl display="flex" alignItems="center">
        <FormLabel htmlFor="top-bar-mine-only" mb={0}>
          Mine Only
        </FormLabel>
        <Switch
          colorScheme="orange"
          isChecked={sourceSearchData.meOnly}
          id="top-bar-mine-only"
          onChange={() => setSourceSearchData((data) => ({ ...data, meOnly: !data.meOnly }))}
        />
      </FormControl>
    </Flex>
  );
};
