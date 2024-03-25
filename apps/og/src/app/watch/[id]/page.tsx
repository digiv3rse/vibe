import {
  OG_IMAGE,
  VIBE_APP_NAME,
  VIBE_EMBED_URL,
  VIBE_WEBSITE_URL,
  VIBE_X_HANDLE,
  WORKER_OEMBED_URL
} from '@vibe/constants'
import type { AnyPublication } from '@vibe/digi'
import { PublicationDocument } from '@vibe/digi'
import { apolloClient } from '@vibe/digi/apollo'
import {
  getProfile,
  getPublication,
  getPublicationData,
  truncate
} from '@vibe/generic'
import type { Metadata } from 'next'

import common from '@/common'
import { getCollectModuleMetadata } from '@/other-metadata'

type Props = {
  params: { id: string }
}

const client = apolloClient()

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = params
  const { data } = await client.query({
    query: PublicationDocument,
    variables: { request: { forId: id } }
  })

  if (!data.publication) {
    return common
  }

  const publication = data.publication as AnyPublication
  const targetPublication = getPublication(publication)
  const { by: profile, metadata } = targetPublication
  const publicationTitle = getPublicationData(metadata)?.title || ''
  const publicationContent = truncate(
    getPublicationData(metadata)?.content || '',
    200
  )
  const publicationCover =
    getPublicationData(metadata)?.asset?.cover || OG_IMAGE
  const duration = getPublicationData(metadata)?.asset?.duration

  const title = `${publicationTitle} by ${
    getProfile(profile).slugWithPrefix
  } • ${VIBE_APP_NAME}`
  const embedUrl = `${VIBE_EMBED_URL}/${targetPublication.id}`
  const pageUrl = new URL(`${VIBE_WEBSITE_URL}/watch/${targetPublication.id}`)

  return {
    title,
    applicationName: VIBE_APP_NAME,
    description: publicationContent,
    metadataBase: pageUrl,
    openGraph: {
      title,
      description: publicationContent,
      type: 'video.episode',
      images: [publicationCover],
      siteName: VIBE_APP_NAME,
      videos: [embedUrl],
      duration,
      url: pageUrl,
      tags: [
        ...(Array.isArray(metadata.tags) ? metadata.tags : []),
        'digi',
        'video',
        'episode',
        'watch',
        title,
        getProfile(profile).displayName
      ],
      releaseDate: targetPublication.createdAt
    },
    twitter: {
      title,
      description: publicationContent,
      card: 'player',
      images: [publicationCover],
      site: `@${VIBE_X_HANDLE}`,
      players: {
        playerUrl: embedUrl,
        streamUrl: embedUrl,
        height: 720,
        width: 1280
      }
    },
    other: {
      ...getCollectModuleMetadata(targetPublication)
    },
    alternates: {
      canonical: pageUrl,
      types: {
        'application/json+oembed': `${WORKER_OEMBED_URL}?url=${pageUrl}&format=json`,
        'text/xml+oembed': `${WORKER_OEMBED_URL}?url=${pageUrl}&format=xml`,
        title: publicationTitle
      }
    }
  }
}

export default async function Page({ params }: Props) {
  return <div>{params.id}</div>
}
