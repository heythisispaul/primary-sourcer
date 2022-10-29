import {
  FunctionComponent,
  Dispatch,
  SetStateAction,
} from 'react';
import {
  Button,
  ButtonGroup,
  Center,
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { SearchSourceFormData } from '../../hooks';
import { PAGE_TAKE } from '../../../utils';

export type PaginatorProps = {
  // eslint-disable-next-line no-unused-vars
  setSourceSearchData: Dispatch<SetStateAction<SearchSourceFormData>>;
  page: number;
  isFetching: boolean;
  currentSourceLength: number;
};

export const Paginator: FunctionComponent<PaginatorProps> = ({
  setSourceSearchData,
  page,
  isFetching,
  currentSourceLength,
}) => {
  const disableNext = !currentSourceLength || currentSourceLength < PAGE_TAKE;
  const setPage = (newPage: number) => {
    setSourceSearchData((currentData) => ({
      ...currentData,
      offset: newPage,
    }));
  };

  return (
    <Center mb={6} mt={4}>
      <ButtonGroup colorScheme="orange" gap={2}>
        <Button
          onClick={() => setPage(page - 1)}
          leftIcon={<ChevronLeftIcon />}
          disabled={page < 1 || isFetching}
          minW="120px"
        >
          Previous
        </Button>
        <Button
          disabled={disableNext || isFetching}
          onClick={() => setPage(page + 1)}
          rightIcon={<ChevronRightIcon />}
          minW="120px"
        >
          Next
        </Button>
      </ButtonGroup>
    </Center>
  );
};
