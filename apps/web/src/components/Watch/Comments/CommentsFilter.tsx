import useCommentStore from '@lib/store/comment'
import { tw } from '@vibe/browser'
import { CustomCommentsFilterEnum } from '@vibe/digi/custom-types'
import { DropdownMenu, DropdownMenuItem, SortOutline } from '@vibe/ui'
import React from 'react'

const CommentsFilter = () => {
  const { selectedCommentFilter, setSelectedCommentFilter } = useCommentStore()

  return (
    <DropdownMenu trigger={<SortOutline className="size-5" />}>
      <DropdownMenuItem
        onClick={() =>
          setSelectedCommentFilter(CustomCommentsFilterEnum.RELEVANT_COMMENTS)
        }
      >
        <p
          className={tw(
            'whitespace-nowrap',
            selectedCommentFilter ===
              CustomCommentsFilterEnum.RELEVANT_COMMENTS && 'font-bold'
          )}
        >
          Relevant
        </p>
      </DropdownMenuItem>
      <DropdownMenuItem
        onClick={() =>
          setSelectedCommentFilter(CustomCommentsFilterEnum.NEWEST_COMMENTS)
        }
      >
        <p
          className={tw(
            'whitespace-nowrap',
            selectedCommentFilter ===
              CustomCommentsFilterEnum.NEWEST_COMMENTS && 'font-bold'
          )}
        >
          Newest first
        </p>
      </DropdownMenuItem>
    </DropdownMenu>
  )
}

export default CommentsFilter
