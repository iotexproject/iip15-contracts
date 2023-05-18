# iip15-contracts

## deploy
```
yarn hardhat run scripts/deploy.ts --network mainnet
```

## upgrade
```
yarn hardhat run scripts/upgrade.ts --network mainnet
```

## verify proxy
upload solc-input.json

## verify implementation
```
yarn hardhat verify --network mainnet 0x...
```

## test
```
yarn hardhat test
```

## step by step
 - deploy `IIP15Manger`
 - deploy `IIP15Proxy`
 - transfer ownership of `IIP15Manger` to `IIP15Proxy`
 - 