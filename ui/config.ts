import { chain } from "wagmi";

export const supportedChains = [
  // chain.optimism,
  // chain.polygon,
  chain.goerli,
];

export const chainIdToRPC = {
  [chain.optimism.id]: process.env.NEXT_PUBLIC_OPTIMISM_RPC_URL,
  [chain.polygon.id]: process.env.NEXT_PUBLIC_POLYGON_RPC_URL,
  [chain.goerli.id]: process.env.NEXT_PUBLIC_GOERLI_RPC_URL,
};

export const UniV3NonfungiblePositionManager =
  "0xC36442b4a4522E871399CD717aBDD847Ab11FE88";

export const chainIdToInfo: {
  [chainId: number]: {
    UniFeeSwap: string;
  };
} = {
  [chain.goerli.id]: {
    UniFeeSwap: "0xd204c0CFDCea02CdEcff7e23EA248c5c9c0652d6",
  },
};
