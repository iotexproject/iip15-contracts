import { ethers,run,upgrades} from 'hardhat'

async function main(){
    await run("compile");

    const iip15Contract = await ethers.getContractFactory("IIP15ManagerV1"); 
    const iip15 = await upgrades.deployProxy(iip15Contract);

    await iip15.deployed();

    console.log("deployed at ",iip15.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });