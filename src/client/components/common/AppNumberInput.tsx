import { FunctionComponent } from 'react';
import {
  NumberInput,
  NumberInputProps,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';

export const AppNumberInput: FunctionComponent<NumberInputProps> = (
  { id, ...props },
) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <NumberInput {...props}>
    <NumberInputField id={id} />
    <NumberInputStepper>
      <NumberIncrementStepper />
      <NumberDecrementStepper />
    </NumberInputStepper>
  </NumberInput>
);
