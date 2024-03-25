'use client'

import { LivepeerConfig } from '@livepeer/react'
import {
  digiFont,
  getLivepeerClient,
  setFingerprint,
  videoPlayerTheme
} from '@vibe/browser'
import type { AnyPublication } from '@vibe/digi'
import { getPublication, isListenable } from '@vibe/generic'
import type { FC } from 'react'
import React, { useEffect } from 'react'

import Audio from './Audio'
import Video from './Video'

type Props = {
  publication: AnyPublication
}

const Publication: FC<Props> = ({ publication }) => {
  useEffect(() => {
    setFingerprint()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const target = getPublication(publication)
  const isAudio = isListenable(target)

  return (
    <div className={digiFont.className}>
      {isAudio ? (
        <Audio audio={target} />
      ) : (
        <LivepeerConfig client={getLivepeerClient()} theme={videoPlayerTheme}>
          <Video video={target} />
        </LivepeerConfig>
      )}
    </div>
  )
}

export default Publication
