import useHandleWrongNetwork from '@hooks/useHandleWrongNetwork'
import usePendingTxn from '@hooks/usePendingTxn'
import useProfileStore from '@lib/store/idb/profile'
import useNonceStore from '@lib/store/nonce'
import { DIGIHUB_PROXY_ABI } from '@vibe/abis'
import {
  DIGIHUB_PROXY_ADDRESS,
  ERROR_MESSAGE,
  REQUESTING_SIGNATURE_MESSAGE
} from '@vibe/constants'
import type { Profile } from '@vibe/digi'
import {
  useBroadcastOnchainMutation,
  useCreateChangeProfileManagersTypedDataMutation
} from '@vibe/digi'
import type { CustomErrorWithData } from '@vibe/digi/custom-types'
import {
  checkDiGiManagerPermissions,
  EVENTS,
  getSignature,
  Tower
} from '@vibe/generic'
import { Button } from '@vibe/ui'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useSignTypedData, useWriteContract } from 'wagmi'

const ToggleDiGiManager = () => {
  const [loading, setLoading] = useState(false)

  const { activeProfile, setActiveProfile } = useProfileStore()
  const { digiHubOnchainSigNonce, setDiGiHubOnchainSigNonce } = useNonceStore()
  const handleWrongNetwork = useHandleWrongNetwork()
  const { canBroadcast } = checkDiGiManagerPermissions(activeProfile)

  const isDiGiManagerEnabled = activeProfile?.signless || false

  const onError = (error: CustomErrorWithData) => {
    toast.error(error?.message ?? ERROR_MESSAGE)
    setLoading(false)
  }

  const { signTypedDataAsync } = useSignTypedData({
    mutation: { onError }
  })

  const { writeContractAsync, data: txHash } = useWriteContract({
    mutation: {
      onSuccess: () => {
        setDiGiHubOnchainSigNonce(digiHubOnchainSigNonce + 1)
      },
      onError: (error) => {
        onError(error)
        setDiGiHubOnchainSigNonce(digiHubOnchainSigNonce - 1)
      }
    }
  })

  const write = async ({ args }: { args: any[] }) => {
    return await writeContractAsync({
      address: DIGIHUB_PROXY_ADDRESS,
      abi: DIGIHUB_PROXY_ABI,
      functionName: 'changeDelegatedExecutorsConfig',
      args
    })
  }

  const [broadcast, { data: broadcastData }] = useBroadcastOnchainMutation({
    onError
  })

  const { indexed } = usePendingTxn({
    txHash,
    ...(broadcastData?.broadcastOnchain.__typename === 'RelaySuccess' && {
      txId: broadcastData?.broadcastOnchain?.txId
    })
  })

  useEffect(() => {
    if (indexed) {
      toast.success(
        `DiGi Manager ${isDiGiManagerEnabled ? `disabled` : `enabled`}`
      )
      const channel = { ...activeProfile }
      channel.signless = isDiGiManagerEnabled ? false : true
      setActiveProfile(channel as Profile)
      setLoading(false)
      Tower.track(EVENTS.MANAGER.TOGGLE, { enabled: channel.signless })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indexed])

  const [toggleDiGiManager] = useCreateChangeProfileManagersTypedDataMutation({
    onCompleted: async ({ createChangeProfileManagersTypedData }) => {
      const { id, typedData } = createChangeProfileManagersTypedData
      const {
        delegatorProfileId,
        delegatedExecutors,
        approvals,
        configNumber,
        switchToGivenConfig
      } = typedData.value
      const args = [
        delegatorProfileId,
        delegatedExecutors,
        approvals,
        configNumber,
        switchToGivenConfig
      ]
      try {
        toast.loading(REQUESTING_SIGNATURE_MESSAGE)
        if (canBroadcast) {
          const signature = await signTypedDataAsync(getSignature(typedData))
          const { data } = await broadcast({
            variables: { request: { id, signature } }
          })
          if (data?.broadcastOnchain?.__typename === 'RelayError') {
            return await write({ args })
          }
          return
        }
        return await write({ args })
      } catch {
        setLoading(false)
      }
    },
    onError
  })

  const onClick = async () => {
    await handleWrongNetwork()

    setLoading(true)
    return toggleDiGiManager({
      variables: {
        options: { overrideSigNonce: digiHubOnchainSigNonce },
        request: {
          approveSignless: !isDiGiManagerEnabled
        }
      }
    })
  }

  const getButtonText = () => {
    if (isDiGiManagerEnabled) {
      return `Disable`
    } else {
      return `Enable`
    }
  }

  return (
    <Button
      onClick={onClick}
      disabled={loading}
      loading={loading}
      variant={isDiGiManagerEnabled ? 'danger' : 'primary'}
    >
      {getButtonText()}
    </Button>
  )
}

export default ToggleDiGiManager
