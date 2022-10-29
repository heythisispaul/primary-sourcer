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
  controlFirst?: boolean;
}

export const AppFormControl: FunctionComponent<AppFormControlProps & FormControlProps> = ({
  children,
  label,
  helperText,
  errorMessage,
  controlFirst,
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

  const content = [label, children];

  const toRender = controlFirst ? content.reverse() : content;

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <FormControl {...rest} isInvalid={Boolean(errorMessage)}>
      <FormLabel>
        {toRender?.map((item) => item)}
      </FormLabel>
      {detailText}
    </FormControl>
  );
};
