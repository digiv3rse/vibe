import {
  HEY_WEBSITE_URL,
  VIBE_APP_NAME,
  VIBE_WEBSITE_URL,
  VIBE_X_HANDLE
} from '@vibe/constants'
import type { MirrorablePublication } from '@vibe/digi'

import { getPublicationData } from './getPublicationData'

type Link = 'vibe' | 'hey' | 'x' | 'reddit' | 'linkedin'

export const getSharableLink = (
  link: Link,
  publication: MirrorablePublication
) => {
  const fullHandle = publication.by.handle?.fullHandle
  const { metadata } = publication
  const isAudio = metadata?.__typename === 'AudioMetadataV3'

  const url = `${VIBE_WEBSITE_URL}/${isAudio ? 'listen' : 'watch'}/${
    publication.id
  }`

  if (link === 'vibe') {
    return `${VIBE_WEBSITE_URL}/watch/${publication.id}`
  } else if (link === 'hey') {
    return `${HEY_WEBSITE_URL}/?url=${url}&text=${
      (getPublicationData(metadata)?.title as string) ?? ''
    } by @${fullHandle}&hashtags=${VIBE_APP_NAME}&preview=true`
  } else if (link === 'x') {
    return encodeURI(
      `https://x.com/intent/tweet?url=${url}&text=${
        (getPublicationData(metadata)?.title as string) ?? ''
      } by @${fullHandle}&via=${VIBE_X_HANDLE}&related=${VIBE_APP_NAME}&hashtags=${VIBE_APP_NAME}`
    )
  } else if (link === 'reddit') {
    return `https://www.reddit.com/submit?url=${url}&title=${
      (getPublicationData(metadata)?.title as string) ?? ''
    } by @${fullHandle}`
  } else if (link === 'linkedin') {
    return `https://www.linkedin.com/shareArticle/?url=${url} by @${fullHandle}&title=${
      (getPublicationData(metadata)?.title as string) ?? ''
    }&summary=${
      getPublicationData(metadata)?.content as string
    }&source=${VIBE_APP_NAME}`
  }
  return ''
}
