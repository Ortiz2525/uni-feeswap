import { useMemo } from "react";
import { useContractRead } from "wagmi";
import { constants } from "ethers";
import NonfungiblePositionManagerABI from "@/abis/NonfungiblePositionManager.json";
import useChainInfo from "./useChainInfo";

export default function useUniV3Operator(
  tokenId: string,
  watch: boolean
): string | undefined {
  const { UniV3NonfungiblePositionManager } = useChainInfo();

  const args = useMemo(() => tokenId, [tokenId]);
  const { data } = useContractRead({
    addressOrName: UniV3NonfungiblePositionManager ?? constants.AddressZero,
    contractInterface: NonfungiblePositionManagerABI,
    functionName: "getApproved",
    args,
    watch,
    enabled: !!UniV3NonfungiblePositionManager,
  });

  return data as unknown as string | undefined;
}
