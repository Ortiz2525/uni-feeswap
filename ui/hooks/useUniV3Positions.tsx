import { useState, useEffect } from "react";
import {
  useContractRead,
  useAccount,
  useContract,
  useProvider,
  useNetwork,
} from "wagmi";
import { BigNumber, Contract } from "ethers";
import useChainInfo from "@/hooks/useChainInfo";
import { UniV3Position, UniV3Metadata } from "@/types";
import NonfungiblePositionManagerABI from "@/abis/NonfungiblePositionManager.json";
import useSupportedChain from "@/hooks/useSupportedChain";

const useUniV3Positions = () => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { isSupportedChain } = useSupportedChain();
  const provider = useProvider();
  const { UniV3NonfungiblePositionManager } = useChainInfo();
  const nonfungiblePositionManagerContract = useContract<Contract>({
    addressOrName: UniV3NonfungiblePositionManager,
    contractInterface: NonfungiblePositionManagerABI,
    signerOrProvider: provider,
  });

  const [fetchingUniV3Positions, setFetchingUniV3Positions] = useState(false);
  const [balance, setBalance] = useState<number>();
  const [tokenIds, setTokenIds] = useState<string[]>();
  const [uniV3Positions, setUniV3Positions] = useState<UniV3Position[]>();

  const { data } = useContractRead({
    addressOrName: UniV3NonfungiblePositionManager,
    contractInterface: NonfungiblePositionManagerABI,
    functionName: "balanceOf",
    args: address,
    onSuccess(data) {
      setBalance((data as unknown as BigNumber).toNumber());
    },
    cacheOnBlock: true,
    cacheTime: 2_000,
    enabled: isSupportedChain,
  });

  useEffect(() => {
    if (balance) {
      if (balance > 0) {
        if (!uniV3Positions) {
          setFetchingUniV3Positions(true);
        } else {
          setFetchingUniV3Positions(false);
        }
      }
    } else {
      setFetchingUniV3Positions(false);
    }
  }, [isSupportedChain, balance, uniV3Positions]);

  useEffect(() => {
    // reset when chain switched
    setBalance(undefined);
    setUniV3Positions(undefined);
  }, [chain]);

  useEffect(() => {
    const fetchTokenIds = async () => {
      setTokenIds(
        //TODO: use multicall
        await Promise.all(
          [...Array(balance)].map(async (_, i) =>
            (
              (await nonfungiblePositionManagerContract.tokenOfOwnerByIndex(
                address,
                i
              )) as BigNumber
            ).toString()
          )
        )
      );
    };

    if (balance && address && nonfungiblePositionManagerContract) {
      fetchTokenIds();
    }
  }, [balance, address, nonfungiblePositionManagerContract]);

  useEffect(() => {
    const fetchPositions = async () => {
      let _positions: UniV3Position[] = [];

      for (var i = 0; i < tokenIds!.length; i++) {
        //TODO: use multicall
        _positions.push({
          token_id: tokenIds![i],
          metadata: JSON.parse(
            Buffer.from(
              (
                (await nonfungiblePositionManagerContract.tokenURI(
                  tokenIds?.[i]
                )) as string
              ).substring(29), // 29 = length of "data:application/json;base64,"
              "base64"
            ).toString()
          ) as UniV3Metadata,
        });
      }

      setUniV3Positions(_positions);
    };

    if (tokenIds && tokenIds.length > 0) {
      fetchPositions();
    }
  }, [tokenIds, nonfungiblePositionManagerContract]);

  return { balance, tokenIds, uniV3Positions, fetchingUniV3Positions };
};

export default useUniV3Positions;
