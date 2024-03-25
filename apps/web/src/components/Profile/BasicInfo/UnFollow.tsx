import useHandleWrongNetwork from '@hooks/useHandleWrongNetwork'
import useProfileStore from '@lib/store/idb/profile'
import useNonceStore from '@lib/store/nonce'
import { DIGIHUB_PROXY_ABI } from '@vibe/abis'
import {
  DIGIHUB_PROXY_ADDRESS,
  REQUESTING_SIGNATURE_MESSAGE,
  SIGN_IN_REQUIRED
} from '@vibe/constants'
import type { CreateUnfollowBroadcastItemResult, Profile } from '@vibe/digi'
import {
  useBroadcastOnchainMutation,
  useCreateUnfollowTypedDataMutation,
  useUnfollowMutation
} from '@vibe/digi'
import type { CustomErrorWithData } from '@vibe/digi/custom-types'
import {
  checkDiGiManagerPermissions,
  EVENTS,
  getProfile,
  getSignature,
  Tower
} from '@vibe/generic'
import { Button } from '@vibe/ui'
import type { FC } from 'react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useSignTypedData, useWriteContract } from 'wagmi'

type Props = {
  profile: Profile
  onUnSubscribe: () => void
}

const UnFollow: FC<Props> = ({ profile, onUnSubscribe }) => {
  const [loading, setLoading] = useState(false)

  const { activeProfile } = useProfileStore()
  const { digiHubOnchainSigNonce, setDiGiHubOnchainSigNonce } = useNonceStore()
  const { canUseDiGiManager, canBroadcast } =
    checkDiGiManagerPermissions(activeProfile)

  const handleWrongNetwork = useHandleWrongNetwork()

  const onError = (error: CustomErrorWithData) => {
    toast.error(error?.data?.message ?? error?.message)
    setLoading(false)
  }
  const onCompleted = (__typename?: 'RelayError' | 'RelaySuccess') => {
    if (__typename === 'RelayError') {
      return
    }

    setLoading(false)
    onUnSubscribe()
    toast.success(`Unfollowed ${getProfile(profile)?.displayName}`)
    Tower.track(EVENTS.PROFILE.UNFOLLOW, {
      profile_id: profile.id,
      profile_name: getProfile(profile)?.slug
    })
  }

  const { signTypedDataAsync } = useSignTypedData({
    mutation: { onError }
  })

  const [broadcast] = useBroadcastOnchainMutation({
    onCompleted: ({ broadcastOnchain }) =>
      onCompleted(broadcastOnchain.__typename),
    onError
  })

  const { writeContractAsync } = useWriteContract({
    mutation: {
      onSuccess: () => onCompleted(),
      onError
    }
  })

  const write = async ({ args }: { args: any[] }) => {
    return await writeContractAsync({
      address: DIGIHUB_PROXY_ADDRESS,
      abi: DIGIHUB_PROXY_ABI,
      functionName: 'burn',
      args
    })
  }

  const [createUnfollowTypedData] = useCreateUnfollowTypedDataMutation({
    onCompleted: async ({ createUnfollowTypedData }) => {
      const { typedData, id } =
        createUnfollowTypedData as CreateUnfollowBroadcastItemResult
      const { idsOfProfilesToUnfollow, unfollowerProfileId } = typedData.value
      const args = [unfollowerProfileId, idsOfProfilesToUnfollow]
      try {
        toast.loading(REQUESTING_SIGNATURE_MESSAGE)
        if (canBroadcast) {
          const signature = await signTypedDataAsync(getSignature(typedData))
          setDiGiHubOnchainSigNonce(digiHubOnchainSigNonce + 1)
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

  const [unFollowMutation] = useUnfollowMutation({
    onCompleted: () => onCompleted(),
    onError
  })

  const unfollow = async () => {
    if (!activeProfile?.id) {
      return toast.error(SIGN_IN_REQUIRED)
    }
    await handleWrongNetwork()

    setLoading(true)
    if (canUseDiGiManager) {
      return await unFollowMutation({
        variables: {
          request: {
            unfollow: [profile.id]
          }
        }
      })
    }
    return createUnfollowTypedData({
      variables: {
        options: { overrideSigNonce: digiHubOnchainSigNonce },
        request: { unfollow: [profile?.id] }
      }
    })
  }

  return (
    <Button loading={loading} disabled={loading} onClick={() => unfollow()}>
      Unfollow
    </Button>
  )
}

export default UnFollow
