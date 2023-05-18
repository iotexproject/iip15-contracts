import { ethers,run,upgrades} from 'hardhat'
import {  save } from './util'

async function main(){
    //await run("compile");
    const [ owner ] = await ethers.getSigners()
    const { PROXY_ADDRESS } = process.env;
    const upgradeAddress = PROXY_ADDRESS !== undefined ? PROXY_ADDRESS : ''
    const iip15Contract = await ethers.getContractFactory("IIP15ManagerV2"); 
    const iip15 = await upgrades.upgradeProxy(upgradeAddress, iip15Contract);
    const height = await ethers.provider.getBlockNumber()
    console.log("upgrade proxy at ",iip15.address, "Owner: ", owner.address);
    const impl = await upgrades.erc1967.getImplementationAddress(iip15.address);
    console.log("implementation address: ", impl);
    await save("IIP15ManagerV2", {
        address: iip15.address,
        abi: (iip15.interface).format(ethers.utils.FormatTypes.json),
        version: "V2",
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