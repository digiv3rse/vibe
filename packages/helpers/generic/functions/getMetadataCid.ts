import type { AnyPublication } from '@vibe/digi'

import { getPublication } from './getPublication'

export const getMetadataCid = (publication: AnyPublication): string => {
  const target = getPublication(publication)
  const hash = target.metadata.rawURI.split('/').pop()
  return hash ?? ''
}
