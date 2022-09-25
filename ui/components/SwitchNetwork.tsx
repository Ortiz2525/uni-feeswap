import NextImg from "next/image";
import {
  Button,
  Text,
  Stack,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  HStack,
  ModalCloseButton,
} from "@chakra-ui/react";
import { useNetwork, useAccount } from "wagmi";
import { supportedChains } from "../config";

function SwitchNetwork() {
  const { activeChain, switchNetwork } = useNetwork();
  const { data: account } = useAccount();

  const {
    isOpen: isModalOpen,
    onOpen: openModal,
    onClose: closeModal,
  } = useDisclosure();

  return (
    <>
      {account &&
        account.address &&
        activeChain &&
        supportedChains.findIndex((chain) => chain.id === activeChain.id) !==
          -1 && (
          <Button
            mr="1rem"
            py="1.3rem"
            background="gray.700"
            borderRadius="lg"
            onClick={() => openModal()}
          >
            <HStack>
              <NextImg
                src={`/icons/chains/${activeChain?.name}.png`}
                width="24px"
                height="24px"
              />
              <Text>{activeChain?.name}</Text>
            </HStack>
          </Button>
        )}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        closeOnOverlayClick={false}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>🔁 Switch Network</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={3} my="1rem" mx="auto" maxW="9rem">
              {supportedChains.map((chain, i) => (
                <Button
                  key={i}
                  bgColor="white"
                  color="black"
                  _hover={
                    activeChain && chain.id !== activeChain.id
                      ? {
                          bgColor: "gray.400",
                        }
                      : {}
                  }
                  onClick={() => {
                    switchNetwork!(chain.id);
                  }}
                  isDisabled={activeChain && chain.id === activeChain.id}
                >
                  <HStack>
                    <NextImg
                      src={`/icons/chains/${chain.name}.png`}
                      width="24px"
                      height="24px"
                    />
                    <Text>{chain.name}</Text>
                  </HStack>
                </Button>
              ))}
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default SwitchNetwork;
