import React from "react";
import { useDisclosure } from "@chakra-ui/react";
import AccountInfo from "./AccountInfo";
import AccountModal from "./AccountModal";

function WalletLogin() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <AccountInfo handleOpenModal={onOpen} />
      <AccountModal isOpen={isOpen} onClose={onClose} />
    </>
  );
}

export default WalletLogin;
