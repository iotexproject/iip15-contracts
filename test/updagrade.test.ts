import { artifacts, ethers, upgrades } from 'hardhat'
import { solidity } from "ethereum-waffle";
import { expect, use } from 'chai'
import { IIP15ManagerV1, IIP15ManagerV1__factory, IIP15ManagerV2, IIP15ManagerV2__factory } from '../typechain'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

use(solidity)
describe('uups mode upgrade', () => {
    let managerProxyV1: IIP15ManagerV1;
    let managerProxyV2: IIP15ManagerV2;
    let oldOwner: SignerWithAddress;
    let newOwner: SignerWithAddress;
    let register: SignerWithAddress;
    let receiver: SignerWithAddress;
    beforeEach(async () => {
        [oldOwner, newOwner, register, receiver] = await ethers.getSigners();
        const iip15V1Factory: IIP15ManagerV1__factory = <IIP15ManagerV1__factory>
            await ethers.getContractFactory('IIP15ManagerV1', oldOwner);
        //console.log("Deploying IIP15ManagerV1...");
        managerProxyV1 = (await upgrades.deployProxy(iip15V1Factory, { kind: 'uups', initializer: "initialize" })) as IIP15ManagerV1;
        await managerProxyV1.deployed();
        //console.log("IIP15ManagerV1 proxy address: ", managerProxyV1.address, "Owner: ", oldOwner.address);
        //const implAddress = await upgrades.erc1967.getImplementationAddress(managerProxyV1.address)
        //console.log("IIP15ManagerV1 implementation address: ", implAddress)
        managerProxyV1.registerContract(register.address, receiver.address)
    })
    it('V1 registerContract', async () => {
        await managerProxyV1.registerContract(register.address, receiver.address)
        const info = await managerProxyV1.getContract(register.address)
        expect(info.recipient).equal(receiver.address)
        expect(info.isApproved).equal(false)
    })
    it('V1 approveContract', async () => {
        await managerProxyV1.approveContract(register.address)
        const info = await managerProxyV1.getContract(register.address)
        expect(info.isApproved).equal(true)
    })
    it('V1 disapproveContract', async () => {
        await managerProxyV1.approveContract(register.address)
        await managerProxyV1.disapproveContract(register.address)
        const info = await managerProxyV1.getContract(register.address)
        expect(info.isApproved).equal(false)
    })
    it('V1 removeContract', async () => {
        await managerProxyV1.removeContract(register.address)
        const info = await managerProxyV1.getContract(register.address)
        expect(info.recipient).equal(ethers.constants.AddressZero)
        expect(info.isApproved).equal(false)
    })
    it('change proxy owner', async () => {
        const res = await managerProxyV1.transferOwnership(newOwner.address)
        await res.wait()
        const owner = await managerProxyV1.owner()
        expect(owner).equal(newOwner.address)
        describe('after change owner', () => {
            managerProxyV1.registerContract(register.address, receiver.address)
            it('only owner can approveContract', async () => {
                expect(managerProxyV1.connect(newOwner).approveContract(register.address)).to.be.ok
                expect(managerProxyV1.connect(newOwner).disapproveContract(register.address)).to.be.ok
                await expect(managerProxyV1.connect(oldOwner).approveContract(register.address)).to.be.revertedWith("Ownable: caller is not the owner")
            })
            it('only owner can disapproveContract', async () => {
                expect(managerProxyV1.connect(newOwner).approveContract(register.address)).to.be.ok
                await expect(managerProxyV1.connect(oldOwner).disapproveContract(register.address)).to.be.revertedWith("Ownable: caller is not the owner")
            })
            it('only owner can removeContract', async () => {
                await expect(managerProxyV1.connect(oldOwner).removeContract(register.address)).to.be.revertedWith("Ownable: caller is not the owner")
                expect(managerProxyV1.connect(newOwner).removeContract(register.address)).to.be.ok
            })
            it('upgrade contract use new owner', async () => {
                const iip15V2Factory: IIP15ManagerV2__factory = <IIP15ManagerV2__factory>
                    await ethers.getContractFactory('IIP15ManagerV2', newOwner);
                await upgrades.upgradeProxy(managerProxyV1.address, iip15V2Factory)
                managerProxyV2 = iip15V2Factory.attach(managerProxyV1.address)
                expect(await managerProxyV2.test()).equal("upgraded")
            })
        })

    })
})
