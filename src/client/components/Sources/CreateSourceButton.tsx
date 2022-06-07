import { FunctionComponent } from 'react';
import {
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  // ModalFooter,
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
      >
        New Source
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>New Primary Source</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <CreateSourceForm onSubmit={(data) => console.log(data)}>
              <Button type="submit">Submit</Button>
            </CreateSourceForm>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
