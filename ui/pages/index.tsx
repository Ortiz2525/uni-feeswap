import type { NextPage } from "next";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import {
  Center,
  Box,
  VStack,
  Heading,
  Text,
  CircularProgress,
  Image,
  Stack,
  Divider,
  HStack,
  Spacer,
} from "@chakra-ui/react";
import { useAccount, useNetwork } from "wagmi";
import axios from "axios";
import { UniV3NonfungiblePositionManager } from "@/config";
import { MoralisNFTBalanceResult, NFTBalance, UniV3Metadata } from "@/types";
import useSupportedChain from "@/hooks/useSupportedChain";
import Layout from "@/components/Layout";
import GradientButton from "@/components/GradientButton";

const Home: NextPage = () => {
  const { data: account } = useAccount();
  const { activeChain } = useNetwork();
  const { isSupportedChain } = useSupportedChain();

  const [uniV3Positions, setUniV3Positions] = useState<NFTBalance[]>();
  const [fetchingUniV3Positions, setFetchingUniV3Positions] = useState(false);

  const fetchUniswapPositions = async () => {
    setFetchingUniV3Positions(true);
    const nftBalances = await axios.get<MoralisNFTBalanceResult>(
      `https://deep-index.moralis.io/api/v2/${account?.address}/nft`,
      {
        params: {
          chain: activeChain!.name,
        },
        headers: {
          "X-API-Key": process.env.NEXT_PUBLIC_MORALIS_API_KEY!,
          accept: "application/json",
        },
      }
    );

    setUniV3Positions(
      nftBalances.data.result.filter(
        (nft) =>
          nft.token_address === UniV3NonfungiblePositionManager.toLowerCase()
      )
    );
    setFetchingUniV3Positions(false);
  };

  useEffect(() => {
    if (account && isSupportedChain) {
      fetchUniswapPositions();
    }
  }, [account, isSupportedChain]);

  return (
    <Layout>
      <Head>
        <title>
          UniFeeSwap | Swap your Uniswap V3 liquidity&apos;s fee tier
        </title>
        <link rel="icon" type="image/png" href="/favicon.png"></link>
      </Head>
      <Center flexDir="column">
        <Box mt="2rem" py="2rem" px="3rem" boxShadow="2xl" rounded="lg">
          <VStack spacing="2rem">
            <Heading fontSize="2xl">Your Uniswap V3 Positions</Heading>
            <Divider />
            {fetchingUniV3Positions && (
              <CircularProgress color="purple.300" isIndeterminate />
            )}
            {uniV3Positions &&
              uniV3Positions.map((pos, i) => {
                const metadata = JSON.parse(pos.metadata) as UniV3Metadata;

                return (
                  <Stack
                    key={i}
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
                    <Image h="25rem" src={metadata.image} alt={metadata.name} />
                    <Box>
                      <Box mt="2rem" ml="1rem">
                        <Text fontWeight="bold">{metadata.name}</Text>
                        <Divider mt="0.5rem" />
                        <HStack mt="1rem">
                          <Text fontWeight="bold">TokenId</Text>
                          <Spacer />
                          <Text>{pos.token_id}</Text>
                        </HStack>
                        <Center mt="6rem">
                          <GradientButton
                            text="Swap Fee Tier"
                            onClick={() => console.log("click")}
                          />
                        </Center>
                      </Box>
                    </Box>
                  </Stack>
                );
              })}
          </VStack>
        </Box>
      </Center>
    </Layout>
  );
};

export default Home;
