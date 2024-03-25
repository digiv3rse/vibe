import {
  DIGI_IMAGEKIT_SNAPSHOT_URL,
  IMAGE_TRANSFORMATIONS,
  IS_PRODUCTION
} from '@vibe/constants'

export const imageCdn = (
  url: string,
  type?: keyof typeof IMAGE_TRANSFORMATIONS
): string => {
  if (!url) {
    return url
  }

  return type && IS_PRODUCTION
    ? `${DIGI_IMAGEKIT_SNAPSHOT_URL}/${IMAGE_TRANSFORMATIONS[type]}/${url}`
    : url

  // if (url.includes(DIGI_IMAGEKIT_SNAPSHOT_URL)) {
  //   const splitedUrl = url.split('/')
  //   const path = splitedUrl[splitedUrl.length - 1]

  //   return type
  //     ? `${DIGI_IMAGEKIT_SNAPSHOT_URL}/${IMAGE_TRANSFORMATIONS[type]}/${path}`
  //     : url
  // }

  // return url
}
