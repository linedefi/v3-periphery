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
  const NONFUNGIBLE_POSITION_MANAGER_ADDRESS = config[chainId].NONFUNGIBLE_POSITION_MANAGER_ADDRESS


  const v3Migrator = await hre.artifacts.readArtifact('V3Migrator')

  await deploy('V3Migrator', {
    from: deployer,
    contract: {
      bytecode: v3Migrator.bytecode,
      abi: v3Migrator.abi,
    },
    args: [FACTORY_ADDRESS, WNATIVE_ADDRESS, NONFUNGIBLE_POSITION_MANAGER_ADDRESS],
    log: true,
    deterministicDeployment: false,
  })
}

export default func
func.tags = ['V3Migrator']
