# UniFeeSwap

To deploy contract on Goerli testnet:

```
source .env && forge script ./script/Deploy.s.sol --broadcast --rpc-url $GOERLI_RPC_URL --sender $SENDER_ADDRESS -i 1 --verify --etherscan-api-key $ETHERSCAN_KEY
```

Enter private key when prompted.

---

Run forked tests on Polygon:

```
forge test --fork-url https://polygon-rpc.com
```
