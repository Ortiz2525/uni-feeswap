import { useState } from "react";
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
import { useNetwork, useContractRead } from "wagmi";
import { UniV3Position } from "@/types";
import { chainIdToInfo } from "@/config";
import GradientButton from "./GradientButton";
import NonfungiblePositionManagerABI from "@/abis/NonfungiblePositionManager.json";

const UniswapPosition = ({ pos }: { pos: UniV3Position }) => {
  const { chain } = useNetwork();

  const [newFeeTierIndex, setNewFeeTierIndex] = useState<number>();

  const currentFeeTier = pos.metadata.name
    .split(" ")
    .filter((e) => e.slice(-1) === "%")[0];

  const { data: isApproved } = useContractRead({
    addressOrName: chainIdToInfo[chain!.id].UniV3NonfungiblePositionManager,
    contractInterface: NonfungiblePositionManagerABI,
    functionName: "getApproved",
    args: pos.token_id,
  });

  const confirm = async () => {};

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
                  chainIdToInfo[chain.id].feeTiers
                    .filter((tier) => tier !== currentFeeTier)
                    .map((tier, i) => (
                      <Button
                        key={i}
                        w="5rem"
                        h="5rem"
                        colorScheme={i === newFeeTierIndex ? "green" : ""}
                        bgColor={i === newFeeTierIndex ? "green.600" : ""}
                        variant={i !== newFeeTierIndex ? "outline" : ""}
                        onClick={() => setNewFeeTierIndex(i)}
                      >
                        {tier}
                      </Button>
                    ))}
              </Stack>
            </Center>
            <Center mt="2rem">
              <GradientButton
                text="Confirm"
                onClick={() => console.log("Confirmed")}
              />
            </Center>
          </Box>
        </Box>
      </Box>
    </Stack>
  );
};

export default UniswapPosition;
