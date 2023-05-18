import { ethers,run,upgrades} from 'hardhat'
import { load, save } from './util'

async function main(){
    //await run("compile");
    const [ owner ] = await ethers.getSigners()
    const height = await ethers.provider.getBlockNumber()
    const iip15Contract = await ethers.getContractFactory("IIP15ManagerV1"); 
    const iip15 = await upgrades.deployProxy(iip15Contract, { kind: 'uups', initializer: "initialize" });
    await iip15.deployed();

    console.log("deployed proxy at ",iip15.address, "Owner: ", owner.address);
    const impl = await upgrades.erc1967.getImplementationAddress(iip15.address);
    console.log("implementation address: ", impl);
    await save("IIP15ManagerV1", {
        address: iip15.address,
        abi: (iip15.interface).format(ethers.utils.FormatTypes.json),
        version: "V1",
        date: new Date().toUTCString(),
        block: height,
        tx: iip15.deployTransaction.hash,
        owner: owner.address,
        implementation: impl
    })
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });