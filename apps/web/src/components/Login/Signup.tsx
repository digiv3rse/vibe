import { zodResolver } from '@hookform/resolvers/zod'
import useHandleWrongNetwork from '@hooks/useHandleWrongNetwork'
import usePendingTxn from '@hooks/usePendingTxn'
import { VIBE_SIGNUP_PROXY_ABI } from '@vibe/abis'
import { useDebounce } from '@vibe/browser'
import {
  COMMON_REGEX,
  DIGI_NAMESPACE_PREFIX,
  ERROR_MESSAGE,
  IS_MAINNET,
  MOONPAY_URL,
  VIBE_SIGNUP_PROXY_ADDRESS,
  ZERO_ADDRESS
} from '@vibe/constants'
import {
  useGenerateDiGiApiRelayAddressQuery,
  useHandleToAddressLazyQuery,
  useProfileLazyQuery
} from '@vibe/digi'
import type { CustomErrorWithData } from '@vibe/digi/custom-types'
import { EVENTS, Tower } from '@vibe/generic'
import {
  Button,
  CheckOutline,
  InfoOutline,
  Input,
  Modal,
  Spinner,
  TimesOutline,
  Tooltip
} from '@vibe/ui'
import Link from 'next/link'
import Script from 'next/script'
import type { FC } from 'react'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { formatUnits } from 'viem'
import {
  useAccount,
  useBalance,
  useReadContract,
  useWriteContract
} from 'wagmi'
import type { z } from 'zod'
import { object, string } from 'zod'

declare global {
  interface Window {
    createLemonSqueezy: any
    LemonSqueezy: {
      Setup: ({ eventHandler }: { eventHandler: any }) => void
      Url: {
        Close: () => void
        Open: (checkoutUrl: string) => void
      }
    }
    chatwootSettings: any
    $chatwoot: any
    chatwootSDK: any
  }
}

type Props = {
  showLogin: boolean
  onSuccess: () => void
  setShowSignup: (b: boolean) => void
}

const formSchema = object({
  handle: string()
    .min(5, { message: 'Handle should be at least 5 characters' })
    .max(26, { message: 'Handle should not exceed 26 characters' })
    .regex(COMMON_REGEX.HANDLE, {
      message:
        'Handle must start with a letter/number, only _ allowed in between'
    })
})
type FormData = z.infer<typeof formSchema>

