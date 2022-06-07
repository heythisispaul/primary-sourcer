import { FunctionComponent, ReactNode, useMemo } from 'react';
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  FormControlProps,
  FormHelperText,
} from '@chakra-ui/react';

export interface AppFormControlProps {
  children: ReactNode;
  label: string;
  helperText?: string;
  errorMessage?: string;
}

export const AppFormControl: FunctionComponent<AppFormControlProps & FormControlProps> = ({
  children,
  label,
  helperText,
  errorMessage,
  ...rest
}) => {
  const detailText = useMemo(() => {
    if (errorMessage) {
      return <FormErrorMessage>{errorMessage}</FormErrorMessage>;
    }

    if (helperText) {
      return <FormHelperText>{helperText}</FormHelperText>;
    }

    return null;
  }, [helperText, errorMessage]);

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <FormControl {...rest} isInvalid={Boolean(errorMessage)}>
      <FormLabel>
        {label}
        {children}
      </FormLabel>
      {detailText}
    </FormControl>
  );
};
