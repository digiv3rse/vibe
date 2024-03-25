import '../styles/index.css'

import Providers from '@components/Common/Providers'
import { digiFont } from '@vibe/browser/font'
import type { AppProps } from 'next/app'
import React from 'react'

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <Providers>
      <style jsx global>{`
        html {
          font-family: ${digiFont.style.fontFamily};
        }
      `}</style>
      <Component {...pageProps} />
    </Providers>
  )
}

export default App
