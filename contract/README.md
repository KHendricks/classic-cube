# Compile

`npx hardhat compile`

# Deploy the contract

`npx hardhat run scripts/deploy.js --network rinkeby`

# To run unittests

`npx hardhat test`

# Verify on Etherscan

`npx hardhat verify --network rinkeby contract_address "Constructor Arg1" "Constructor Arg2" "Constructor Arg3"`

# When using Mainnet

1. Need to change private key to use mainnet wallet
2. Need to pass in main flag to tell deploy script which network to use
