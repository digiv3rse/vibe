import { getCurrentBrowserFingerPrint } from '@rajesh896/broprint.js'
import { LocalStore } from '@vibe/digi/custom-types'

const getFingerprint = async () => {
  const fingerprint = await getCurrentBrowserFingerPrint()
  return fingerprint
}

export const setFingerprint = async () => {
  const storedFingerprint = localStorage.getItem(LocalStore.VIBE_FINGERPRINT)
  if (!storedFingerprint) {
    const fingerprint = await getFingerprint()
    if (fingerprint) {
      localStorage.setItem(LocalStore.VIBE_FINGERPRINT, fingerprint)
    }
  }
}
