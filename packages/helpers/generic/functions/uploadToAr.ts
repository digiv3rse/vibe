import type {
  AudioMetadata,
  LinkMetadata,
  LiveStreamMetadata,
  ProfileMetadata,
  TextOnlyMetadata,
  VideoMetadata
} from '@digiv3rse/metadata'
import { WORKER_IRYS_METADATA_UPLOAD_URL } from '@vibe/constants'
import axios from 'axios'

import { logger } from '../logger'

export const uploadToAr = async (
  data:
    | VideoMetadata
    | AudioMetadata
    | ProfileMetadata
    | TextOnlyMetadata
    | LinkMetadata
    | LiveStreamMetadata
): Promise<string> => {
  try {
    const response = await axios.post(WORKER_IRYS_METADATA_UPLOAD_URL, data)
    const { id } = response.data
    return `ar://${id}`
  } catch (error) {
    logger.error('[Error AR Metadata Upload]', error)
    throw new Error('[Error AR Metadata Upload]')
  }
}
