import type { Maybe, PublicationMetadataMedia } from '@vibe/digi'

export const getAttachmentsData = (
  attachments?: Maybe<PublicationMetadataMedia[]>
): any => {
  if (!attachments) {
    return []
  }

  return attachments.map((attachment) => {
    switch (attachment.__typename) {
      case 'PublicationMetadataMediaImage':
        return {
          uri: attachment.image.optimized?.uri,
          type: 'Image'
        }
      case 'PublicationMetadataMediaVideo':
        return {
          uri: attachment.video.optimized?.uri,
          type: 'Video'
        }
      case 'PublicationMetadataMediaAudio':
        return {
          uri: attachment.audio.optimized?.uri,
          type: 'Audio'
        }
      default:
        return []
    }
  })
}
