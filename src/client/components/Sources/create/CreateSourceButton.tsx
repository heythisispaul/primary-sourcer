/* eslint-disable react/jsx-props-no-spreading */
import {
  FunctionComponent,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  useDisclosure,
  Button,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerFooter,
  ButtonGroup,
  Text,
  useMediaQuery,
  ButtonProps,
  IconButton,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { useMutation, useQueryClient } from 'react-query';
import { Source } from '@prisma/client';
import { CreateSourceForm } from './CreateSourceForm';
import EditingSource from '../../../contexts/EditingSource';
import { CreateSourceFormData, useFetchClient } from '../../../hooks';
import { SourceWithRelations } from '../../../../db';

export const CreateSourceButton: FunctionComponent<{ children: ReactNode}> = ({
  children,
}) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [isDesktop] = useMediaQuery('(min-width: 600px)');
  const [sourceToEdit, setSourceToEdit] = useState<SourceWithRelations>();
  const queryClient = useQueryClient();
  const fetchClient = useFetchClient<SourceWithRelations, CreateSourceFormData>(
    `/api/sources${sourceToEdit ? `/${sourceToEdit.id}` : ''}`,
    (data) => ({
      method: sourceToEdit ? 'PATCH' : 'POST',
      body: JSON.stringify(data),
    }),
  );

  const {
    mutate,
    isError,
    isLoading,
  } = useMutation<Source, Error, CreateSourceFormData>(fetchClient, {
    onSuccess: () => {
      onClose();
      queryClient.invalidateQueries('sources');
    },
  });

  const contextValue = useMemo(
    () => ({ sourceToEdit, setSourceToEdit }),
    [sourceToEdit],
  );

  useEffect(() => {
    if (sourceToEdit) {
      onOpen();
    }
  }, [sourceToEdit, onOpen]);

  const button = useMemo(() => {
    const commonProps: Partial<ButtonProps> = {
      colorScheme: 'orange',
      size: 'lg',
      right: '6vw',
      bottom: '6vh',
      'aria-label': 'New Source',
      position: 'fixed',
      onClick: onOpen,
    } as const;

    if (isDesktop) {
      return (
        <Button {...commonProps} leftIcon={<AddIcon />}>
          New Source
        </Button>
      );
    }

    return (
      // @ts-ignore
      <IconButton {...commonProps} icon={<AddIcon />} borderRadius="25px" />
    );
  }, [isDesktop, onOpen]);

  return (
    <EditingSource.Provider value={contextValue}>
      {button}
      {children}
      <Drawer isOpen={isOpen} onClose={onClose} size="md" onCloseComplete={() => setSourceToEdit(undefined)}>
        <DrawerOverlay />
        <DrawerContent p={6}>
          <DrawerHeader>New Primary Source</DrawerHeader>
          <DrawerCloseButton />
          <CreateSourceForm onSubmit={mutate} sourceToEdit={sourceToEdit}>
            <DrawerFooter p={4}>
              <ButtonGroup colorScheme="orange">
                <Button
                  onClick={onClose}
                  variant="outline"
                  isLoading={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  colorScheme="orange"
                  disabled={isLoading}
                >
                  {sourceToEdit ? 'Update' : 'Create'}
                </Button>
              </ButtonGroup>
              {
                isError && (
                  <Text fontSize=".8em" color="red">
                    There was an error creating this source
                  </Text>
                )
              }
            </DrawerFooter>
          </CreateSourceForm>
        </DrawerContent>
      </Drawer>
    </EditingSource.Provider>
  );
};
