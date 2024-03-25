import { OG_IMAGE, VIBE_APP_NAME, VIBE_WEBSITE_URL } from '@vibe/constants'
import type { PrimaryPublication } from '@vibe/digi'
import { getProfile, getPublicationData } from '@vibe/generic'
import isOpenActionAllowed from '@vibe/generic/functions/isOpenActionAllowed'

export const getCollectModuleMetadata = (publication: PrimaryPublication) => {
  const { openActionModules } = publication

  if (!openActionModules) {
    return
  }

  const openAction = openActionModules.filter((module) =>
    isOpenActionAllowed([module])
  )

  const collectModule = openAction.length ? openAction[0] : null

  if (!collectModule) {
    return
  }

  const { metadata } = publication
  const profile = getProfile(publication.by)
  const publicationTitle = getPublicationData(metadata)?.title || ''
  const title = `${publicationTitle} by ${profile.slugWithPrefix} • ${VIBE_APP_NAME}`
  const pageUrl = `${VIBE_WEBSITE_URL}/watch/${publication.id}`
  const publicationCover =
    getPublicationData(metadata)?.asset?.cover || OG_IMAGE

  return {
    'eth:nft:chain': 'ethereum',
    'eth:nft:collection': title,
    'eth:nft:contract_address': collectModule.contract.address,
    'eth:nft:creator_address': publication.by.ownedBy.address,
    'eth:nft:media_url': publicationCover,
    'eth:nft:mint_count': publication.stats.countOpenActions,
    'eth:nft:mint_url': pageUrl,
    'eth:nft:media:type': 'video',
    'eth:nft:schema': 'ERC721'
  }
}
