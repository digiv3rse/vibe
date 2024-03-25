import { IS_MAINNET, SEPOLIA_RPC_URL } from '@vibe/constants'
import { createPublicClient, http } from 'viem'
import { mainnet, sepolia } from 'viem/chains'

export const viemPublicClient = createPublicClient({
  chain: IS_MAINNET ? mainnet : sepolia,
  transport: http(SEPOLIA_RPC_URL)
})
