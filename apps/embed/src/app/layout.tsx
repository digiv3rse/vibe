import '../styles/index.css'

import { VIBE_APP_DESCRIPTION, VIBE_APP_NAME } from '@vibe/constants'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: VIBE_APP_NAME,
  description: VIBE_APP_DESCRIPTION
}

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

export default RootLayout
