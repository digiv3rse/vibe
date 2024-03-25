import {
  OG_IMAGE,
  STATIC_ASSETS,
  VIBE_APP_DESCRIPTION,
  VIBE_APP_NAME,
  VIBE_X_HANDLE
} from '@vibe/constants'
import Head from 'next/head'
import { useRouter } from 'next/router'
import type { FC } from 'react'
import React from 'react'

type Props = {
  title?: string
}

const MetaTags: FC<Props> = (props) => {
  const router = useRouter()
  const { title } = props

  const meta = {
    title: title ? `${title} • ${VIBE_APP_NAME}` : VIBE_APP_NAME,
    description: VIBE_APP_DESCRIPTION,
    image: OG_IMAGE,
    type: 'website'
  }

  return (
    <Head>
      <title>{meta.title}</title>
      <meta name="robots" content="follow, index" />
      <meta content={meta.description} name="description" />
      <meta
        name="viewport"
        content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, maximum-scale=5, viewport-fit=cover"
      />
      <link rel="canonical" href={`https://digiv3rse.xyz${router.asPath}`} />
      <meta
        property="og:url"
        content={`https://digiv3rse.xyz${router.asPath}`}
      />
      <meta property="og:type" content={meta.type} />
      <meta property="og:site_name" content={VIBE_APP_NAME} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:image" content={meta.image} />
      <meta property="og:image:width" content="400" />
      <meta property="og:image:height" content="400" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:image:width" content="400" />
      <meta property="twitter:image:height" content="400" />
      <meta name="twitter:site" content="@tapexyz" />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta property="twitter:image" content={meta.image} />
      <meta property="twitter:creator" content={VIBE_X_HANDLE} />
      <link rel="preconnect" href={STATIC_ASSETS} />
      <link rel="dns-prefetch" href={STATIC_ASSETS} />
    </Head>
  )
}

export default MetaTags
