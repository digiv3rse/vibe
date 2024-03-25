import { S3 } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import {
  STORAGE_ENDPOINT,
  STORAGE_REGION,
  WORKER_STS_TOKEN_URL
} from '@vibe/constants'
import type { IPFSUploadResult } from '@vibe/digi/custom-types'
import { logger } from '@vibe/generic/logger'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'

const everland = async (
  file: File,
  onProgress?: (percentage: number) => void
) => {
  try {
    const { data } = await axios.get(WORKER_STS_TOKEN_URL)
    const client = new S3({
      endpoint: STORAGE_ENDPOINT,
      region: STORAGE_REGION,
      credentials: {
        accessKeyId: data?.accessKeyId,
        secretAccessKey: data?.secretAccessKey,
        sessionToken: data?.sessionToken
      },
      maxAttempts: 10
    })
    client.middlewareStack.addRelativeTo(
      (next: Function) => async (args: any) => {
        const { response } = await next(args)
        if (response.body == null) {
          response.body = new Uint8Array()
        }
        return {
          response
        }
      },
      {
        name: 'nullFetchResponseBodyMiddleware',
        toMiddleware: 'deserializerMiddleware',
        relation: 'after',
        override: true
      }
    )
    const fileKey = uuidv4()
    const params = {
      Bucket: 'digi3',
      Key: fileKey,
      Body: file,
      ContentType: file.type
    }
    const task = new Upload({
      client,
      params
    })
    task.on('httpUploadProgress', (e) => {
      const loaded = e.loaded ?? 0
      const total = e.total ?? 0
      const progress = (loaded / total) * 100
      onProgress?.(Math.round(progress))
    })
    await task.done()
    const result = await client.headObject(params)
    const metadata = result.Metadata
    return {
      url: `ipfs://${metadata?.['ipfs-hash']}`,
      type: file.type
    }
  } catch (error) {
    logger.error('[Error IPFS3 Media Upload]', error)
    return {
      url: '',
      type: file.type
    }
  }
}

export const uploadToIPFS = async (
  file: File,
  onProgress?: (percentage: number) => void
): Promise<IPFSUploadResult> => {
  const { url, type } = await everland(file, onProgress)
  return { url, type }
}
