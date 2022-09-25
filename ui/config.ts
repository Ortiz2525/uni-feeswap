import { chain } from "wagmi";

export const supportedChains = [chain.optimism, chain.polygon];

export const chainIdToRPC = {
  [chain.optimism.id]: process.env.NEXT_PUBLIC_OPTIMISM_RPC_URL,
  [chain.polygon.id]: process.env.NEXT_PUBLIC_POLYGON_RPC_URL,
};
