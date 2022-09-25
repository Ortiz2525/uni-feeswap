import type { NextPage } from "next";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import { Center, Box, VStack, Heading } from "@chakra-ui/react";
import Layout from "../components/Layout";

const Home: NextPage = () => {
  return (
    <Layout>
      <Head>
        <title>🦄 UniFeeSwap</title>
      </Head>
      <Center flexDir="column">
        <Box mt="2rem" py="2rem" px="10rem" boxShadow="2xl" rounded="lg">
          <VStack spacing="2rem">
            <Heading fontSize="2xl">Your Uniswap V3 Positions</Heading>
          </VStack>
        </Box>
      </Center>
    </Layout>
  );
};

export default Home;
