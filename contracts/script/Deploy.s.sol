// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "src/UniFeeSwap.sol";

contract Deploy is Script {
    INonfungiblePositionManager constant nonfungiblePositionManager =
        INonfungiblePositionManager(0xC36442b4a4522E871399CD717aBDD847Ab11FE88);
    address constant dev = 0x63A556c75443b176b5A4078e929e38bEb37a1ff2;

    function run() external {
        vm.startBroadcast();

        new UniFeeSwap(nonfungiblePositionManager, dev);

        vm.stopBroadcast();
    }
}
