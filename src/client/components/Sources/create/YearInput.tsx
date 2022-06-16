import { FunctionComponent, useState, useEffect } from 'react';
import {
  RadioGroup,
  Radio,
  Stack,
  Flex,
} from '@chakra-ui/react';
import { AppNumberInput } from '../../common/AppNumberInput';
import { thisYear } from '../../../utils';

export interface YearInputProps {
  initialValue: number;
  // eslint-disable-next-line no-unused-vars
  onChange: (value: number) => void;
}

export type Era = 'AD' | 'BC';

export const YearInput: FunctionComponent<YearInputProps> = ({
  initialValue,
  onChange,
}) => {
  const initialEra: Era = initialValue < 0 ? 'BC' : 'AD';
  const [era, setEra] = useState<Era | string>(initialEra);
  const [yearValue, setYearValue] = useState<number>(Math.abs(initialValue));

  useEffect(() => {
    const coEfficient = era === 'AD' ? 1 : -1;
    onChange(yearValue * coEfficient);
  }, [yearValue, era]);

  return (
    <Flex justifyContent="" gap={5} alignItems="center">
      <AppNumberInput
        precision={0}
        value={yearValue}
        onChange={(_, numValue) => setYearValue(numValue)}
        max={era === 'AD' ? thisYear : 10000}
        min={1}
      />
      <RadioGroup onChange={setEra} value={era} colorScheme="orange">
        <Stack direction="row">
          <Radio value="AD">AD</Radio>
          <Radio value="BC">BC</Radio>
        </Stack>
      </RadioGroup>
    </Flex>
  );
};
