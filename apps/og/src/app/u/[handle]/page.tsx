import {
  DIGI_NAMESPACE_PREFIX,
  VIBE_APP_DESCRIPTION,
  VIBE_APP_NAME,
  VIBE_WEBSITE_URL
} from '@vibe/constants'
import type { Profile } from '@vibe/digi'
import { ProfileDocument } from '@vibe/digi'
import { apolloClient } from '@vibe/digi/apollo'
import { getProfile, getProfilePicture } from '@vibe/generic'
import type { Metadata } from 'next'

import common from '@/common'

type Props = {
  params: { handle: string }
}

const client = apolloClient()

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = params
  const { data } = await client.query({
    query: ProfileDocument,
    variables: { request: { forHandle: `${DIGI_NAMESPACE_PREFIX}${handle}` } }
  })

  if (!data.profile) {
    return common
  }

  const profile: Profile = data?.profile

  const title = `${getProfile(profile).displayName} (${
    getProfile(profile).slugWithPrefix
  }) • ${VIBE_APP_NAME}`
  const description = profile?.metadata?.bio || VIBE_APP_DESCRIPTION
  const pfp = getProfilePicture(profile, 'AVATAR_LG')

  return {
    title,
    description,
    metadataBase: new URL(`${VIBE_WEBSITE_URL}/u/${profile.handle}`),
    openGraph: {
      title,
      description,
      type: 'profile',
      images: [pfp],
      siteName: VIBE_APP_NAME
    },
    twitter: {
      title,
      description,
      card: 'summary',
      images: [pfp]
    }
  }
}

export default async function Page({ params }: Props) {
  return <div>{params.handle}</div>
}
