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
import { UniV3Position } from "@/types";
import GradientButton from "./GradientButton";

const UniswapPosition = ({ pos }: { pos: UniV3Position }) => {
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
            <Stack
              mt="1rem"
              direction="row"
              spacing={5}
              justifyContent="space-between"
            >
              {["0.01%", "0.05%", "0.3%", "1%"].map((tier, i) => (
                <Button key={i} w="5rem" h="5rem" variant="outline">
                  {tier}
                </Button>
              ))}
            </Stack>
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
