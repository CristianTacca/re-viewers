import {
  Button,
  Center,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import welcome from "../../../assets/welcome.jpg";

interface ModalSuccessProps {
  isOpen: boolean;
  onClose: () => void;
  result: string;
  title: string;
  message: string;
  img?: string;
}

export const ModalSuccess = ({
  isOpen,
  onClose,
  title,
  message,
  result,
  img,
}: ModalSuccessProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader color="white" bgColor="gold.sand" fontWeight="extrabold">
          {title}
        </ModalHeader>
        <ModalBody bgColor="gold.light50">
          <Center flexDir="column">
            <Text
              as="h2"
              textAlign="center"
              fontWeight="extrabold"
              fontStyle="italic"
              fontSize="1.3rem"
              color="grey.dark"
            >
              {message}
            </Text>
            {img === "" ? (
              <Image border="2px solid" borderColor="grey.dark" src={welcome} />
            ) : (
              <Image border="2px solid" borderColor="grey.dark" src={img} />
            )}
            <Text
              color="grey.dark"
              fontWeight="bold"
              fontStyle="italic"
              fontSize="m"
            >
              {result}
            </Text>
          </Center>
        </ModalBody>

        <ModalFooter bgColor="gold.light50">
          <Button
            bgColor="grey.dark"
            color="white"
            _hover={{ background: "grey.greyStone" }}
            onClick={onClose}
          >
            Fechar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
