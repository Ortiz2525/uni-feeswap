import { chain } from "wagmi";

export const supportedChains = [chain.optimism, chain.polygon, chain.goerli];

export const chainIdToRPC = {
  [chain.optimism.id]: process.env.NEXT_PUBLIC_OPTIMISM_RPC_URL,
  [chain.polygon.id]: process.env.NEXT_PUBLIC_POLYGON_RPC_URL,
  [chain.goerli.id]: process.env.NEXT_PUBLIC_GOERLI_RPC_URL,
  [chain.mainnet.id]: process.env.NEXT_PUBLIC_MAINNET_RPC_URL, // for ENS resolution
};

// Mainnet, Polygon, Optimism, Arbitrum, Testnets Address
const UniV3NonfungiblePositionManager =
  "0xC36442b4a4522E871399CD717aBDD847Ab11FE88";

/**
 * How to check which fee tiers supported?
 * "0.05%", "0.3%", "1%" supported by default. "0.01%" was added later
 *
 * Go to NonfungiblePositionManager -> factory()
 * check if factory.feeAmountTickSpacing() returns non-zero value
 *
 * Fee    |  feeAmount  | tickSpacing
 * 0.01%       100            1
 * 0.05%       500           10
 * 0.30%      3000           60
 * 0.10%     10000          200
 *
 */

export const chainIdToInfo: {
  [chainId: number]: {
    UniFeeSwap: string;
    UniV3NonfungiblePositionManager: string;
    feeTiers: string[];
  };
} = {
  [chain.optimism.id]: {
    UniFeeSwap: "0x3a7ffb4cc8929afeed81f0aa3bc0ff77f16db7a8",
    UniV3NonfungiblePositionManager,
    feeTiers: ["0.01%", "0.05%", "0.3%", "1%"],
  },
  [chain.polygon.id]: {
    UniFeeSwap: "0xd9fbf3c656de1c544e4b9486ecf77ea4639608ae",
    UniV3NonfungiblePositionManager,
    feeTiers: ["0.01%", "0.05%", "0.3%", "1%"],
  },
  [chain.goerli.id]: {
    UniFeeSwap: "0x331831e7996fcd1b56f30b1c5e48121192fe88f5",
    UniV3NonfungiblePositionManager,
    feeTiers: ["0.01%", "0.05%", "0.3%", "1%"],
  },
};
