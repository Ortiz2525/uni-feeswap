import { useCallback, useEffect, useMemo, useState } from "react";
import {
  useSigner,
  useAccount,
  useDeprecatedSendTransaction,
  useContract,
  UserRejectedRequestError,
  useWaitForTransaction,
} from "wagmi";
import { constants, Contract, BigNumber } from "ethers";
import NonfungiblePositionManagerABI from "@/abis/NonfungiblePositionManager.json";
import useUniV3Operator from "./useUniV3Operator";
import useChainInfo from "./useChainInfo";

export function calculateGasMargin(value: BigNumber): BigNumber {
  return value.mul(BigNumber.from(10000 + 3000)).div(BigNumber.from(10000)); // 130%
}

export enum ApprovalState {
  UNKNOWN = "UNKNOWN",
  NOT_APPROVED = "NOT_APPROVED",
  PENDING = "PENDING",
  APPROVED = "APPROVED",
}

export default function useUniV3ApproveCallback(tokenId: string): {
  approvalState: ApprovalState;
  approve: () => Promise<void>;
  operator: string | undefined;
} {
  const { data: signer } = useSigner();
  const { address } = useAccount();
  const {
    data: sendTransactionData,
    sendTransactionAsync,
    isLoading: isWriteLoading,
  } = useDeprecatedSendTransaction();
  //TODO: useToast to show txn status
  const { isLoading: isTransactionPending } = useWaitForTransaction({
    hash: sendTransactionData?.hash,
  });
  const { UniFeeSwap, UniV3NonfungiblePositionManager } = useChainInfo();

  // `watch`: whether to fetch again for subsequent blocks
  const [watch, setWatch] = useState(false);
  const operator = useUniV3Operator(tokenId, watch);

  const approvalState: ApprovalState = useMemo(() => {
    if (isWriteLoading || isTransactionPending) return ApprovalState.PENDING;

    // We might not have enough data to know whether we need to approve
    if (!operator || !UniFeeSwap) return ApprovalState.UNKNOWN;

    return operator.toLowerCase() === UniFeeSwap.toLowerCase()
      ? ApprovalState.APPROVED
      : ApprovalState.NOT_APPROVED;
  }, [isWriteLoading, isTransactionPending, operator, UniFeeSwap]);

  const nftPositionManagerContract = useContract<Contract>({
    addressOrName: UniV3NonfungiblePositionManager ?? constants.AddressZero,
    contractInterface: NonfungiblePositionManagerABI,
    signerOrProvider: signer,
  });

  const approve = useCallback(async (): Promise<void> => {
    if (approvalState !== ApprovalState.NOT_APPROVED) {
      console.error("approve was called unnecessarily");
      return;
    }

    if (!UniV3NonfungiblePositionManager) {
      console.error("UniV3NonfungiblePositionManager is undefined");
      return;
    }

    if (!UniFeeSwap) {
      console.error("UniFeeSwap is undefined");
      return;
    }

    const estimatedGas = await nftPositionManagerContract.estimateGas.approve(
      UniFeeSwap,
      tokenId
    );

    try {
      const data = await sendTransactionAsync({
        request: {
          from: address,
          to: UniV3NonfungiblePositionManager,
          data: nftPositionManagerContract.interface.encodeFunctionData(
            "approve",
            [UniFeeSwap, tokenId]
          ),
          gasLimit: calculateGasMargin(estimatedGas),
        },
      });
    } catch (e: unknown) {
      if (!(e instanceof UserRejectedRequestError)) {
        console.error(e);
      }
    }
  }, [
    approvalState,
    UniV3NonfungiblePositionManager,
    UniFeeSwap,
    nftPositionManagerContract,
    address,
    tokenId,
    sendTransactionAsync,
  ]);

  useEffect(() => {
    // start watching only after approve txn initiated
    setWatch(approvalState === ApprovalState.PENDING);
  }, [approvalState]);

  return { approvalState, approve, operator };
}
