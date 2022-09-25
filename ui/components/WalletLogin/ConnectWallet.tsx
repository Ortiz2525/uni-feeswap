import NextImg from "next/image";
import React from "react";
import {
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Flex,
  HStack,
  Text,
} from "@chakra-ui/react";
import { Connector, useConnect } from "wagmi";

function ConnectWallet() {
  const { connect, connectors, isLoading, pendingConnector } = useConnect();
  const {
    isOpen: isModalOpen,
    onOpen: openModal,
    onClose: closeModal,
  } = useDisclosure();

  const handleConnectWallet = (connector: Connector) => {
    connect({ connector });
  };

  return (
    <>
      <Button
        onClick={openModal}
        isLoading={isLoading}
        loadingText="Connecting"
      >
        Connect Wallet
      </Button>
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        closeOnOverlayClick={false}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Select a Wallet</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex flexDir={"column"} mb="1rem">
              {connectors.map((connector, key) => (
                <Button
                  key={key}
                  mb="0.5rem"
                  isDisabled={!connector.ready}
                  onClick={() => handleConnectWallet(connector)}
                  isLoading={isLoading && connector.id === pendingConnector?.id}
                  loadingText={connector.name}
                >
                  <HStack>
                    <NextImg
                      src={`/icons/connectors/${connector.id}.png`}
                      width="24px"
                      height="24px"
                    />
                    <Text>{connector.name}</Text>
                  </HStack>
                </Button>
              ))}
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ConnectWallet;
