import ToggleDiGiManager from '@components/Settings/Manager/DiGiManager/ToggleDiGiManager'
import SignalWaveGraphic from '@components/UIElements/SignalWaveGraphic'
import useProfileStore from '@lib/store/idb/profile'
import { VIBE_APP_NAME } from '@vibe/constants'
import { checkDiGiManagerPermissions, getIsProfileOwner } from '@vibe/generic'
import React from 'react'
import { useAccount } from 'wagmi'

const DiGiManagerAlert = () => {
  const { address } = useAccount()
  const activeProfile = useProfileStore((state) => state.activeProfile)

  const isOwner = activeProfile && getIsProfileOwner(activeProfile, address)
  const { canUseDiGiManager } = checkDiGiManagerPermissions(activeProfile)

  const getDescription = () => {
    return `Enable your DiGi manager for seamless interaction with ${VIBE_APP_NAME}, allowing for faster and easier transactions without the need for signing.`
  }

  if (!activeProfile || canUseDiGiManager || !isOwner) {
    return null
  }

  return (
    <div className="tape-border rounded-large ultrawide:h-[400px] relative flex h-[350px] w-[500px] flex-none overflow-hidden">
      <div className="dark:to-bunker absolute inset-0 h-full w-full bg-gradient-to-b from-gray-100 dark:from-gray-900" />
      <div className="ultrawide:p-8 relative flex h-full flex-col justify-end space-y-4 p-4 text-left md:p-6">
        <div className="text-3xl font-bold">Action Required</div>
        <p className="md:text-md max-w-2xl text-sm lg:text-lg">
          {getDescription()}
        </p>
        <div className="flex">
          <ToggleDiGiManager />
        </div>
      </div>

      <SignalWaveGraphic />
    </div>
  )
}

export default DiGiManagerAlert
