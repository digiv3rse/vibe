import type { MetadataAttribute } from '@vibe/digi'

// key available only profile metadata
export const getValueFromKeyInAttributes = (
  attributes: MetadataAttribute[] | null | undefined,
  key: string
) => {
  return attributes?.find((el) => el.key === key)?.value ?? ''
}
