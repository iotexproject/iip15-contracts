import fs from "fs-extra"
import { ethers, run } from "hardhat"
async function load(name: string) {
    try {
      const data = await fs.readFileSync(`${process.cwd()}/deployed/${ethers.provider.network.chainId}.${name}.json`)
      return JSON.parse(data.toString())
    } catch (e) {
      return null
    }
  }
  
  async function save(name: string, content: any) {
      const sharedAddressPath = `${process.cwd()}/deployed/${ethers.provider.network.chainId}.${name}.json`
      await fs.writeFile(sharedAddressPath, JSON.stringify(content, null, 2))
  }

  const verify = async (contractAddress: string, args: any[]) => {
    console.log("Verifying contract...")
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        })
    } catch (e: any) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("Already verified!")
        } else {
            console.log(e)
        }
    }
}  
  export { load, save,verify }


