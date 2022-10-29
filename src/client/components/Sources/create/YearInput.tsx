import { FunctionComponent, useState, useEffect } from 'react';
import {
  RadioGroup,
  Radio,
  Stack,
  Flex,
} from '@chakra-ui/react';
import { useDebouncedCallback } from 'use-debounce';
import { AppNumberInput } from '../../common/AppNumberInput';
import { thisYear } from '../../../utils';

export interface YearInputProps {
  value: number;
  // eslint-disable-next-line no-unused-vars
  onChange: (value: number | undefined) => void;
  debounce?: number;
}

export type Era = 'CE' | 'BCE';

// TODO: make this an actually controllable component instead of this
// weird state syncing thing
export const YearInput: FunctionComponent<YearInputProps> = ({
  value,
  onChange,
  debounce = 0,
}) => {
  const initialEra: Era = value < 0 ? 'BCE' : 'CE';
  const [era, setEra] = useState<Era | string>(initialEra);
  const [yearValue, setYearValue] = useState<number | string | undefined>(
    value ? Math.abs(value) : '',
  );
  const externalOnChange = useDebouncedCallback(onChange, debounce);

  const displayValue = (!yearValue || Number.isNaN(yearValue)) ? '' : Math.abs(yearValue as number);

  useEffect(() => {
    const coEfficient = era === 'CE' ? 1 : -1;
    externalOnChange(yearValue ? ((yearValue as number) * coEfficient) : undefined);
  }, [yearValue, era, externalOnChange]);

  useEffect(() => {
    setYearValue(value);
  }, [value]);

  return (
    <Flex justifyContent="" gap={5} alignItems="center">
      <AppNumberInput
        precision={0}
        value={displayValue}
        onChange={(_, numValue) => setYearValue(numValue)}
        max={era === 'CE' ? thisYear : 100000}
        min={1}
      />
      <RadioGroup onChange={setEra} value={era} colorScheme="orange">
        <Stack direction="row">
          <Radio value="BCE">BCE</Radio>
          <Radio value="CE">CE</Radio>
        </Stack>
      </RadioGroup>
    </Flex>
  );
};
