import type { NextPage } from "next";
import Head from "next/head";
import React, { useState } from "react";
import {
  Center,
  Box,
  VStack,
  Heading,
  CircularProgress,
  Divider,
  Text,
} from "@chakra-ui/react";
import { useAccount } from "wagmi";
import { UniV3Position } from "@/types";
import useUniV3Positions from "@/hooks/useUniV3Positions";
import Layout from "@/components/Layout";
import UniswapPositionCard from "@/components/UniswapPositionCard";
import UniswapPosition from "@/components/UniswapPosition";
import BackButton from "@/components/BackButton";

const Home: NextPage = () => {
  const { address } = useAccount();
  const { balance, uniV3Positions, fetchingUniV3Positions } =
    useUniV3Positions();

  const [selectedPosition, setSelectedPosition] = useState<UniV3Position>();

  return (
    <Layout>
      <Head>
        <title>
          UniFeeSwap | Swap your Uniswap V3 liquidity&apos;s fee tier
        </title>
        <link rel="icon" type="image/png" href="/favicon.png"></link>
      </Head>
      <Center flexDir="column">
        <Box
          my="2rem"
          py="2rem"
          px="3rem"
          minW="40rem"
          minH="20rem"
          boxShadow="2xl"
          rounded="lg"
        >
          <VStack spacing="2rem">
            <Heading fontSize="2xl">
              {!selectedPosition
                ? "Your Uniswap V3 Positions"
                : "Swap Fee Tier"}
            </Heading>
            <Divider />
            {!address && (
              <Text pt="3rem" fontSize="xl">
                Connect Wallet to use the dapp ↗️
              </Text>
            )}
            {fetchingUniV3Positions && (
              <CircularProgress color="purple.300" isIndeterminate />
            )}
            {!selectedPosition ? (
              uniV3Positions && uniV3Positions.length > 0 ? (
                uniV3Positions.map((pos, i) => (
                  <UniswapPositionCard
                    key={i}
                    pos={pos}
                    setSelectedPosition={setSelectedPosition}
                  />
                ))
              ) : (
                !balance && (
                  <Text pt="3rem" fontSize="xl">
                    You don&apos;t have any active Uniswap V3 Positions
                  </Text>
                )
              )
            ) : (
              <Box>
                <BackButton onClick={() => setSelectedPosition(undefined)} />
                <UniswapPosition pos={selectedPosition} />
              </Box>
            )}
          </VStack>
        </Box>
      </Center>
    </Layout>
  );
};

export default Home;
