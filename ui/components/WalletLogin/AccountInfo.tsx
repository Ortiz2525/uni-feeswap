import NextImg from "next/image";
import { useEffect } from "react";
import {
  Button,
  Box,
  Text,
  Skeleton,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Stack,
  HStack,
} from "@chakra-ui/react";
import {
  useAccount,
  useEnsName,
  useBalance,
  useEnsAvatar,
  useNetwork,
} from "wagmi";
import { supportedChains } from "@/config";
import slicedAddress from "@/utils/slicedAddress";
import useSupportedChain from "@/hooks/useSupportedChain";
import Identicon from "./Identicon";
import ConnectWallet from "./ConnectWallet";

type Props = {
  handleOpenModal: any;
};

const AccountInfo = ({ handleOpenModal }: Props) => {
  const { data: account } = useAccount();
  const { data: ensName } = useEnsName({ address: account?.address });
  const { data: etherBalance, isLoading: isBalanceLoading } = useBalance({
    addressOrName: account?.address,
  });
  const { switchNetwork } = useNetwork();
  const { data: ensAvatar } = useEnsAvatar({
    addressOrName: account?.address,
  });

  const {
    isOpen: isModalOpen,
    onOpen: openModal,
    onClose: closeModal,
  } = useDisclosure();
  const { isSupportedChain } = useSupportedChain();

  useEffect(() => {
    if (!isSupportedChain) {
      openModal();
    } else {
      if (isModalOpen) {
        closeModal();
      }
    }
  }, [isSupportedChain]);

  return account && account.address ? (
    <>
      <Box
        display="flex"
        alignItems="center"
        background="gray.700"
        borderRadius="xl"
        py="0"
      >
        <Box px="3">
          <Text color="white" fontSize="md">
            {isBalanceLoading && <Skeleton rounded={"lg"}>0.00 ETH</Skeleton>}
            {etherBalance && (
              <>
                {parseFloat(etherBalance.formatted).toFixed(4)}{" "}
                {etherBalance.symbol}
              </>
            )}
          </Text>
        </Box>
        <Button
          onClick={handleOpenModal}
          bg="gray.800"
          border="1px solid transparent"
          _hover={{
            border: "1px",
            borderStyle: "solid",
            borderColor: "blue.400",
            backgroundColor: "gray.700",
          }}
          borderRadius="xl"
          m="1px"
          px={3}
          h="38px"
        >
          <Text color="white" fontSize="md" fontWeight="medium" mr="2">
            {ensName ?? slicedAddress(account.address)}
          </Text>
          {ensAvatar ? (
            <Image
              src={ensAvatar}
              w="24px"
              h="24px"
              rounded={"full"}
              alt="ens avatar"
            />
          ) : (
            <Identicon />
          )}
        </Button>
      </Box>
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        closeOnOverlayClick={false}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>⚠️ Unsupported Network</ModalHeader>
          {/* <ModalCloseButton /> */}
          <ModalBody>
            <Text>Please switch to one of the supported chains</Text>
            <Stack spacing={3} my="1rem" mx="auto" maxW="9rem">
              {supportedChains.map((chain, i) => (
                <Button
                  key={i}
                  bgColor="white"
                  color="black"
                  _hover={{
                    bgColor: "gray.400",
                  }}
                  onClick={() => {
                    switchNetwork!(chain.id);
                  }}
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
  ) : (
    <ConnectWallet />
  );
};

export default AccountInfo;
