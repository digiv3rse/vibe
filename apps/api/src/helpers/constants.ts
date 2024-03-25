export const DIGI_API_URL =
  'https://api.thegraph.com/subgraphs/name/digi-gallery/digiv3rse-protocol/'
export const PUBLIC_ETHEREUM_NODE = 'https://ethereum-rpc.publicnode.com'
export const IRYS_NODE_URL = 'https://arweave.mainnet.irys.xyz/tx/matic'

export const ERROR_MESSAGE = 'Something went wrong'

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
export const VIBE_SIGNUP_PROXY_ADDRESS = '0x7e079b1828BaDaD615436F5E59100Af065A71A70'
export const VIBE_SIGNUP_PROXY_ABI = [
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'address', name: 'followModule', type: 'address' },
          { internalType: 'bytes', name: 'followModuleInitData', type: 'bytes' }
        ],
        internalType: 'struct CreateProfileParams',
        name: 'createProfileParams',
        type: 'tuple'
      },
      { internalType: 'string', name: 'handle', type: 'string' },
      {
        internalType: 'address[]',
        name: 'delegatedExecutors',
        type: 'address[]'
      }
    ],
    name: 'createProfileWithHandle',
    outputs: [
      { internalType: 'uint256', name: 'profileId', type: 'uint256' },
      { internalType: 'uint256', name: 'handleId', type: 'uint256' }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  }
]
