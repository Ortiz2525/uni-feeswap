// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity ^0.8.0;

import {INonfungiblePositionManager} from "./uni-v3/INonfungiblePositionManager.sol";
import {IUniswapV3Factory} from "./uni-v3/IUniswapV3Factory.sol";
import {IERC20} from "@openzeppelin/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/token/ERC20/utils/SafeERC20.sol";
import {IERC721} from "@openzeppelin/token/ERC721/IERC721.sol";

/**
 * @title UniFeeSwap
 * @dev Contract that moves your Uniswap V3 liquidity from 1 Fee tier to another
 * @author Apoorv Lathey <apoorvlathey.com>
 */
contract UniFeeSwap {
    using SafeERC20 for IERC20;

    uint256 internal constant _BPS_MAX = 10_000;

    INonfungiblePositionManager public immutable nonfungiblePositionManager;
    IUniswapV3Factory public immutable factory;

    address public dev;

    error SameFeeTier(uint24 fee);
    error NotNFTOwner();
    error invalidBPS();
    error isNotDev();

    constructor(
        INonfungiblePositionManager nonfungiblePositionManager_,
        address dev_
    ) {
        nonfungiblePositionManager = nonfungiblePositionManager_;
        dev = dev_;

        factory = IUniswapV3Factory(nonfungiblePositionManager.factory());
    }

    modifier onlyDev() {
        if (msg.sender != dev) revert isNotDev();
        _;
    }

    /**
     * @dev Pulls user's liquidity from current fee tier to `newFee` tier
     * @param tokenId The tokenId of NFT representing the liquidity position in Uniswap V3
     * @param newFee The new fee tier to add liquidity to
     * @param devBPS Basis points of tokens to contribute to dev address
     * @param deadline The deadline after which permit will fail
     * @param v Signature for permit
     * @param r Signature for permit
     * @param s Signature for permit
     */
    function feeSwapWithPermit(
        uint256 tokenId,
        uint24 newFee,
        uint256 devBPS,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external {
        // permit to manage user's NFT
        nonfungiblePositionManager.permit(
            address(this),
            tokenId,
            deadline,
            v,
            r,
            s
        );

        feeSwap(tokenId, newFee, devBPS);
    }

    /**
     * @notice Approve this contract to operate your Uniswap V3 NFT, before calling this function
     * @param tokenId The tokenId of NFT representing the liquidity position in Uniswap V3
     * @param newFee The new fee tier to add liquidity to
     * @param devBPS Basis points of tokens to contribute to dev address
     */
    function feeSwap(
        uint256 tokenId,
        uint24 newFee,
        uint256 devBPS
    ) public {
        _verifyDevBPS(devBPS);
        _verifyNFTOwner(tokenId);

        (
            address token0,
            address token1,
            int24 tickLower,
            int24 tickUpper,
            uint128 liquidity
        ) = _getPositionInfo(tokenId, newFee);

        (uint256 amount0, uint256 amount1) = _removeLiquidity(
            tokenId,
            liquidity,
            devBPS
        );

        // mint position with new fee tier
        _addLiquidity(
            token0,
            token1,
            tickLower,
            tickUpper,
            newFee,
            amount0,
            amount1
        );
    }

    function withdrawDevShare(IERC20[] calldata tokens) external onlyDev {
        for (uint256 i; i < tokens.length; i++) {
            uint256 balance = tokens[i].balanceOf(address(this));
            tokens[i].safeTransfer(msg.sender, balance);
        }
    }

    function setNewDev(address newDev) external onlyDev {
        dev = newDev;
    }

    function _verifyDevBPS(uint256 devBPS) internal pure {
        if (devBPS > _BPS_MAX) revert invalidBPS();
    }

    function _verifyNFTOwner(uint256 tokenId) internal view {
        address owner = IERC721(address(nonfungiblePositionManager)).ownerOf(
            tokenId
        );
        if (msg.sender != owner) revert NotNFTOwner();
    }

    function _getPositionInfo(uint256 tokenId, uint24 newFee)
        internal
        view
        returns (
            address token0,
            address token1,
            int24 tickLower,
            int24 tickUpper,
            uint128 liquidity
        )
    {
        uint24 currentFee;
        (
            ,
            ,
            token0,
            token1,
            currentFee,
            tickLower,
            tickUpper,
            liquidity,
            ,
            ,
            ,

        ) = nonfungiblePositionManager.positions(tokenId);
        if (currentFee == newFee) revert SameFeeTier(newFee);
    }

    function _removeLiquidity(
        uint256 tokenId,
        uint128 liquidity,
        uint256 devBPS
    ) internal returns (uint256 amount0, uint256 amount1) {
        // remove liquidity (+ earned fees) from current pool
        nonfungiblePositionManager.decreaseLiquidity(
            INonfungiblePositionManager.DecreaseLiquidityParams({
                tokenId: tokenId,
                liquidity: liquidity,
                amount0Min: 0,
                amount1Min: 0,
                deadline: block.timestamp
            })
        );
        // withdraw tokens
        (amount0, amount1) = nonfungiblePositionManager.collect(
            INonfungiblePositionManager.CollectParams({
                tokenId: tokenId,
                recipient: address(this),
                amount0Max: type(uint128).max,
                amount1Max: type(uint128).max
            })
        );

        if (devBPS > 0) {
            amount0 = _deductDevShare(amount0, devBPS);
            amount1 = _deductDevShare(amount1, devBPS);
        }
    }

    function _deductDevShare(uint256 amount, uint256 devBPS)
        internal
        pure
        returns (uint256 newAmount)
    {
        uint256 devShare = (amount * devBPS) / _BPS_MAX;
        newAmount = amount - devShare;
    }

    function _addLiquidity(
        address token0,
        address token1,
        int24 tickLower,
        int24 tickUpper,
        uint24 newFee,
        uint256 amount0,
        uint256 amount1
    ) internal returns (uint256 amount0Used, uint256 amount1Used) {
        _approveToken(token0, address(nonfungiblePositionManager));
        _approveToken(token1, address(nonfungiblePositionManager));

        int24 newTickLower = _getNewTick(tickLower, newFee);
        int24 newTickUpper = _getNewTick(tickUpper, newFee);

        (, , amount0Used, amount1Used) = nonfungiblePositionManager.mint(
            INonfungiblePositionManager.MintParams({
                token0: token0,
                token1: token1,
                fee: newFee,
                tickLower: newTickLower,
                tickUpper: newTickUpper,
                amount0Desired: amount0,
                amount1Desired: amount1,
                amount0Min: 0,
                amount1Min: 0,
                recipient: msg.sender,
                deadline: block.timestamp
            })
        );

        _handleResidue(
            token0,
            token1,
            amount0,
            amount1,
            amount0Used,
            amount1Used
        );
    }

    /**
     * @dev Finds the tick nearest to the current tick, corresponding to the pool with `newFee`
     */
    function _getNewTick(int24 tick, uint24 newFee)
        internal
        view
        returns (int24 newTick)
    {
        int24 tickSpacing = factory.feeAmountTickSpacing(newFee);
        int24 quotient = tick / tickSpacing;

        int24 nearestLowerTick = quotient * tickSpacing;
        if (nearestLowerTick == tick) {
            return tick;
        }
        /**
         * lower <---diff1---> tick <---diff2---> upper
         *      |<---------tickSpacing--------->|
         */
        int24 diffFromLowerTick = tick - nearestLowerTick;
        int24 diffFromUpperTick = tickSpacing - diffFromLowerTick;

        // find which tick is nearest
        // round down if in the middle
        if (diffFromLowerTick < diffFromUpperTick) {
            newTick = nearestLowerTick;
        } else {
            newTick = tick + diffFromUpperTick;
        }
    }

    function _handleResidue(
        address token0,
        address token1,
        uint256 amount0,
        uint256 amount1,
        uint256 amount0Used,
        uint256 amount1Used
    ) internal {
        // send (any) residue back to the user
        uint256 amount0Residue = amount0 - amount0Used;
        uint256 amount1Residue = amount1 - amount1Used;

        if (amount0Residue > 0) {
            IERC20(token0).safeTransfer(msg.sender, amount0Residue);
        }
        if (amount1Residue > 0) {
            IERC20(token1).safeTransfer(msg.sender, amount1Residue);
        }
    }

    /**
     * @notice Sets infinite allowance for token
     * @param token The ERC20 token to approve
     * @param spender The spender of the token
     */
    function _approveToken(address token, address spender) internal {
        if (IERC20(token).allowance(address(this), spender) > 0) return;
        else {
            IERC20(token).safeApprove(spender, type(uint256).max);
        }
    }
}
