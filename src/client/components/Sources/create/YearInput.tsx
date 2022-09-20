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

export type Era = 'CE' | 'BCE';

export const YearInput: FunctionComponent<YearInputProps> = ({
  initialValue,
  onChange,
}) => {
  const initialEra: Era = initialValue < 0 ? 'BCE' : 'CE';
  const [era, setEra] = useState<Era | string>(initialEra);
  const [yearValue, setYearValue] = useState<number | undefined>(
    initialValue ? Math.abs(initialValue) : undefined,
  );

  useEffect(() => {
    const coEfficient = era === 'CE' ? 1 : -1;
    if (yearValue) {
      onChange(yearValue * coEfficient);
    }
  }, [yearValue, era]);

  return (
    <Flex justifyContent="" gap={5} alignItems="center">
      <AppNumberInput
        precision={0}
        value={yearValue}
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
