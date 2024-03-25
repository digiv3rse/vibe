import MetaTags from '@components/Common/MetaTags'
import type { AnyPublication } from '@vibe/digi'
import { usePublicationQuery } from '@vibe/digi'
import {
  EVENTS,
  getPublication,
  getPublicationData,
  isListenable,
  Tower
} from '@vibe/generic'
import { Spinner } from '@vibe/ui'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import Custom404 from 'src/pages/404'
import Custom500 from 'src/pages/500'

import Audio from './Audio'
import Background from './Background'
import Details from './Details'

const Listen = () => {
  const {
    query: { id }
  } = useRouter()

  useEffect(() => {
    Tower.track(EVENTS.PAGEVIEW, { page: EVENTS.PAGE_VIEW.LISTEN })
  }, [])

  const { data, error, loading } = usePublicationQuery({
    variables: {
      request: { forId: id }
    },
    skip: !id
  })

  if (loading || !data) {
    return (
      <div className="grid h-[80vh] place-items-center">
        <Spinner />
      </div>
    )
  }

  if (error) {
    return <Custom500 />
  }

  const publication = data?.publication as AnyPublication
  const audio = getPublication(publication)

  if (!isListenable(audio)) {
    return <Custom404 />
  }

  return (
    <>
      <MetaTags
        title={getPublicationData(audio?.metadata)?.title || `Listen`}
      />
      {audio ? (
        <div>
          <Background audio={audio}>
            <Audio audio={audio} />
          </Background>
          <div className="max-w-screen-laptop mx-auto">
            <Details audio={audio} />
          </div>
        </div>
      ) : null}
    </>
  )
}

export default Listen
