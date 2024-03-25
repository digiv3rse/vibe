import { SEPOLIA_CHAIN_ID } from '@vibe/constants'
import { EVENTS, Tower } from '@vibe/generic'
import { useConnections, useSwitchChain } from 'wagmi'

const useHandleWrongNetwork = () => {
  const activeConnection = useConnections()
  const { switchChainAsync } = useSwitchChain()

  const handleWrongNetwork = async () => {
    const activeChainId = activeConnection?.[0]?.chainId
    if (activeChainId !== SEPOLIA_CHAIN_ID) {
      Tower.track(EVENTS.AUTH.SWITCH_NETWORK, {
        fromChainId: activeChainId
      })
      return await switchChainAsync({ chainId: SEPOLIA_CHAIN_ID })
    }

    return
  }

  return handleWrongNetwork
}

export default useHandleWrongNetwork
