import dotenv from 'dotenv'
import '@typechain/hardhat'
import '@nomiclabs/hardhat-ethers'
import '@openzeppelin/hardhat-upgrades'
import type { HardhatUserConfig } from "hardhat/config"
import 'hardhat-deploy'

dotenv.config({ path: '.env' });

const { PRIVATE_KEY } = process.env;
const accounts = PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : []

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
      gas: 2100000,
      gasPrice: 8000000000
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      allowUnlimitedContractSize: true,
      gas: 2100000,
      gasPrice: 8000000000
    },
    mainnet: {
      url: 'https://babel-api.mainnet.iotex.io',
      accounts: accounts,
      chainId: 4689,
    },
    testnet: {
      url: 'https://babel-api.testnet.iotex.io',
      accounts: accounts,
      chainId: 4690,
    },
  },
  namedAccounts: {
    deployer: 0,
    tokenOwner: 1,
  },
  solidity: {
    compilers: [
      {
        version: "0.8.15",
        settings: {
          optimizer: {
            enabled: true,
            runs: 10000,
          },
        },
      },
    ],
  },
  typechain: {
    outDir: "typechain",
    target: "ethers-v5",
  }
}

export default config