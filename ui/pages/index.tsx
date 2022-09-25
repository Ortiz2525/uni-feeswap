import type { NextPage } from "next";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import {
  Center,
  Box,
  VStack,
  Heading,
  CircularProgress,
  Divider,
  Text,
} from "@chakra-ui/react";
import { useAccount, useNetwork } from "wagmi";
import axios from "axios";
import { chainIdToInfo } from "@/config";
import {
  MoralisNFTBalanceResult,
  NFTBalance,
  UniV3Metadata,
  UniV3Position,
} from "@/types";
import useSupportedChain from "@/hooks/useSupportedChain";
import Layout from "@/components/Layout";
import UniswapPositionCard from "@/components/UniswapPositionCard";
// TODO: use real time data
import mockAPIData from "@/mockAPIData.json";
import UniswapPosition from "@/components/UniswapPosition";
import BackButton from "@/components/BackButton";

const Home: NextPage = () => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { isSupportedChain } = useSupportedChain();

  const [uniV3Positions, setUniV3Positions] = useState<UniV3Position[]>();
  const [fetchingUniV3Positions, setFetchingUniV3Positions] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<UniV3Position>();

  const fetchUniswapPositions = async () => {
    setFetchingUniV3Positions(true);
    const nftBalances = await axios.get<MoralisNFTBalanceResult>(
      `https://deep-index.moralis.io/api/v2/${address}/nft`,
      {
        params: {
          chain: chain!.name,
        },
        headers: {
          "X-API-Key": process.env.NEXT_PUBLIC_MORALIS_API_KEY!,
          accept: "application/json",
        },
      }
    );

    // const nftBalances = mockAPIData; // for local tests

    setUniV3Positions(
      nftBalances.data.result
        .filter(
          (nft) =>
            nft.token_address ===
            chainIdToInfo[
              chain!.id
            ].UniV3NonfungiblePositionManager.toLowerCase()
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
    if (address && isSupportedChain) {
      fetchUniswapPositions();
    }
  }, [address, isSupportedChain]);

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
            {fetchingUniV3Positions && (
              <CircularProgress color="purple.300" isIndeterminate />
            )}
            {!selectedPosition ? (
              uniV3Positions ? (
                uniV3Positions.map((pos, i) => (
                  <UniswapPositionCard
                    key={i}
                    pos={pos}
                    setSelectedPosition={setSelectedPosition}
                  />
                ))
              ) : (
                <Text pt="3rem" fontSize="xl">
                  Connect Wallet to use the dapp ↗️
                </Text>
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
