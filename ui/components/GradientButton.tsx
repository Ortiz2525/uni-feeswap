import { Box, Button, ButtonProps } from "@chakra-ui/react";

interface GradientButtonProps extends ButtonProps {
  text: string;
  onClick: () => void;
}

function GradientButton({ text, onClick, ...props }: GradientButtonProps) {
  return (
    <Box>
      <Button
        px={6}
        py={6}
        rounded="1rem"
        bgGradient="linear(to-l, #9600f0,#c900c4,#c900c4,#9600f0)"
        border="4px"
        borderColor="#9600f0"
        bgSize="200%"
        bgPos="left"
        fontWeight="bolder"
        _hover={{
          bgPos: "right",
        }}
        _active={{
          bg: "#d957d6",
        }}
        transition="200ms background-position ease-in-out"
        onClick={() => onClick()}
        {...props}
      >
        {text}
      </Button>
    </Box>
  );
}

export default GradientButton;
