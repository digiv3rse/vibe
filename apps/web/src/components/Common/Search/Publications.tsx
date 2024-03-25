import { tw } from '@vibe/browser'
import {
  DIGITUBE_BYTES_APP_ID,
  FALLBACK_THUMBNAIL_URL,
  STATIC_ASSETS
} from '@vibe/constants'
import type { AnyPublication } from '@vibe/digi'
import {
  getIsSensitiveContent,
  getPublication,
  getPublicationData,
  getThumbnailUrl,
  imageCdn
} from '@vibe/generic'
import Link from 'next/link'
import type { FC } from 'react'
import React from 'react'

interface Props {
  results: AnyPublication[]
  loading: boolean
  clearSearch: () => void
}

const Publications: FC<Props> = ({ results, loading, clearSearch }) => {
  return (
    <div>
      {results?.map((result) => {
        const publication = getPublication(result)
        const isSensitiveContent = getIsSensitiveContent(
          publication.metadata,
          publication.id
        )
        const isBytesVideo =
          publication.publishedOn?.id === DIGITUBE_BYTES_APP_ID
        const thumbnailUrl = isSensitiveContent
          ? `${STATIC_ASSETS}/images/sensor-blur.webp`
          : getThumbnailUrl(publication.metadata, true)

        return (
          <div
            key={publication.id}
            className="hover:bg-gallery dark:hover:bg-smoke relative cursor-default select-none rounded-md pl-3 pr-4"
          >
            <Link
              href={`/watch/${publication?.id}`}
              key={publication?.id}
              onClick={() => clearSearch()}
              className="flex flex-col justify-center space-y-1 py-2"
            >
              <div className="flex items-center space-x-3">
                <img
                  className={tw(
                    'h-16 w-28 flex-none rounded-md bg-gray-300 object-center dark:bg-gray-700',
                    isBytesVideo ? 'object-contain' : 'object-cover'
                  )}
                  src={imageCdn(
                    thumbnailUrl,
                    isBytesVideo ? 'THUMBNAIL_V' : 'THUMBNAIL'
                  )}
                  alt="thumbnail"
                  draggable={false}
                  onError={({ currentTarget }) => {
                    currentTarget.src = FALLBACK_THUMBNAIL_URL
                  }}
                />
                <div className="space-y-0.5">
                  <p className="line-clamp-1 font-medium">
                    {getPublicationData(publication.metadata)?.title}
                  </p>
                  <p className="text-dust line-clamp-2">
                    {getPublicationData(publication.metadata)?.content}
                  </p>
                </div>
              </div>
            </Link>
          </div>
        )
      })}
      {!results?.length && !loading && (
        <div className="relative cursor-default select-none p-5 text-center">
          No results found
        </div>
      )}
    </div>
  )
}

export default Publications
