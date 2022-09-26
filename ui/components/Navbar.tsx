import React from "react";
import { useRouter } from "next/router";
import { Flex, Heading, Spacer } from "@chakra-ui/react";
import WalletLogin from "./WalletLogin";
import SwitchNetwork from "./SwitchNetwork";

function Navbar() {
  const router = useRouter();

  return (
    <Flex py="4" px={["2", "4", "10", "10"]}>
      <Heading
        maxW={["302px", "4xl", "4xl", "4xl"]}
        onClick={() => router.push("/")}
        _hover={{
          color: "whiteAlpha.800",
          cursor: "pointer",
        }}
      >
        🦄 UniFeeSwap
      </Heading>
      <Spacer />
      <SwitchNetwork />
      <WalletLogin />
    </Flex>
  );
}

export default Navbar;
