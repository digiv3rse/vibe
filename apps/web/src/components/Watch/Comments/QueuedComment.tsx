import Badge from '@components/Common/Badge'
import InterweaveContent from '@components/Common/InterweaveContent'
import useProfileStore from '@lib/store/idb/profile'
import usePersistStore from '@lib/store/persist'
import {
  DiGiTransactionStatusType,
  PublicationDocument,
  useDiGiTransactionStatusQuery,
  usePublicationLazyQuery,
  useTxIdToTxHashLazyQuery
} from '@vibe/digi'
import { useApolloClient } from '@vibe/digi/apollo'
import type { QueuedCommentType } from '@vibe/digi/custom-types'
import { getProfile, getProfilePicture } from '@vibe/generic'
import { Tooltip } from '@vibe/ui'
import Link from 'next/link'
import type { FC } from 'react'
import React from 'react'

type Props = {
  queuedComment: QueuedCommentType
}

const QueuedComment: FC<Props> = ({ queuedComment }) => {
  const { activeProfile } = useProfileStore()
  const { queuedComments, setQueuedComments } = usePersistStore()

  const { cache } = useApolloClient()
  const [getTxnHash] = useTxIdToTxHashLazyQuery()

  const removeFromQueue = () => {
    if (!queuedComment.txnId) {
      return setQueuedComments(
        queuedComments.filter((q) => q.txnHash !== queuedComment.txnHash)
      )
    }
    setQueuedComments(
      queuedComments.filter((q) => q.txnId !== queuedComment.txnId)
    )
  }

  const [getPublication] = usePublicationLazyQuery({
    onCompleted: (data) => {
      if (data.publication) {
        cache.modify({
          fields: {
            publications() {
              cache.writeQuery({
                data: { publication: data?.publication },
                query: PublicationDocument
              })
            }
          }
        })
        removeFromQueue()
      }
    }
  })

  const getCommentByTxnId = async () => {
    const { data } = await getTxnHash({
      variables: {
        for: queuedComment?.txnId
      }
    })
    if (data?.txIdToTxHash) {
      getPublication({
        variables: { request: { forTxHash: data?.txIdToTxHash } }
      })
    }
  }

  const { stopPolling } = useDiGiTransactionStatusQuery({
    variables: {
      request: {
        forTxId: queuedComment?.txnId,
        forTxHash: queuedComment?.txnHash
      }
    },
    skip: !queuedComment?.txnId?.length && !queuedComment?.txnHash?.length,
    pollInterval: 1000,
    notifyOnNetworkStatusChange: true,
    onCompleted: async (data) => {
      if (
        data?.digiTransactionStatus?.__typename === 'DiGiTransactionResult' &&
        data?.digiTransactionStatus?.reason
      ) {
        return removeFromQueue()
      }
      if (
        data?.digiTransactionStatus?.__typename === 'DiGiTransactionResult' &&
        data?.digiTransactionStatus?.status ===
          DiGiTransactionStatusType.Complete
      ) {
        stopPolling()
        if (queuedComment.txnHash) {
          return getPublication({
            variables: {
              request: { forTxHash: queuedComment.txnHash }
            }
          })
        }
        await getCommentByTxnId()
      }
    }
  })

  if ((!queuedComment?.txnId && !queuedComment?.txnHash) || !activeProfile) {
    return null
  }

  return (
    <div className="flex items-start justify-between">
      <div className="flex items-start justify-between">
        <Link
          href={getProfile(activeProfile)?.link}
          className="mr-3 mt-0.5 flex-none"
        >
          <img
            src={getProfilePicture(activeProfile, 'AVATAR')}
            className="size-7 rounded-full"
            draggable={false}
            alt={getProfile(activeProfile)?.slug}
          />
        </Link>
        <div className="mr-2 flex flex-col items-start">
          <span className="mb-1 flex items-center space-x-1">
            <Link
              href={getProfile(activeProfile)?.link}
              className="flex items-center space-x-1 text-sm font-medium"
            >
              <span>{getProfile(activeProfile)?.slug}</span>
              <Badge id={activeProfile.id} />
            </Link>
          </span>
          <InterweaveContent content={queuedComment.comment} />
        </div>
      </div>
      <div>
        <div className="p-2">
          <Tooltip content="Indexing" placement="top">
            <span className="relative flex size-2 items-center justify-center">
              <span className="bg-brand-400 absolute inline-flex size-2 animate-ping rounded-full opacity-75" />
              <span className="bg-brand-500 relative inline-flex size-1.5 rounded-full" />
            </span>
          </Tooltip>
        </div>
      </div>
    </div>
  )
}

export default QueuedComment
