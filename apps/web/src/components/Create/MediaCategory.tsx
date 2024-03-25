import useAppStore from '@lib/store'
import { CREATOR_VIDEO_CATEGORIES } from '@vibe/constants'
import { getCategoryByTag } from '@vibe/generic'
import { Select, SelectItem } from '@vibe/ui'
import React from 'react'

const MediaCategory = () => {
  const uploadedMedia = useAppStore((state) => state.uploadedMedia)
  const setUploadedMedia = useAppStore((state) => state.setUploadedMedia)
  return (
    <div className="flex-1 space-y-1">
      <span className="text-sm font-medium">Category</span>

      <Select
        value={uploadedMedia.mediaCategory.tag}
        onValueChange={(tag) =>
          setUploadedMedia({ mediaCategory: getCategoryByTag(tag) })
        }
      >
        {CREATOR_VIDEO_CATEGORIES.map((category) => (
          <SelectItem key={category.tag} value={category.tag}>
            {category.name}
          </SelectItem>
        ))}
      </Select>
    </div>
  )
}

export default MediaCategory
