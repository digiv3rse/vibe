import { DIGI_NAMESPACE_PREFIX } from '@vibe/constants'
import type { Profile } from '@vibe/digi'

export const getProfile = (
  profile: Profile | null
): {
  slug: string
  slugWithPrefix: string
  displayName: string
  link: string
  id: string
  address: string
} => {
  if (!profile) {
    return {
      slug: '',
      slugWithPrefix: '',
      displayName: '',
      link: '',
      id: '',
      address: ''
    }
  }

  const prefix = profile.handle ? '@' : '#'
  let slug: string = profile.handle?.fullHandle || profile.id
  slug = slug.replace(DIGI_NAMESPACE_PREFIX, '')

  return {
    id: profile.id,
    slug,
    slugWithPrefix: `${prefix}${slug}`,
    displayName: profile.metadata?.displayName || slug,
    link: profile.handle
      ? `/u/${profile.handle.localName}`
      : `/profile/${profile.id}`,
    address: profile.ownedBy?.address
  }
}
