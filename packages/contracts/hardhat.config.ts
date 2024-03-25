import dotenv from 'dotenv'
dotenv.config()
import '@openzeppelin/hardhat-upgrades'
import '@nomicfoundation/hardhat-toolbox'
import '@nomiclabs/hardhat-ethers'
import 'solidity-coverage'
import '@typechain/hardhat'
import 'hardhat-docgen'

import type { HardhatUserConfig } from 'hardhat/config'

const config: HardhatUserConfig = {
  solidity: '0.8.23',
  networks: {
    ethereum: {
      accounts: [process.env.PRIVATE_KEY!],
      url: `https://eth-mainnet.g.alchemy.com/v2/1Rhy4iowYLfC12S86ZZaKUjy1tmLAars`,
      gasPrice: 400000000000
    },
    sepolia: {
      accounts: [process.env.PRIVATE_KEY!],
      url: `https://eth-sepolia.g.alchemy.com/v2/qKOejal-tbfyH6_jIHxCGwExilHgqmbF`
    }
  },
  etherscan: {
    apiKey: {
      ethereum: process.env.ETHERSCAN_API_KEY!,
      sepolia: process.env.ETHERSCAN_API_KEY!
    }
  },
  paths: {
    sources: './contracts',
    cache: './cache_hardhat',
    artifacts: './out',
    tests: './test'
  },
  docgen: {
    path: './docs',
    runOnCompile: true,
    clear: true
  },
  typechain: {
    outDir: './typechain',
    target: './ethers-v5',
    externalArtifacts: ['./out/**/*.json']
  }
}

export default config
