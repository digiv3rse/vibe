import {
  OG_IMAGE,
  VIBE_APP_DESCRIPTION,
  VIBE_APP_NAME,
  VIBE_WEBSITE_URL
} from '@vibe/constants'
import type { Metadata } from 'next'

const common: Metadata = {
  title: VIBE_APP_NAME,
  description: VIBE_APP_DESCRIPTION,
  metadataBase: new URL(VIBE_WEBSITE_URL),
  openGraph: {
    type: 'website',
    siteName: VIBE_APP_NAME,
    images: [OG_IMAGE],
    title: VIBE_APP_NAME,
    description: VIBE_APP_DESCRIPTION,
    url: new URL(VIBE_WEBSITE_URL)
  },
  twitter: {
    card: 'summary_large_image',
    title: VIBE_APP_NAME,
    description: VIBE_APP_DESCRIPTION,
    images: [OG_IMAGE]
  }
}

export default common
