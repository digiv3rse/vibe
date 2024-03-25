import MetaTags from '@components/Common/MetaTags'
import Timeline from '@components/Home/Timeline'
import TimelineShimmer from '@components/Shimmers/TimelineShimmer'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import useProfileStore from '@lib/store/idb/profile'
import {
  ALLOWED_APP_IDS,
  DIGITUBE_BYTES_APP_ID,
  INFINITE_SCROLL_ROOT_MARGIN,
  IS_MAINNET,
  VIBE_APP_ID
} from '@vibe/constants'
import type { AnyPublication, PublicationBookmarksRequest } from '@vibe/digi'
import {
  LimitType,
  PublicationMetadataMainFocusType,
  usePublicationBookmarksQuery
} from '@vibe/digi'
import { Spinner } from '@vibe/ui'
import type { FC } from 'react'
import React from 'react'
import { useInView } from 'react-cool-inview'

const Bookmarks: FC = () => {
  const { activeProfile } = useProfileStore()

  const request: PublicationBookmarksRequest = {
    limit: LimitType.Fifty,
    where: {
      metadata: {
        mainContentFocus: [PublicationMetadataMainFocusType.Video],
        publishedOn: IS_MAINNET
          ? [VIBE_APP_ID, DIGITUBE_BYTES_APP_ID, ...ALLOWED_APP_IDS]
          : undefined
      }
    }
  }

  const { data, loading, error, fetchMore } = usePublicationBookmarksQuery({
    variables: {
      request
    },
    skip: !activeProfile?.id
  })

  const savedVideos = data?.publicationBookmarks?.items as AnyPublication[]
  const pageInfo = data?.publicationBookmarks?.pageInfo

  const { observe } = useInView({
    rootMargin: INFINITE_SCROLL_ROOT_MARGIN,
    onEnter: async () => {
      await fetchMore({
        variables: {
          request: {
            ...request,
            cursor: pageInfo?.next
          },
          channelId: activeProfile?.id ?? null
        }
      })
    }
  })

  if (loading) {
    return <TimelineShimmer />
  }

  if (!data?.publicationBookmarks?.items?.length) {
    return (
      <NoDataFound
        isCenter
        withImage
        text="No videos found"
        className="my-20"
      />
    )
  }

  return (
    <>
      <MetaTags title={`Saved Videos`} />
      <h1 className="mb-6 font-bold md:text-2xl">Saved Videos</h1>
      {!error && !loading && (
        <>
          <Timeline videos={savedVideos} />
          {pageInfo?.next && (
            <span ref={observe} className="flex justify-center p-10">
              <Spinner />
            </span>
          )}
        </>
      )}
    </>
  )
}

export default Bookmarks
