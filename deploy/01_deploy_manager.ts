import { DeployFunction } from "hardhat-deploy/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"

const deploy: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployments, getNamedAccounts } = hre
    const { deployer } = await getNamedAccounts()
    const { deploy } = deployments

    await deploy("IIP15Manager", {
        from: deployer,
        args: [],
        log: true,
        deterministicDeployment: true,
    })
}

deploy.tags = ["IIP15Manager"]
export default deploy