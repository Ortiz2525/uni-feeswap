import {
  Center,
  Box,
  Text,
  Image,
  Stack,
  Divider,
  HStack,
  Spacer,
} from "@chakra-ui/react";
import { UniV3Position } from "@/types";
import GradientButton from "./GradientButton";

const UniswapPositionCard = ({
  pos,
  setSelectedPosition,
}: {
  pos: UniV3Position;
  setSelectedPosition: Function;
}) => {
  return (
    <Stack
      direction={{ base: "column", md: "row" }}
      alignItems={{ base: "center", md: "stretch" }}
      mx={4}
      py="2rem"
      px="3rem"
      spacing={5}
      justifyContent="space-between"
      boxShadow="lg"
      rounded="lg"
    >
      <Image h="25rem" src={pos.metadata.image} alt={pos.metadata.name} />
      <Box>
        <Box mt="6rem" ml="1rem">
          <Text fontWeight="bold">{pos.metadata.name}</Text>
          <Divider mt="0.5rem" />
          <HStack mt="1rem">
            <Text fontWeight="bold">TokenId</Text>
            <Spacer />
            <Text>{pos.token_id}</Text>
          </HStack>
          <Center mt="4rem">
            <GradientButton
              text="Swap Fee Tier"
              onClick={() => setSelectedPosition(pos)}
            />
          </Center>
        </Box>
      </Box>
    </Stack>
  );
};

export default UniswapPositionCard;