const Signup: FC<Props> = ({ showLogin, onSuccess, setShowSignup }) => {
  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
    reset,
    watch
  } = useForm<FormData>({
    resolver: zodResolver(formSchema)
  })

  const [showModal, setShowModal] = useState(false)
  const [creating, setCreating] = useState(false)
  const [isHandleAvailable, setIsHandleAvailable] = useState(false)
  const handleWrongNetwork = useHandleWrongNetwork()

  const { address } = useAccount()
  const handle = watch('handle')?.toLowerCase()

  const debouncedValue = useDebounce<string>(handle, 300)
  const { data: balanceData } = useBalance({
    address,
    query: { refetchInterval: 2000 }
  })

  const { data: signupPrice } = useReadContract({
    abi: VIBE_SIGNUP_PROXY_ABI,
    address: VIBE_SIGNUP_PROXY_ADDRESS,
    functionName: 'signupPrice',
    query: { refetchInterval: 1000 }
  })

  const signupPriceFormatted = formatUnits((signupPrice ?? 0) as bigint, 18)

  const onMinted = (via: string) => {
    onSuccess()
    reset()
    toast.success('Profile created')
    setCreating(false)
    Tower.track(EVENTS.AUTH.SIGNUP_SUCCESS, {
      price: signupPriceFormatted,
      via
    })
  }

  const { data } = useGenerateDiGiApiRelayAddressQuery({
    fetchPolicy: 'no-cache'
  })
  const delegatedExecutor = data?.generateDiGiAPIRelayAddress

  const [checkAvailability, { loading: checkingAvailability }] =
    useHandleToAddressLazyQuery({
      fetchPolicy: 'no-cache'
    })
  const [checkIsProfileMinted] = useProfileLazyQuery({
    notifyOnNetworkStatusChange: true,
    pollInterval: 3000,
    variables: {
      request: { forHandle: `${DIGI_NAMESPACE_PREFIX}${handle}` }
    },
    onCompleted: (data) => {
      if (data.profile) {
        onMinted('card')
      }
    }
  })

  const onError = (error: CustomErrorWithData) => {
    setCreating(false)
    toast.error(error?.message ?? ERROR_MESSAGE)
  }

  const { writeContractAsync, data: txnHash } = useWriteContract({
    mutation: {
      onError
    }
  })

  const onSearchDebounce = async () => {
    if (handle?.trim().length) {
      const { data } = await checkAvailability({
        variables: {
          request: {
            handle: `${DIGI_NAMESPACE_PREFIX}${handle}`
          }
        }
      })
      Tower.track(EVENTS.AUTH.SIGNUP_HANDLE_SEARCH, {
        handle: `${DIGI_NAMESPACE_PREFIX}${handle}`
      })
      if (data?.handleToAddress) {
        return setIsHandleAvailable(false)
      }
      setIsHandleAvailable(true)
    }
  }

  const { indexed, error } = usePendingTxn({
    ...(txnHash && {
      txHash: txnHash
    })
  })

  useEffect(() => {
    if (indexed) {
      onMinted('wallet')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indexed, error])

  useEffect(() => {
    onSearchDebounce()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue])

  useEffect(() => {
    window.$chatwoot?.toggleBubbleVisibility('show')
    return () => {
      window.$chatwoot?.toggle('close')
      window.$chatwoot?.toggleBubbleVisibility('hide')
    }
  }, [])

  const eventHandler = async ({ event }: { data: any; event: any }) => {
    if (event === 'Checkout.Success' && window.LemonSqueezy) {
      window.LemonSqueezy?.Url?.Close()
      setCreating(true)
      await checkIsProfileMinted()
    }
  }

  const handleBuy = () => {
    window.createLemonSqueezy?.()
    window.LemonSqueezy?.Setup?.({ eventHandler })
    const id = IS_MAINNET
      ? '45a0b30c-7c01-4431-b9a0-2160a152f26f'
      : 'd9dba154-17d4-40df-a786-6f90c3dc0ca7'
    window.LemonSqueezy?.Url?.Open?.(
      `https://tape.lemonsqueezy.com/checkout/buy/${id}?checkout[custom][address]=${address}&checkout[custom][delegatedExecutor]=${delegatedExecutor}&checkout[custom][handle]=${handle}&embed=1&media=0`
    )
  }

  const signup = async (
    { handle }: FormData,
    e: React.FormEvent<HTMLFormElement>
  ) => {
    if (!isHandleAvailable) {
      return toast.error('Handle is taken')
    }

    const clickedButton = (e.nativeEvent as any).submitter.name
    if (clickedButton === 'card') {
      return handleBuy()
    }
    setCreating(true)
    await handleWrongNetwork()

    try {
      if (!delegatedExecutor) {
        setCreating(false)
        return toast.error(ERROR_MESSAGE)
      }
      return await writeContractAsync({
        abi: VIBE_SIGNUP_PROXY_ABI,
        address: VIBE_SIGNUP_PROXY_ADDRESS,
        args: [[address, ZERO_ADDRESS, '0x'], handle, [delegatedExecutor]],
        functionName: 'createProfileWithHandleUsingCredits',
        value: signupPrice as bigint
      })
    } catch {
      setCreating(false)
    }
  }

  const balance = balanceData && parseFloat(formatUnits(balanceData.value, 18))
  const hasBalance = balance && balance >= Number(signupPriceFormatted)

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        handleSubmit((data) => signup(data, e))()
      }}
      className="space-y-2"
    >
      <Script
        id="lemon-js"
        src="https://assets.lemonsqueezy.com/lemon.js"
        strategy="afterInteractive"
      />
      {IS_MAINNET && (
        <Script
          id="chatwoot-js"
          src="https://woot.digiv3rse.xyz/packs/js/sdk.js"
          strategy="afterInteractive"
          defer={true}
          async={true}
          onLoad={() => {
            window.chatwootSettings = {
              type: 'expanded_bubble',
              launcherTitle: 'Support',
              position: 'left'
            }
            window.chatwootSDK.run({
              websiteToken: '47H9cq5gNEAf3q6sUK97vDbG',
              baseUrl: 'https://woot.digiv3rse.xyz'
            })
          }}
        />
      )}
      <div className="relative flex items-center">
        <Input
          className="h-[46px] text-base"
          placeholder="handle"
          autoComplete="off"
          prefix={`@${DIGI_NAMESPACE_PREFIX}`}
          error={errors.handle?.message}
          autoFocus
          {...register('handle')}
        />
        {isValid && (
          <div className="flex items-center">
            {checkingAvailability ? (
              <span className="absolute right-3 text-white">
                <Spinner size="sm" />
              </span>
            ) : (
              <Tooltip
                content={
                  isHandleAvailable
                    ? `@${DIGI_NAMESPACE_PREFIX}${handle} is available`
                    : `@${DIGI_NAMESPACE_PREFIX}${handle} is taken`
                }
                placement="top"
              >
                {isHandleAvailable ? (
                  <span className="absolute right-3 rounded-full bg-green-500 p-1 text-white">
                    <CheckOutline className="size-2" />
                  </span>
                ) : (
                  <span className="absolute right-3 rounded-full bg-red-500 p-1 text-white">
                    <TimesOutline className="size-2" outlined={false} />
                  </span>
                )}
              </Tooltip>
            )}
          </div>
        )}
      </div>

      <Modal
        size="sm"
        show={showModal}
        setShow={setShowModal}
        title="Why do I need to pay?"
        description="Vibe profiles, powered by DiGi Protocol, a one-time signup for all ecosystem apps. Users must make a purchase to enhance network stability and deter bots, with the temporary cost gradually phased out as additional bot prevention measures are implemented and refined."
      >
        {!hasBalance && (
          <div className="mt-4">
            <Link
              href={`${MOONPAY_URL}?baseCurrencyAmount=50&currencyCode=MATIC&walletAddress=${address}`}
              target="_blank"
            >
              <Button variant="secondary">Buy MATIC</Button>
            </Link>
          </div>
        )}
      </Modal>

      {IS_MAINNET && (
        <div className="relative flex items-center">
          <div className="w-full">
            <Button
              name="card"
              size="md"
              loading={creating}
              disabled={creating || !isHandleAvailable || checkingAvailability}
            >
              Buy with Card
            </Button>
          </div>
          <button
            type="button"
            className="absolute right-2.5 z-[1] cursor-help p-1 text-xs"
            onClick={() => setShowModal(true)}
          >
            <InfoOutline className="size-4 text-white dark:text-black" />
          </button>
        </div>
      )}

      <Button
        name="wallet"
        size="md"
        variant="secondary"
        loading={creating}
        disabled={creating || !isHandleAvailable || checkingAvailability}
      >
        Mint for {signupPriceFormatted} MATIC
      </Button>
      {showLogin && (
        <div className="flex items-center justify-center space-x-2 pt-3 text-sm">
          <span>Have an account?</span>
          <button
            type="button"
            className="text-brand-500 font-bold"
            onClick={() => setShowSignup(false)}
          >
            Login
          </button>
        </div>
      )}
    </form>
  )
}

export default Signup
