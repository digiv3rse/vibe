import type { MetadataAttribute } from '@digiv3rse/metadata'
import { link, MetadataAttributeType } from '@digiv3rse/metadata'
import { zodResolver } from '@hookform/resolvers/zod'
import useHandleWrongNetwork from '@hooks/useHandleWrongNetwork'
import useProfileStore from '@lib/store/idb/profile'
import useNonceStore from '@lib/store/nonce'
import { DIGIHUB_PROXY_ABI } from '@vibe/abis'
import { getUserLocale } from '@vibe/browser'
import {
  COMMON_REGEX,
  DIGIHUB_PROXY_ADDRESS,
  ERROR_MESSAGE,
  FALLBACK_COVER_URL,
  OG_IMAGE,
  REQUESTING_SIGNATURE_MESSAGE,
  SIGN_IN_REQUIRED,
  VIBE_APP_ID,
  VIBE_WEBSITE_URL
} from '@vibe/constants'
import type {
  CreateMomokaPostEip712TypedData,
  CreateOnchainPostEip712TypedData
} from '@vibe/digi'
import {
  useBroadcastOnMomokaMutation,
  useCreateMomokaPostTypedDataMutation,
  usePostOnMomokaMutation
} from '@vibe/digi'
import type { CustomErrorWithData } from '@vibe/digi/custom-types'
import {
  checkDiGiManagerPermissions,
  EVENTS,
  getProfile,
  getSignature,
  imageCdn,
  Tower,
  trimify,
  uploadToAr
} from '@vibe/generic'
import { Button, Input, Modal } from '@vibe/ui'
import Link from 'next/link'
import type { FC } from 'react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { v4 as uuidv4 } from 'uuid'
import { useSignTypedData, useWriteContract } from 'wagmi'
import type { z } from 'zod'
import { object, string } from 'zod'

const VALID_URL_REGEX = new RegExp(
  `${COMMON_REGEX.YOUTUBE_WATCH.source}|${COMMON_REGEX.VIBE_WATCH.source}|${COMMON_REGEX.VIMEO_WATCH.source}`
)

const formSchema = object({
  link: string()
    .url({ message: 'Invalid URL' })
    .regex(VALID_URL_REGEX, { message: 'Unsupported URL' })
})
type FormData = z.infer<typeof formSchema>

type Props = {
  refetch: () => void
}

