import { ethers,run,upgrades} from 'hardhat'

async function main(){
    await run("compile");
    const { PROXY_ADMIN_ADDRESS } = process.env;
    const upgradeAddress = PROXY_ADMIN_ADDRESS !== undefined ? PROXY_ADMIN_ADDRESS : ''
    const iip15Contract = await ethers.getContractFactory("IIP15ManagerV2"); 
    const iip15 = await upgrades.upgradeProxy(upgradeAddress, iip15Contract);

    console.log("iip15 upgraded ",iip15.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });