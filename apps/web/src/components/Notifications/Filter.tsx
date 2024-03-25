import usePersistStore from '@lib/store/persist'
import { tw } from '@vibe/browser'
import { CustomNotificationsFilterEnum } from '@vibe/digi/custom-types'
import { CogOutline, DropdownMenu, DropdownMenuItem } from '@vibe/ui'
import React from 'react'

const NotificationsFilter = () => {
  const selectedNotificationsFilter = usePersistStore(
    (state) => state.selectedNotificationsFilter
  )
  const setSelectedNotificationsFilter = usePersistStore(
    (state) => state.setSelectedNotificationsFilter
  )

  return (
    <DropdownMenu trigger={<CogOutline className="size-4" />}>
      <DropdownMenuItem
        onClick={() =>
          setSelectedNotificationsFilter(
            CustomNotificationsFilterEnum.HIGH_SIGNAL
          )
        }
      >
        <p
          className={tw(
            'whitespace-nowrap',
            selectedNotificationsFilter ===
              CustomNotificationsFilterEnum.HIGH_SIGNAL && 'font-bold'
          )}
        >
          High signal
        </p>
      </DropdownMenuItem>
      <DropdownMenuItem
        onClick={() =>
          setSelectedNotificationsFilter(
            CustomNotificationsFilterEnum.ALL_NOTIFICATIONS
          )
        }
      >
        <p
          className={tw(
            'whitespace-nowrap',
            selectedNotificationsFilter ===
              CustomNotificationsFilterEnum.ALL_NOTIFICATIONS && 'font-bold'
          )}
        >
          Show all
        </p>
      </DropdownMenuItem>
    </DropdownMenu>
  )
}

export default NotificationsFilter