const New: FC<Props> = ({ refetch }) => {
  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(formSchema)
  })
  const [loading, setLoading] = useState(false)
  const [showNewUploadModal, setShowNewUploadModal] = useState(false)
  const activeProfile = useProfileStore((state) => state.activeProfile)
  const handleWrongNetwork = useHandleWrongNetwork()
  const { canUseDiGiManager, canBroadcast } =
    checkDiGiManagerPermissions(activeProfile)
  const digiHubOnchainSigNonce = useNonceStore(
    (state) => state.digiHubOnchainSigNonce
  )
  const setDiGiHubOnchainSigNonce = useNonceStore(
    (state) => state.setDiGiHubOnchainSigNonce
  )

  const onError = (error: CustomErrorWithData) => {
    toast.error(error?.data?.message ?? error?.message ?? ERROR_MESSAGE)
    setLoading(false)
  }

  const onCompleted = (
    __typename?: 'RelayError' | 'RelaySuccess' | 'CreateMomokaPublicationResult'
  ) => {
    if (__typename === 'RelayError') {
      return
    }
    setLoading(false)
    reset()
    refetch()
    toast.success('Posted successfully!')
    Tower.track(EVENTS.PUBLICATION.NEW_POST, {
      type: 'banger',
      publication_state: canUseDiGiManager ? 'MOMOKA' : 'ON_CHAIN',
      user_id: activeProfile?.id
    })
    if (!canUseDiGiManager) {
      location.reload()
    }
  }

  const { signTypedDataAsync } = useSignTypedData({
    mutation: { onError }
  })

  const getSignatureFromTypedData = async (
    data: CreateMomokaPostEip712TypedData | CreateOnchainPostEip712TypedData
  ) => {
    toast.loading(REQUESTING_SIGNATURE_MESSAGE)
    const signature = await signTypedDataAsync(getSignature(data))
    return signature
  }

  const { writeContractAsync } = useWriteContract({
    mutation: {
      onSuccess: () => {
        setLoading(false)
        setDiGiHubOnchainSigNonce(digiHubOnchainSigNonce + 1)
        onCompleted()
      },
      onError: (error) => {
        onError(error)
        setDiGiHubOnchainSigNonce(digiHubOnchainSigNonce - 1)
      }
    }
  })

  const [broadcastOnMomoka] = useBroadcastOnMomokaMutation({
    onCompleted: ({ broadcastOnMomoka }) => {
      if (broadcastOnMomoka.__typename === 'CreateMomokaPublicationResult') {
        onCompleted(broadcastOnMomoka.__typename)
      }
    }
  })

  const write = async ({ args }: { args: any[] }) => {
    return await writeContractAsync({
      address: DIGIHUB_PROXY_ADDRESS,
      abi: DIGIHUB_PROXY_ABI,
      functionName: 'post',
      args
    })
  }

  const [createMomokaPostTypedData] = useCreateMomokaPostTypedDataMutation({
    onCompleted: async ({ createMomokaPostTypedData }) => {
      const { typedData, id } = createMomokaPostTypedData
      try {
        if (canBroadcast) {
          const signature = await getSignatureFromTypedData(typedData)
          const { data } = await broadcastOnMomoka({
            variables: { request: { id, signature } }
          })
          if (data?.broadcastOnMomoka?.__typename === 'RelayError') {
            return await write({ args: [typedData.value] })
          }
          return
        }
        return await write({ args: [typedData.value] })
      } catch {}
    },
    onError
  })

  const [postOnMomoka] = usePostOnMomokaMutation({
    onError,
    onCompleted: ({ postOnMomoka }) => {
      if (postOnMomoka.__typename === 'CreateMomokaPublicationResult') {
        onCompleted(postOnMomoka.__typename)
      }
    }
  })

  const onSubmit = async () => {
    if (!activeProfile) {
      return toast.error(SIGN_IN_REQUIRED)
    }
    await handleWrongNetwork()

    setLoading(true)
    const linkText = trimify(getValues('link'))
    const attributes: MetadataAttribute[] = [
      {
        type: MetadataAttributeType.STRING,
        key: 'publication',
        value: 'banger'
      }
    ]
    const linkMetadata = link({
      sharingLink: linkText,
      appId: VIBE_APP_ID,
      id: uuidv4(),
      content: `Only Bangers by Vibe 📼 \n${VIBE_WEBSITE_URL}/bangers`,
      locale: getUserLocale(),
      tags: ['banger'],
      marketplace: {
        name: `Banger by @${getProfile(activeProfile)?.slug}`,
        attributes,
        description: linkText,
        image: OG_IMAGE,
        external_url: `${VIBE_WEBSITE_URL}/bangers`
      },
      attributes
    })
    const metadataUri = await uploadToAr(linkMetadata)

    if (canUseDiGiManager) {
      return await postOnMomoka({
        variables: {
          request: {
            contentURI: metadataUri
          }
        }
      })
    }

    return await createMomokaPostTypedData({
      variables: {
        request: {
          contentURI: metadataUri
        }
      }
    })
  }

  return (
    <div
      style={{
        backgroundImage: `url("${imageCdn(FALLBACK_COVER_URL)}")`
      }}
      className="relative h-44 w-full bg-gray-300 bg-cover bg-center bg-no-repeat md:h-[30vh] dark:bg-gray-700"
    >
      <fieldset
        disabled={loading}
        className="container mx-auto flex h-full max-w-screen-sm flex-col items-center justify-center space-y-4 px-4 md:px-0"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <div className="flex items-center space-x-2">
            <Input
              title="Vibe/YouTube/Vimeo links supported"
              placeholder="Paste a link to a banger"
              autoComplete="off"
              className="bg-white dark:bg-black"
              error={errors.link?.message}
              showError={false}
              {...register('link')}
            />
            <Button disabled={loading} loading={loading}>
              Post
            </Button>
          </div>
        </form>
        <span>or</span>
        <Button onClick={() => setShowNewUploadModal(true)}>Upload</Button>
        <Modal
          size="sm"
          show={showNewUploadModal}
          setShow={setShowNewUploadModal}
          title="Upload to Vibe"
        >
          <div>
            <p>
              You can upload a video to Vibe and then post a link to it here.
            </p>
            <div className="mt-4 flex justify-end">
              <Link href="/create">
                <Button>Continue to Upload</Button>
              </Link>
            </div>
          </div>
        </Modal>
      </fieldset>
    </div>
  )
}

export default New
