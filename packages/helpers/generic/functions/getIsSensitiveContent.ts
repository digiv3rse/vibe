import { SENSITIVE_CONTENT } from '@vibe/constants'
import type { PublicationMetadata } from '@vibe/digi'

export const getIsSensitiveContent = (
  metadata: PublicationMetadata | null,
  videoId: string
): boolean => {
  return (
    Boolean(metadata?.attributes?.find((el) => el.value === 'sensitive')) ||
    SENSITIVE_CONTENT.includes(videoId) ||
    Boolean(metadata?.contentWarning)
  )
}
