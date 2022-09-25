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
  Button,
} from "@chakra-ui/react";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import { useAccount, useNetwork } from "wagmi";
import axios from "axios";
import { UniV3NonfungiblePositionManager } from "@/config";
import {
  MoralisNFTBalanceResult,
  NFTBalance,
  UniV3Metadata,
  UniV3Position,
} from "@/types";
import useSupportedChain from "@/hooks/useSupportedChain";
import Layout from "@/components/Layout";
import GradientButton from "@/components/GradientButton";
// TODO: use real time data
import mockAPIData from "@/mockAPIData.json";

const Home: NextPage = () => {
  const { data: account } = useAccount();
  const { activeChain } = useNetwork();
  const { isSupportedChain } = useSupportedChain();

  const [uniV3Positions, setUniV3Positions] = useState<UniV3Position[]>();
  const [fetchingUniV3Positions, setFetchingUniV3Positions] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<UniV3Position>();

  const fetchUniswapPositions = async () => {
    setFetchingUniV3Positions(true);
    // const nftBalances = await axios.get<MoralisNFTBalanceResult>(
    //   `https://deep-index.moralis.io/api/v2/${account?.address}/nft`,
    //   {
    //     params: {
    //       chain: activeChain!.name,
    //     },
    //     headers: {
    //       "X-API-Key": process.env.NEXT_PUBLIC_MORALIS_API_KEY!,
    //       accept: "application/json",
    //     },
    //   }
    // );

    const nftBalances = mockAPIData;

    setUniV3Positions(
      nftBalances.data.result
        .filter(
          (nft) =>
            nft.token_address === UniV3NonfungiblePositionManager.toLowerCase()
        )
        .map((nft) => ({
          token_address: nft.token_address,
          token_id: nft.token_id,
          owner_of: nft.owner_of,
          name: nft.name,
          symbol: nft.symbol,
          metadata: JSON.parse(nft.metadata as string),
        }))
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
            <Heading fontSize="2xl">
              {!selectedPosition
                ? "Your Uniswap V3 Positions"
                : "Swap Fee Tier"}
            </Heading>
            <Divider />
            {fetchingUniV3Positions && (
              <CircularProgress color="purple.300" isIndeterminate />
            )}
            {!selectedPosition ? (
              uniV3Positions &&
              uniV3Positions.map((pos, i) => {
                const metadata = pos.metadata;

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
                            onClick={() => setSelectedPosition(pos)}
                          />
                        </Center>
                      </Box>
                    </Box>
                  </Stack>
                );
              })
            ) : (
              <Box>
                <Button
                  mb="0.5rem"
                  py="1rem"
                  pr="1rem"
                  size="xs"
                  variant="ghost"
                  onClick={() => setSelectedPosition(undefined)}
                >
                  <HStack fontSize="xl">
                    <ChevronLeftIcon fontSize="3xl" />
                    <Text>Back</Text>
                  </HStack>
                </Button>
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
                  <Image
                    h="25rem"
                    src={selectedPosition.metadata.image}
                    alt={selectedPosition.metadata.name}
                  />
                  <Box>
                    <Box mt="2rem" ml="1rem">
                      <Text fontWeight="bold">
                        {selectedPosition.metadata.name}
                      </Text>
                      <Divider mt="0.5rem" />
                      <HStack mt="1rem">
                        <Text fontWeight="bold">TokenId</Text>
                        <Spacer />
                        <Text>{selectedPosition.token_id}</Text>
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
              </Box>
            )}
          </VStack>
        </Box>
      </Center>
    </Layout>
  );
};

export default Home;
