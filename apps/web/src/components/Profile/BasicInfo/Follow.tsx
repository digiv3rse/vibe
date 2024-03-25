import useHandleWrongNetwork from '@hooks/useHandleWrongNetwork'
import useProfileStore from '@lib/store/idb/profile'
import useNonceStore from '@lib/store/nonce'
import { DIGIHUB_PROXY_ABI } from '@vibe/abis'
import {
  DIGIHUB_PROXY_ADDRESS,
  ERROR_MESSAGE,
  REQUESTING_SIGNATURE_MESSAGE,
  SIGN_IN_REQUIRED
} from '@vibe/constants'
import type { FollowDiGiManagerRequest, Profile } from '@vibe/digi'
import {
  useBroadcastOnchainMutation,
  useCreateFollowTypedDataMutation,
  useFollowMutation
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
  onSubscribe: () => void
}

const Follow: FC<Props> = ({ profile, onSubscribe }) => {
  const [loading, setLoading] = useState(false)
  const { activeProfile } = useProfileStore()
  const { canUseDiGiManager, canBroadcast } =
    checkDiGiManagerPermissions(activeProfile)
  const handleWrongNetwork = useHandleWrongNetwork()

  const { digiHubOnchainSigNonce, setDiGiHubOnchainSigNonce } = useNonceStore()

  const onError = (error: CustomErrorWithData) => {
    toast.error(error?.data?.message ?? error?.message ?? ERROR_MESSAGE)
    setLoading(false)
  }

  const onCompleted = (__typename?: 'RelayError' | 'RelaySuccess') => {
    if (__typename === 'RelayError') {
      return
    }
    onSubscribe()
    setLoading(false)
    toast.success(`Followed ${getProfile(profile)?.displayName}`)
    Tower.track(EVENTS.PROFILE.FOLLOW, {
      profile_id: profile.id,
      profile_name: getProfile(profile)?.slug
    })
  }

  const { signTypedDataAsync } = useSignTypedData({
    mutation: { onError }
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
      functionName: 'follow',
      args
    })
  }

  const [broadcast] = useBroadcastOnchainMutation({
    onCompleted: ({ broadcastOnchain }) =>
      onCompleted(broadcastOnchain.__typename),
    onError
  })

  const [createFollowTypedData] = useCreateFollowTypedDataMutation({
    onCompleted: async ({ createFollowTypedData }) => {
      const { typedData, id } = createFollowTypedData
      const {
        followerProfileId,
        idsOfProfilesToFollow,
        followTokenIds,
        datas
      } = typedData.value
      const args = [
        followerProfileId,
        idsOfProfilesToFollow,
        followTokenIds,
        datas
      ]
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

  const [followMutation] = useFollowMutation({
    onCompleted: () => onCompleted(),
    onError
  })

  const followViaDiGiManager = async (request: FollowDiGiManagerRequest) => {
    const { data } = await followMutation({ variables: { request } })

    if (data?.follow.__typename === 'DiGiProfileManagerRelayError') {
      return await createFollowTypedData({
        variables: {
          options: { overrideSigNonce: digiHubOnchainSigNonce },
          request
        }
      })
    }
  }

  const follow = async () => {
    if (!activeProfile?.id) {
      return toast.error(SIGN_IN_REQUIRED)
    }
    await handleWrongNetwork()

    setLoading(true)
    const request = {
      follow: [
        {
          profileId: profile.id
        }
      ]
    }

    if (canUseDiGiManager) {
      return await followViaDiGiManager(request)
    }

    return await createFollowTypedData({
      variables: {
        options: { overrideSigNonce: digiHubOnchainSigNonce },
        request
      }
    })
  }

  return (
    <Button disabled={loading} loading={loading} onClick={() => follow()}>
      Follow
    </Button>
  )
}

export default Follow
