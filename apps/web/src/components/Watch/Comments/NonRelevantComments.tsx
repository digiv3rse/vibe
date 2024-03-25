import CommentsShimmer from '@components/Shimmers/CommentsShimmer'
import {
  DIGI_CUSTOM_FILTERS,
  INFINITE_SCROLL_ROOT_MARGIN
} from '@vibe/constants'
import type {
  AnyPublication,
  Comment,
  MirrorablePublication,
  PublicationsRequest
} from '@vibe/digi'
import {
  CommentRankingFilterType,
  LimitType,
  usePublicationsQuery
} from '@vibe/digi'
import { ChevronDownOutline, ChevronUpOutline, Spinner } from '@vibe/ui'
import type { FC } from 'react'
import React, { useState } from 'react'
import { useInView } from 'react-cool-inview'

import RenderComment from './RenderComment'

type Props = {
  video: MirrorablePublication
  className?: string
}

const NonRelevantComments: FC<Props> = ({ video, className }) => {
  const [showSection, setShowSection] = useState(false)

  const request: PublicationsRequest = {
    limit: LimitType.Fifty,
    where: {
      customFilters: DIGI_CUSTOM_FILTERS,
      commentOn: {
        id: video.id,
        ranking: {
          filter: CommentRankingFilterType.NoneRelevant
        }
      }
    }
  }

  const { data, loading, fetchMore } = usePublicationsQuery({
    variables: { request }
  })

  const comments = data?.publications?.items as AnyPublication[]
  const pageInfo = data?.publications?.pageInfo

  const { observe } = useInView({
    rootMargin: INFINITE_SCROLL_ROOT_MARGIN,
    onEnter: async () => {
      await fetchMore({
        variables: {
          request: {
            ...request,
            cursor: pageInfo?.next
          }
        }
      })
    }
  })

  const onToggle = () => {
    setShowSection(!showSection)
  }

  if (!comments?.length) {
    return null
  }

  return (
    <div className={className}>
      <button
        className="group flex w-full items-center space-x-2 text-center text-sm"
        onClick={() => onToggle()}
      >
        <span className="opacity-80 group-hover:opacity-100">
          {showSection ? 'Hide more comments' : 'Show more comments'}
        </span>
        {showSection ? (
          <ChevronUpOutline className="size-2" />
        ) : (
          <ChevronDownOutline className="size-2" />
        )}
      </button>
      {showSection ? (
        <>
          <div className="space-y-4 py-6">
            {loading && <CommentsShimmer />}
            {comments?.map(
              (comment) =>
                !comment.isHidden && (
                  <RenderComment
                    key={`${comment?.id}_${comment.createdAt}`}
                    comment={comment as Comment}
                  />
                )
            )}
          </div>
          {pageInfo?.next && (
            <span ref={observe} className="flex justify-center p-10">
              <Spinner />
            </span>
          )}
        </>
      ) : null}
    </div>
  )
}

export default NonRelevantComments
