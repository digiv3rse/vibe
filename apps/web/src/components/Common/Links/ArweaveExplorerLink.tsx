import Link from 'next/link'
import type { ReactElement } from 'react'
import React from 'react'

const ArweaveExplorerLink = ({
  txId,
  children
}: {
  txId: string
  children: ReactElement
}) => {
  return (
    <Link
      href={`https://api.digiv3rse.xyz/gateway/ar/${txId}?pretty`}
      rel="noreferer noreferrer"
      target="_blank"
    >
      {children}
    </Link>
  )
}

export default ArweaveExplorerLink
