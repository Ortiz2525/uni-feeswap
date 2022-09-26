// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import {IERC721} from "@openzeppelin/token/ERC721/IERC721.sol";

import "src/UniFeeSwap.sol";

/**
 * @dev Forked Polygon Mainnet tests
 */
contract UniFeeSwapTests is Test {
    INonfungiblePositionManager constant nonfungiblePositionManager =
        INonfungiblePositionManager(0xC36442b4a4522E871399CD717aBDD847Ab11FE88);

    UniFeeSwap uniFeeSwap;

    IERC20 usdc = IERC20(0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174);
    IERC20 usdt = IERC20(0xc2132D05D31c914a87C6611C10748AEb04B58e8F);

    function _addLiquidity(
        uint24 fee,
        int24 tickLower,
        int24 tickUpper
    ) internal returns (uint256 tokenId) {
        (tokenId, , , ) = nonfungiblePositionManager.mint(
            INonfungiblePositionManager.MintParams({
                token0: address(usdc),
                token1: address(usdt),
                fee: fee,
                tickLower: tickLower,
                tickUpper: tickUpper,
                amount0Desired: 1_000 * 10**6,
                amount1Desired: 1_000 * 10**6,
                amount0Min: 0,
                amount1Min: 0,
                recipient: address(this),
                deadline: block.timestamp
            })
        );
    }

    function setUp() external {
        uniFeeSwap = new UniFeeSwap(nonfungiblePositionManager, address(this));

        // get usdc & usdt
        deal(address(usdc), address(this), 100_000 * 10**6);
        deal(address(usdt), address(this), 100_000 * 10**6);

        usdc.approve(address(nonfungiblePositionManager), type(uint256).max);
        usdt.approve(address(nonfungiblePositionManager), type(uint256).max);
    }

    function testFeeSwap() external {
        uint24 initFee = 100;
        uint24 newFee = 3_000;
        uint256 tokenId = _addLiquidity(initFee, -3, 1);

        IERC721(address(nonfungiblePositionManager)).approve(
            address(uniFeeSwap),
            tokenId
        );

        uniFeeSwap.feeSwap(tokenId, newFee, 10);
    }
}
