import { ethers,run,upgrades} from 'hardhat'

async function main(){
    console.log("Transferring ownership of ProxyAdmin...");
    const { PROXY_ADMIN_ADDRESS } = process.env;
    const upgradeAddress = PROXY_ADMIN_ADDRESS !== undefined ? PROXY_ADMIN_ADDRESS : '0x1c14600daeca8852BA559CC8EdB1C383B8825906'
    await upgrades.admin.transferProxyAdminOwnership(upgradeAddress);

    console.log("Transferred ownership of ProxyAdmin to:", upgradeAddress);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });