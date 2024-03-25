import { ETHERSCAN_URL } from '@vibe/constants'
import Link from 'next/link'
import type { ReactElement } from 'react'
import React from 'react'

const HashExplorerLink = ({
  hash,
  children
}: {
  hash: string
  children: ReactElement
}) => {
  return (
    <Link
      href={`${ETHERSCAN_URL}/tx/${hash}`}
      rel="noreferer noreferrer"
      target="_blank"
    >
      {children}
    </Link>
  )
}

export default HashExplorerLink
