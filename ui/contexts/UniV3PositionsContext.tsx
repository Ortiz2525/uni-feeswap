import React, { useState, useEffect, createContext, useContext } from "react";
import {
  useContractRead,
  useAccount,
  useContract,
  useProvider,
  useNetwork,
} from "wagmi";
import { BigNumber, constants, Contract } from "ethers";
import useChainInfo from "@/hooks/useChainInfo";
import { UniV3Position, UniV3Metadata } from "@/types";
import NonfungiblePositionManagerABI from "@/abis/NonfungiblePositionManager.json";
import useSupportedChain from "@/hooks/useSupportedChain";

type UniV3PositionsContextType = {
  balance: number | undefined;
  tokenIds: string[] | undefined;
  uniV3Positions: UniV3Position[] | undefined;
  fetchingUniV3Positions: boolean;
  refetchPositions: Function;
};

export const UniV3PositionsContext = createContext<UniV3PositionsContextType>({
  balance: undefined,
  tokenIds: undefined,
  uniV3Positions: undefined,
  fetchingUniV3Positions: false,
  refetchPositions: () => {},
});

export const UniV3PositionsProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { isSupportedChain } = useSupportedChain();
  const provider = useProvider();
  const { UniV3NonfungiblePositionManager } = useChainInfo();
  const nonfungiblePositionManagerContract = useContract<Contract>({
    addressOrName: UniV3NonfungiblePositionManager ?? constants.AddressZero,
    contractInterface: NonfungiblePositionManagerABI,
    signerOrProvider: provider,
  });

  const [fetchingUniV3Positions, setFetchingUniV3Positions] = useState(false);
  const [balance, setBalance] = useState<number>();
  const [tokenIds, setTokenIds] = useState<string[]>();
  const [uniV3Positions, setUniV3Positions] = useState<UniV3Position[]>();
  const [isRefetchingPositions, setIsRefetchingPositions] = useState(false);

  const { refetch: refetchPositions, isRefetching: isRefetchingBalance } =
    useContractRead({
      addressOrName: UniV3NonfungiblePositionManager ?? constants.AddressZero,
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
    if (isRefetchingBalance) {
      setIsRefetchingPositions(true);
    }
  }, [isRefetchingBalance]);

  useEffect(() => {
    if (isRefetchingPositions) {
      setFetchingUniV3Positions(true);
    } else if (chain && address) {
      if (balance) {
        if (balance > 0) {
          if (!uniV3Positions) {
            setFetchingUniV3Positions(true);
          } else {
            setFetchingUniV3Positions(false);
          }
        }
      } else {
        setFetchingUniV3Positions(true);
      }
    } else {
      setFetchingUniV3Positions(false);
    }
  }, [balance, uniV3Positions, chain, address, isRefetchingPositions]);

  useEffect(() => {
    // reset when chain or address changed
    setBalance(undefined);
    setUniV3Positions(undefined);
  }, [chain, address]);

  useEffect(() => {
    const fetchTokenIds = async () => {
      setTokenIds(
        //TODO: use multicall
        await Promise.all(
          [...Array(balance)].map(async (_, i) =>
            (
              (await nonfungiblePositionManagerContract.tokenOfOwnerByIndex(
                address,
                balance! - 1 - i // getting latest tokenIds on top
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
      setIsRefetchingPositions(false);
    };

    if (tokenIds && tokenIds.length > 0) {
      fetchPositions();
    }
  }, [tokenIds, nonfungiblePositionManagerContract, isRefetchingPositions]);

  return (
    <UniV3PositionsContext.Provider
      value={{
        balance,
        tokenIds,
        uniV3Positions,
        fetchingUniV3Positions,
        refetchPositions,
      }}
    >
      {children}
    </UniV3PositionsContext.Provider>
  );
};

export const useUniV3Positions = () => useContext(UniV3PositionsContext);
