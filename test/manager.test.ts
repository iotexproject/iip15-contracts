import { ethers } from 'hardhat'
import { deployContract, MockProvider, solidity } from "ethereum-waffle";
import { expect, use } from 'chai'
import { IIP15Manager, IIP15Manager__factory } from '../typechain'
use(solidity)
describe('IIP15Manager', () => {
  let iip15Manager: IIP15Manager
  const [wallet, register, receiver] = new MockProvider().getWallets();

  beforeEach(async () => {
    // const iip15ManagerFactory = await ethers.getContractFactory('IIP15Manager')
    // iip15Manager = (await iip15ManagerFactory.deploy()) as IIP15Manager;
    // await iip15Manager.deployed();
    iip15Manager = await deployContract(wallet, IIP15Manager__factory)
    await iip15Manager.deployed()
  })

  it('registerContract', async () => {
    await iip15Manager.registerContract(register.address, receiver.address)
    expect((await iip15Manager.getContract(register.address)).recipient).equal(receiver.address)
  })

})