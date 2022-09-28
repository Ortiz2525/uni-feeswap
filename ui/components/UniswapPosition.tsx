import { useEffect, useState } from "react";
import {
  Center,
  Box,
  Text,
  Image,
  Stack,
  Divider,
  HStack,
  Spacer,
  Button,
} from "@chakra-ui/react";
import {
  useNetwork,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { constants } from "ethers";
import { UniV3Position } from "@/types";
import useChainInfo from "@/hooks/useChainInfo";
import useUniV3Positions from "@/hooks/useUniV3Positions";
import useUniV3ApproveCallback, {
  ApprovalState,
} from "@/hooks/useUniV3ApproveCallback";
import UniFeeSwapABI from "@/abis/UniFeeSwap.json";
import GradientButton from "./GradientButton";

const UniswapPosition = ({ pos }: { pos: UniV3Position }) => {
  const { chain } = useNetwork();

  const { UniV3NonfungiblePositionManager, UniFeeSwap, feeTiers } =
    useChainInfo();
  const { refetchPositions } = useUniV3Positions();
  const { approvalState, approve } = useUniV3ApproveCallback(pos.token_id);

  const [feeTierPercent, setFeeTierPercent] = useState<string>();
  const [newFee, setNewFee] = useState<number>();

  const currentFeeTier = pos.metadata.name
    .split(" ")
    .filter((e) => e.slice(-1) === "%")[0];

  const { config: feeSwapConfig } = usePrepareContractWrite({
    addressOrName: UniFeeSwap ?? constants.AddressZero,
    contractInterface: UniFeeSwapABI,
    functionName: "feeSwap",
    args: [pos.token_id, newFee, 0],
    enabled:
      !!UniFeeSwap &&
      !!UniV3NonfungiblePositionManager &&
      !!newFee && // prevent 'invalid BigNumber value' errors in console when it's undefined
      approvalState === ApprovalState.APPROVED,
  });

  const {
    data: feeSwapData,
    write: feeSwapWrite,
    isLoading: isFeeSwapLoading,
  } = useContractWrite({
    ...feeSwapConfig,
    onSuccess(data) {
      refetchPositions();
    },
  });
  const { isLoading: isTransactionPending } = useWaitForTransaction({
    hash: feeSwapData?.hash,
  });

  useEffect(() => {
    if (feeTierPercent && chain && feeTiers) {
      setNewFee(parseFloat(feeTierPercent.slice(0, -1)) * 10000);
    }
  }, [feeTierPercent, chain, feeTiers]);

  return (
    <Stack
      direction={{ base: "column", md: "row" }}
      alignItems={{ base: "center", md: "stretch" }}
      mx={4}
      py="2rem"
      px="3rem"
      spacing={5}
      justifyContent="space-between"
    >
      <Image h="25rem" src={pos.metadata.image} alt={pos.metadata.name} />
      <Box>
        <Box mt="2rem" ml="1rem">
          <Text fontWeight="bold">{pos.metadata.name}</Text>
          <Divider mt="0.5rem" />
          <HStack mt="1rem">
            <Text fontWeight="bold">TokenId</Text>
            <Spacer />
            <Text>{pos.token_id}</Text>
          </HStack>
          <Divider mt="0.5rem" />
          <Box mt="2rem">
            <Text fontWeight="bolder" fontSize="xl">
              Select New Fee Tier
            </Text>
            <Center>
              <Stack
                mt="1rem"
                w="20rem"
                direction="row"
                justifyContent="space-between"
              >
                {chain &&
                  feeTiers &&
                  feeTiers
                    .filter((tier) => tier !== currentFeeTier)
                    .map((tier, i) => (
                      <Button
                        key={i}
                        w="5rem"
                        h="5rem"
                        colorScheme={tier === feeTierPercent ? "green" : ""}
                        bgColor={tier === feeTierPercent ? "green.600" : ""}
                        variant={tier !== feeTierPercent ? "outline" : ""}
                        onClick={() => setFeeTierPercent(tier)}
                      >
                        {tier}
                      </Button>
                    ))}
              </Stack>
            </Center>
            <Center mt="2rem">
              {[ApprovalState.NOT_APPROVED, ApprovalState.PENDING].includes(
                approvalState
              ) && (
                <GradientButton
                  mr="1rem"
                  text="Approve"
                  onClick={approve}
                  isDisabled={feeTierPercent === undefined}
                  isLoading={approvalState === ApprovalState.PENDING}
                />
              )}
              <GradientButton
                text="Swap"
                onClick={() => feeSwapWrite?.()}
                isDisabled={
                  feeTierPercent === undefined ||
                  approvalState !== ApprovalState.APPROVED ||
                  !feeSwapWrite
                }
                isLoading={isFeeSwapLoading || isTransactionPending}
              />
            </Center>
          </Box>
        </Box>
      </Box>
    </Stack>
  );
};

export default UniswapPosition;
