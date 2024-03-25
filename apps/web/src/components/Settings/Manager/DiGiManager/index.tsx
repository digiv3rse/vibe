import useProfileStore from '@lib/store/idb/profile'
import { VIBE_APP_NAME } from '@vibe/constants'
import React from 'react'

import ToggleDiGiManager from './ToggleDiGiManager'

const DiGiManager = () => {
  const activeProfile = useProfileStore((state) => state.activeProfile)

  const getDescription = () => {
    if (!activeProfile?.signless) {
      return `Enable your DiGi manager for seamless interaction with ${VIBE_APP_NAME}, allowing for faster and easier transactions without the need for signing.`
    }
    return `DiGi manager helps interact with ${VIBE_APP_NAME} without signing any of your transactions.`
  }

  return (
    <div className="flex flex-wrap items-center justify-between">
      <div className="mb-2 space-y-2">
        <h1 className="text-brand-400 text-xl font-bold">DiGi Manager</h1>
        <p className="opacity-80">{getDescription()}</p>
      </div>
      <div className="mt-3 flex justify-end">
        <ToggleDiGiManager />
      </div>
    </div>
  )
}

export default DiGiManager
