import { useEffect, useState } from "react";
import { useNetwork } from "wagmi";
import { constants } from "ethers";
import { chainIdToInfo } from "@/config";

const useChainInfo = () => {
  const { chain } = useNetwork();

  const [UniFeeSwap, setUniFeeSwap] = useState<string>(constants.AddressZero);
  const [UniV3NonfungiblePositionManager, setUniV3NonfungiblePositionManager] =
    useState<string>(constants.AddressZero);
  const [feeTiers, setFeeTiers] = useState<string[]>();

  useEffect(() => {
    if (chain) {
      setUniFeeSwap(chainIdToInfo[chain.id].UniFeeSwap);
      setUniV3NonfungiblePositionManager(
        chainIdToInfo[chain.id].UniV3NonfungiblePositionManager
      );
      setFeeTiers(chainIdToInfo[chain.id].feeTiers);
    } else {
      setUniFeeSwap(constants.AddressZero);
      setUniV3NonfungiblePositionManager(constants.AddressZero);
      setFeeTiers(undefined);
    }
  }, [chain]);

  return { UniFeeSwap, UniV3NonfungiblePositionManager, feeTiers };
};

export default useChainInfo;
