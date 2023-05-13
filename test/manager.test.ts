import { ethers } from 'hardhat'
import { deployContract, MockProvider, solidity } from "ethereum-waffle";
import { expect, use } from 'chai'
import { IIP15Manager, IIP15Manager__factory } from '../typechain'
use(solidity)
describe('IIP15Manager', () => {
  let iip15Manager: IIP15Manager
  const [oriOwner, register, receiver] = new MockProvider().getWallets();

  beforeEach(async () => {
    const iip15ManagerFactory = await ethers.getContractFactory('IIP15Manager')
    iip15Manager = (await iip15ManagerFactory.deploy()) as IIP15Manager;
    await iip15Manager.deployed();
    iip15Manager = await deployContract(oriOwner, IIP15Manager__factory)
    await iip15Manager.deployed()
    //console.log('iip15Manager deployed to:', iip15Manager.address)
  })

  it('registerContract', async () => {
    await iip15Manager.registerContract(register.address, receiver.address)
    const info = await iip15Manager.getContract(register.address)
    expect(info.recipient).equal(receiver.address)
    expect(info.isApproved).equal(false)
  })

  it('approveContract', async () => {
    await iip15Manager.registerContract(register.address, receiver.address)
    await iip15Manager.approveContract(register.address)
    const info = await iip15Manager.getContract(register.address)
    expect(info.isApproved).equal(true)
  })

  it('disapproveContract', async () => {
    await iip15Manager.registerContract(register.address, receiver.address)
    await iip15Manager.approveContract(register.address)
    await iip15Manager.disapproveContract(register.address)
    const info = await iip15Manager.getContract(register.address)
    expect(info.isApproved).equal(false)
  })

  it('removeContract', async () => {
    await iip15Manager.registerContract(register.address, receiver.address)
    await iip15Manager.removeContract(register.address)
    const info = await iip15Manager.getContract(register.address)
    expect(info.recipient).equal(ethers.constants.AddressZero)
    expect(info.isApproved).equal(false)
  })


})