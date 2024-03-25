import { COMMON_REGEX } from '@vibe/constants'

export const getURLs = (text: string): string[] => {
  if (!text) {
    return []
  }
  return text.match(COMMON_REGEX.URL) || []
}
