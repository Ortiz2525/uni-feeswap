import { useState, useEffect } from "react";
import { useNetwork } from "wagmi";
import { supportedChains } from "@/config";

function useSupportedChain() {
  const [isSupportedChain, setIsSupportedChain] = useState(false);

  const { chain } = useNetwork();

  useEffect(() => {
    if (chain) {
      setIsSupportedChain(
        supportedChains.findIndex((_chain) => _chain.id === chain.id) !== -1
      );
    } else {
      setIsSupportedChain(false);
    }
  }, [chain]);

  return { isSupportedChain };
}

export default useSupportedChain;
