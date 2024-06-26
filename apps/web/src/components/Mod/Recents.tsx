import Timeline from '@components/Home/Timeline'
import TimelineShimmer from '@components/Shimmers/TimelineShimmer'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import { getUnixTimestampForDaysAgo } from '@lib/formatTime'
import {
  DIGITUBE_BYTES_APP_ID,
  INFINITE_SCROLL_ROOT_MARGIN,
  VIBE_APP_ID
} from '@vibe/constants'
import type { ExplorePublicationRequest, PrimaryPublication } from '@vibe/digi'
import {
  ExplorePublicationsOrderByType,
  ExplorePublicationType,
  LimitType,
  PublicationMetadataMainFocusType,
  useExplorePublicationsQuery
} from '@vibe/digi'
import { Spinner } from '@vibe/ui'
import React from 'react'
import { useInView } from 'react-cool-inview'

const since = getUnixTimestampForDaysAgo(30)

const request: ExplorePublicationRequest = {
  where: {
    publicationTypes: [ExplorePublicationType.Post],
    metadata: {
      publishedOn: [VIBE_APP_ID, DIGITUBE_BYTES_APP_ID],
      mainContentFocus: [PublicationMetadataMainFocusType.Video]
    },
    since
  },
  orderBy: ExplorePublicationsOrderByType.Latest,
  limit: LimitType.Fifty
}

const Recents = () => {
  const { data, loading, error, fetchMore } = useExplorePublicationsQuery({
    variables: {
      request
    }
  })

  const videos = data?.explorePublications
    ?.items as unknown as PrimaryPublication[]
  const pageInfo = data?.explorePublications?.pageInfo

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
  if (loading) {
    return (
      <div className="pt-3">
        <TimelineShimmer />
      </div>
    )
  }
  if (!videos.length || error) {
    return <NoDataFound isCenter withImage text={`No videos found`} />
  }

  return (
    <div className="pt-3">
      {!error && !loading && videos?.length ? (
        <>
          <Timeline videos={videos} />
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

export default Recents
