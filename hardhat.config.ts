import 'dotenv/config'
import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-waffle'
import '@nomiclabs/hardhat-ethers'
import 'hardhat-deploy'
import 'hardhat-deploy-ethers'
import '@nomicfoundation/hardhat-verify'
import 'hardhat-typechain'
import 'hardhat-watcher'
import { task, types } from 'hardhat/config'

const LOW_OPTIMIZER_COMPILER_SETTINGS = {
  version: '0.7.6',
  settings: {
    evmVersion: 'istanbul',
    optimizer: {
      enabled: true,
      runs: 2_000,
    },
    metadata: {
      bytecodeHash: 'none',
    },
  },
}

const LOWEST_OPTIMIZER_COMPILER_SETTINGS = {
  version: '0.7.6',
  settings: {
    evmVersion: 'istanbul',
    optimizer: {
      enabled: true,
      runs: 1_000,
    },
    metadata: {
      bytecodeHash: 'none',
    },
  },
}

const DEFAULT_COMPILER_SETTINGS = {
  version: '0.7.6',
  settings: {
    evmVersion: 'istanbul',
    optimizer: {
      enabled: true,
      runs: 1_000_000,
    },
    metadata: {
      bytecodeHash: 'none',
    },
  },
}

if (!process.env.DEPLOYER) throw new Error("DEPLOYER not found. Set DEPLOYER to the .env file");
const deployer = process.env.DEPLOYER;

if (!process.env.PRIVATE_KEY) throw new Error("PRIVATE_KEY not found. Set PRIVATE_KEY to the .env file");
const PRIVATE_KEY = process.env.PRIVATE_KEY;

if (!process.env.LINEA_RPC_URL) throw new Error("LINEA_RPC_URL not found. Set LINEA_RPC_URL to the .env file");
const LINEA_RPC_URL = process.env.LINEA_RPC_URL;


task('add-fee-tier', 'Add fee tier')
  .addParam('fee', 'Fee', 100, types.int)
  .addParam('tickSpacing', 'Tick Spacing', 1, types.int)
  .setAction(async (taskArgs, hre) => {
    const { fee, tickSpacing } = taskArgs
    const { getNamedAccounts, ethers, deployments } = hre
    const factory = await ethers.getContract('UniswapV3Factory')
    await factory.enableFeeAmount(fee, tickSpacing)
    console.log('Enabled fee amount')
  })

export default {
  networks: {
    hardhat: {
      allowUnlimitedContractSize: false,
    },   
    linea: {
      url: LINEA_RPC_URL,
      accounts: [`0x${PRIVATE_KEY}`],
      chainId: 59144,
      live: true,
      saveDeployments: true,
    },
  },
  namedAccounts: {
    deployer,
    alice: {
      default: 1,
    },
    bob: {
      default: 2,
    },
    carol: {
      default: 3,
    },
    dev: {
      default: 4,
    },
    feeTo: {
      default: 5,
    },
  },
  etherscan: {
    apiKey: {
      linea: 'W9EEZBTK4YQC8PMZNJ75C6QI126D25ZVV4',
    },
    customChains: [
      {
        network: "linea",
        chainId: 59144,
        urls: {
          apiURL: "https://api.lineascan.build/api",
          browserURL: "https://lineascan.build/"
        }
      },
    ],
  },
  solidity: {
    compilers: [DEFAULT_COMPILER_SETTINGS],
    overrides: {
      'contracts/NonfungiblePositionManager.sol': LOW_OPTIMIZER_COMPILER_SETTINGS,
      'contracts/test/MockTimeNonfungiblePositionManager.sol': LOW_OPTIMIZER_COMPILER_SETTINGS,
      'contracts/test/NFTDescriptorTest.sol': LOWEST_OPTIMIZER_COMPILER_SETTINGS,
      'contracts/NonfungibleTokenPositionDescriptor.sol': LOWEST_OPTIMIZER_COMPILER_SETTINGS,
      'contracts/libraries/NFTDescriptor.sol': LOWEST_OPTIMIZER_COMPILER_SETTINGS,
    },
  },
  watcher: {
    test: {
      tasks: [{ command: 'test', params: { testFiles: ['{path}'] } }],
      files: ['./test/**/*'],
      verbose: true,
    },
  },
}
