import HoverableProfile from '@components/Common/HoverableProfile'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import type { FollowingRequest, Profile, ProfileStats } from '@vibe/digi'
import { LimitType, useFollowingQuery } from '@vibe/digi'
import { formatNumber, getProfile, getProfilePicture } from '@vibe/generic'
import { Modal, Spinner } from '@vibe/ui'
import type { FC } from 'react'
import React, { useState } from 'react'
import { useInView } from 'react-cool-inview'

type Props = {
  stats: ProfileStats
  profileId: string
}

const Following: FC<Props> = ({ stats, profileId }) => {
  const [showModal, setShowModal] = useState(false)

  const request: FollowingRequest = {
    for: profileId,
    limit: LimitType.Fifty
  }

  const { data, loading, fetchMore } = useFollowingQuery({
    variables: { request },
    skip: !profileId
  })

  const followings = data?.following?.items as Profile[]
  const pageInfo = data?.following?.pageInfo

  const { observe } = useInView({
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

  return (
    <>
      <button
        className="flex items-end gap-1"
        onClick={() => setShowModal(true)}
      >
        <span className="font-bold">{formatNumber(stats.following)}</span>
        <span>Followings</span>
      </button>
      <Modal
        size="sm"
        title={`${formatNumber(stats.following)} followings`}
        show={showModal}
        setShow={setShowModal}
      >
        <div className="no-scrollbar max-h-[70vh] overflow-y-auto">
          {loading && <Spinner />}
          {followings?.length === 0 && (
            <div className="pt-5">
              <NoDataFound withImage isCenter />
            </div>
          )}
          <div className="space-y-2">
            {followings?.map((profile) => (
              <div key={profile.id}>
                <span className="inline-flex">
                  <HoverableProfile
                    profile={profile}
                    pfp={
                      <img
                        src={getProfilePicture(profile, 'AVATAR')}
                        className="size-5 rounded-full"
                        draggable={false}
                        alt={getProfile(profile)?.displayName}
                      />
                    }
                  />
                </span>
              </div>
            ))}
          </div>
          {pageInfo?.next && (
            <span ref={observe} className="p-5">
              <Spinner />
            </span>
          )}
        </div>
      </Modal>
    </>
  )
}

export default Following
