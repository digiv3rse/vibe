const hre = require('hardhat')

async function deployProxy() {
  // mainnet
  const owner = '0xd53B6196F526b2cf0a5F3a35a03B23B2D02b26c4'
  const permissionlessCreator = '0x9Cd4AC51FC2d931506c61C75C3Cad900b2D04D1d'

  // testnet
  // const owner = '0xa8535b8049948bE1bFeb1404daEabbD407792411'
  // const permissionlessCreator = '0xCb4FB63c3f13CB83cCD6F10E9e5F29eC250329Cc'

  const VibePermissionlessCreator = await hre.ethers.getContractFactory(
    'VibePermissionlessCreator'
  )
  const deployProxy = await hre.upgrades.deployProxy(
    VibePermissionlessCreator,
    [owner, permissionlessCreator]
  )
  await deployProxy.waitForDeployment()

  const proxyAddress = await deployProxy.getAddress()
  console.log(`VibePermissonlessCreator Proxy deployed to ${proxyAddress}`)

  const currentImplAddress =
    await hre.upgrades.erc1967.getImplementationAddress(proxyAddress)
  console.log(
    `VibePermissonlessCreator Implementation deployed to ${currentImplAddress}`
  )
}

// async function upgradeProxy() {
//   const PROXY_ADDRESS = '0x68357D5F02a3913132577c7aC0847feade9a05aC'

//   const VibePermissionlessCreatorV2 = await hre.ethers.getContractFactory(
//     'VibePermissonlessCreatorV2'
//   )
//   await hre.upgrades.upgradeProxy(PROXY_ADDRESS, VibePermissionlessCreatorV2)
//   console.log('Proxy upgraded')
// }

deployProxy().catch((error) => {
  console.error(error)
  process.exitCode = 1
})

// upgradeProxy().catch((error) => {
//   console.error(error)
//   process.exitCode = 1
// })
