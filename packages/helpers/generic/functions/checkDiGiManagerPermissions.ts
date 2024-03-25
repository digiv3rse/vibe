import type { Profile } from '@vibe/digi'

export const checkDiGiManagerPermissions = (
  profile: Profile | null
): {
  canBroadcast: boolean
  canUseDiGiManager: boolean
} => {
  if (!profile) {
    return { canBroadcast: false, canUseDiGiManager: false }
  }
  const canUseDiGiManager = profile?.signless && profile?.sponsor
  const canBroadcast = profile?.sponsor
  return { canBroadcast, canUseDiGiManager }
}
