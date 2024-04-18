import { ethers } from 'ethers'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/dist/types'
import config from '../constants/config'

const func: DeployFunction = async function (hre: HardhatRuntimeEnviorment) {
  const { deployments, getNamedAccounts, getChainId } = hre
  const { deploy } = deployments

  const { deployer } = await getNamedAccounts()
  const chainId = await getChainId()
  const WNATIVE_ADDRESS = config[chainId].WNATIVE_ADDRESS
  const FACTORY_ADDRESS = config[chainId].FACTORY_ADDRESS

  const quoterV2Artifact = await hre.artifacts.readArtifact('QuoterV2')

  await deploy('QuoterV2', {
    from: deployer,
    contract: {
      bytecode: quoterV2Artifact.bytecode,
      abi: quoterV2Artifact.abi,
    },
    args: [FACTORY_ADDRESS, WNATIVE_ADDRESS],
    log: true,
    deterministicDeployment: false,
  })
}

export default func
func.tags = ['QuoterV2']
