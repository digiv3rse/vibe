import { getTimeFromSeconds } from '@lib/formatTime'
import type { AnyPublication } from '@vibe/digi'
import { getPublication, getPublicationData } from '@vibe/generic'
import type { FC } from 'react'
import React from 'react'

type Props = {
  video: AnyPublication
}

const ThumbnailOverlays: FC<Props> = ({ video }) => {
  const targetPublication = getPublication(video)
  const metadata = getPublicationData(targetPublication.metadata)
  const videoDuration = metadata?.asset?.duration

  if (!videoDuration) {
    return null
  }

  return (
    <div>
      <span className="absolute bottom-2 right-2 rounded bg-black px-1 py-0.5 text-xs font-bold text-white">
        {getTimeFromSeconds(String(videoDuration))}
      </span>
    </div>
  )
}

export default ThumbnailOverlays
