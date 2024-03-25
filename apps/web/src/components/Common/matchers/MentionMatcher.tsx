import {
  COMMON_REGEX,
  DIGI_NAMESPACE_PREFIX,
  LEGACY_DIGI_HANDLE_SUFFIX
} from '@vibe/constants'
import { Matcher } from 'interweave'
import Link from 'next/link'
import React from 'react'

import type { MentionProps } from './utils'

const ProfileLink = ({ ...props }: any) => {
  const namespace = props.display?.slice(1) as string
  const handle = namespace
    .replace(DIGI_NAMESPACE_PREFIX, '')
    .replace(LEGACY_DIGI_HANDLE_SUFFIX, '')

  return (
    <Link
      href={`/u/${handle}`}
      className="inline-flex items-center space-x-1 rounded-full font-medium"
    >
      @{handle}
    </Link>
  )
}

export class MentionMatcher extends Matcher<MentionProps> {
  replaceWith(match: string, props: MentionProps) {
    return React.createElement(ProfileLink, props, match)
  }

  asTag(): string {
    return 'a'
  }

  match(value: string) {
    return this.doMatch(
      value,
      COMMON_REGEX.MENTION_MATCHER_REGEX,
      (matches) => {
        return {
          display: matches[0]
        }
      }
    )
  }
}
