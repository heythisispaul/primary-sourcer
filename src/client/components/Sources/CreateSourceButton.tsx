import { FunctionComponent } from 'react';
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
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { CreateSourceForm } from './CreateSourceForm';

export const CreateSourceButton: FunctionComponent = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <>
      <Button
        leftIcon={<AddIcon />}
        colorScheme="orange"
        onClick={onOpen}
        aria-label="New Source"
        position="fixed"
        right="3vw"
        bottom="3vh"
        size="lg"
      >
        New Source
      </Button>
      <Drawer isOpen={isOpen} onClose={onClose} size="md">
        <DrawerOverlay />
        <DrawerContent p={6}>
          <DrawerHeader>New Primary Source</DrawerHeader>
          <DrawerCloseButton />
          <CreateSourceForm onSubmit={(data) => console.log(data)}>
            <DrawerFooter p={4}>
              <ButtonGroup colorScheme="orange">
                <Button onClick={onClose} variant="outline">Cancel</Button>
                <Button type="submit" colorScheme="orange">Create</Button>
              </ButtonGroup>
            </DrawerFooter>
          </CreateSourceForm>
        </DrawerContent>
      </Drawer>
    </>
  );
};
