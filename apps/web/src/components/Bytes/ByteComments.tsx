import PublicationComments from '@components/Common/Publication/PublicationComments'
import NonRelevantComments from '@components/Watch/Comments/NonRelevantComments'
import useCommentStore from '@lib/store/comment'
import type { MirrorablePublication } from '@vibe/digi'
import { CustomCommentsFilterEnum } from '@vibe/digi/custom-types'
import type { FC } from 'react'
import React from 'react'

type Props = {
  video: MirrorablePublication
}

const ByteComments: FC<Props> = ({ video }) => {
  const selectedCommentFilter = useCommentStore(
    (state) => state.selectedCommentFilter
  )

  return (
    <div className="no-scrollbar max-h-[40vh] overflow-y-auto">
      <PublicationComments publication={video} hideTitle />
      {selectedCommentFilter === CustomCommentsFilterEnum.RELEVANT_COMMENTS ? (
        <NonRelevantComments video={video} />
      ) : null}
    </div>
  )
}

export default ByteComments
