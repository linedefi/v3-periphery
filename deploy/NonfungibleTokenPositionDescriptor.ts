import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/dist/types'
import config from '../constants/config'

const func: DeployFunction = async function ({
  ethers,
  getNamedAccounts,
  deployments,
  getChainId,
}: HardhatRuntimeEnvironment) {
  const { deploy } = deployments

  const { deployer } = await getNamedAccounts()

  const chainId = await getChainId()
  const WNATIVE_ADDRESS = config[chainId].WNATIVE_ADDRESS
  const NATIVE_CURRENCY_LABEL = config[chainId].NATIVE_CURRENCY_LABEL


  console.log('Deploying NonfungibleTokenPositionDescriptor...', {
    args: [WNATIVE_ADDRESS, NATIVE_CURRENCY_LABEL],
  })

  const NFTDescriptor = await deployments.get('NFTDescriptor')

  await deploy('NonfungibleTokenPositionDescriptor', {
    from: deployer,
    args: [WNATIVE_ADDRESS, NATIVE_CURRENCY_LABEL],
    log: true,
    deterministicDeployment: false,
    libraries: {
      NFTDescriptor: NFTDescriptor.address,
    },
  })
}

func.tags = ['NonfungibleTokenPositionDescriptor']

func.dependencies = ['NFTDescriptor']

export default func
