# UniFeeSwap

## Deploy

To deploy contract on **Goerli testnet**:

```
source .env && forge script ./script/Deploy.s.sol --broadcast --rpc-url $GOERLI_RPC_URL --sender $SENDER_ADDRESS -i 1 --verify --etherscan-api-key $ETHERSCAN_KEY
```

To deploy contract on **Polygon**:

```
source .env && forge script ./script/Deploy.s.sol --broadcast --rpc-url $POLYGON_RPC_URL --sender $SENDER_ADDRESS -i 1 --verify --etherscan-api-key $POLYGONSCAN_KEY --with-gas-price 50000000000
```

To deploy contract on **Optimism**:

```
source .env && forge script ./script/Deploy.s.sol --broadcast --rpc-url $OPTIMISM_RPC_URL --sender $SENDER_ADDRESS -i 1 --verify --etherscan-api-key $OPTIMISM_ETHERSCAN_KEY
```

Enter private key when prompted.

---

## Test

Run forked tests on **Polygon**:

```
forge test --fork-url https://polygon-rpc.com
```
