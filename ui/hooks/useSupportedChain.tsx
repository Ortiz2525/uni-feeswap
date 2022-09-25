import { useState, useEffect } from "react";
import { useNetwork } from "wagmi";
import { supportedChains } from "@/config";

function useSupportedChain() {
  const [isSupportedChain, setIsSupportedChain] = useState(false);

  const { activeChain } = useNetwork();

  useEffect(() => {
    if (activeChain) {
      setIsSupportedChain(
        supportedChains.findIndex((chain) => chain.id === activeChain.id) !== -1
      );
    } else {
      setIsSupportedChain(false);
    }
  }, [activeChain]);

  return { isSupportedChain };
}

export default useSupportedChain;
