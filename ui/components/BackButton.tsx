import { Button, HStack, Text } from "@chakra-ui/react";
import { ChevronLeftIcon } from "@chakra-ui/icons";

const BackButton = ({ onClick }: { onClick: Function }) => {
  return (
    <Button
      mb="0.5rem"
      py="1rem"
      pr="1rem"
      size="xs"
      variant="ghost"
      onClick={() => onClick()}
    >
      <HStack fontSize="xl">
        <ChevronLeftIcon fontSize="3xl" />
        <Text>Back</Text>
      </HStack>
    </Button>
  );
};

export default BackButton;
