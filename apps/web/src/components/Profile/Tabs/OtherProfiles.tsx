import Badge from '@components/Common/Badge'
import FollowActions from '@components/Common/FollowActions'
import OtherChannelsShimmer from '@components/Shimmers/OtherChannelsShimmer'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import type { Profile } from '@vibe/digi'
import { useProfilesQuery } from '@vibe/digi'
import { formatNumber, getProfile, getProfilePicture } from '@vibe/generic'
import Link from 'next/link'
import type { FC } from 'react'
import React from 'react'

type Props = {
  currentProfile: Profile
}

const OtherProfiles: FC<Props> = ({ currentProfile }) => {
  const { data, loading } = useProfilesQuery({
    variables: {
      request: { where: { ownedBy: [currentProfile?.ownedBy.address] } }
    },
    skip: !currentProfile?.ownedBy
  })
  const allProfiles = data?.profiles?.items as Profile[]

  if (loading) {
    return <OtherChannelsShimmer />
  }

  if (allProfiles?.length === 1) {
    return <NoDataFound isCenter withImage text="No other channels found" />
  }

  return (
    <div className="flex flex-wrap justify-center gap-3 md:justify-start">
      {allProfiles?.map(
        (profile) =>
          profile.id !== currentProfile.id && (
            <div
              key={profile.id}
              className="flex w-44 flex-col items-center justify-center rounded-xl border border-gray-200 py-3 dark:border-gray-800"
            >
              <Link href={getProfile(profile)?.link}>
                <img
                  className="size-24 rounded-full object-cover"
                  src={getProfilePicture(profile, 'AVATAR_LG')}
                  alt={getProfile(profile)?.slug}
                  draggable={false}
                />
              </Link>
              <div className="w-full px-1.5 py-2">
                <div className="flex-1 text-center">
                  <Link
                    href={getProfile(profile)?.link}
                    className="block truncate font-medium"
                  >
                    <div className="flex items-center justify-center space-x-1">
                      <span>{getProfile(profile)?.slug}</span>
                      <Badge id={profile?.id} />
                    </div>
                  </Link>
                </div>
                <div className="text-center text-xs opacity-70">
                  {formatNumber(profile.stats.followers)} followers
                </div>
              </div>
              <FollowActions profile={profile} />
            </div>
          )
      )}
    </div>
  )
}

export default OtherProfiles
