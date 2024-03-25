import type {
  QueuedCommentType,
  QueuedVideoType
} from '@vibe/digi/custom-types'
import {
  CustomNotificationsFilterEnum,
  LocalStore
} from '@vibe/digi/custom-types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AppPerisistState {
  lastOpenedNotificationId: string
  setLastOpenedNotificationId: (id: string) => void
  latestNotificationId: string
  setLatestNotificationId: (id: string) => void
  queuedVideos: QueuedVideoType[]
  queuedComments: QueuedCommentType[]
  selectedNotificationsFilter: CustomNotificationsFilterEnum
  setQueuedComments: (queuedComments: QueuedCommentType[]) => void
  setQueuedVideos: (queuedVideos: QueuedVideoType[]) => void
  setSelectedNotificationsFilter: (
    filter: CustomNotificationsFilterEnum
  ) => void
}

export const usePersistStore = create(
  persist<AppPerisistState>(
    (set) => ({
      latestNotificationId: '',
      setLatestNotificationId: (latestNotificationId) =>
        set({ latestNotificationId }),
      lastOpenedNotificationId: '',
      setLastOpenedNotificationId: (id) =>
        set({ lastOpenedNotificationId: id }),
      queuedComments: [],
      queuedVideos: [],
      setQueuedVideos: (queuedVideos) => set({ queuedVideos }),
      setQueuedComments: (queuedComments) => set({ queuedComments }),
      selectedNotificationsFilter:
        CustomNotificationsFilterEnum.ALL_NOTIFICATIONS,
      setSelectedNotificationsFilter: (selectedNotificationsFilter) =>
        set({ selectedNotificationsFilter })
    }),
    {
      name: LocalStore.VIBE_STORE
    }
  )
)

export default usePersistStore
