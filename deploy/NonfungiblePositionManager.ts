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
  console.log('HERE');
  
  const chainId = String(await getChainId())
  console.log('chainId',chainId);
  
  const WNATIVE_ADDRESS = config[chainId].WNATIVE_ADDRESS
  const FACTORY_ADDRESS = config[chainId].FACTORY_ADDRESS

  if (!deployments.get('NonfungibleTokenPositionDescriptor')) {
    throw Error(`No NonfungibleTokenPositionDescriptor for chain #${chainId}!`)
  }

  const NonfungibleTokenPositionDescriptor = await deployments.get('NonfungibleTokenPositionDescriptor')

  await deploy('NonfungiblePositionManager', {
    from: deployer,
    args: [FACTORY_ADDRESS, WNATIVE_ADDRESS, NonfungibleTokenPositionDescriptor.address],
    log: true,
    deterministicDeployment: false,
  })
}

func.tags = ['NonfungiblePositionManager']

func.dependencies = ['NonfungibleTokenPositionDescriptor']

export default func
