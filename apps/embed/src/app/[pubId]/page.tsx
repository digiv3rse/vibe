import type { AnyPublication } from '@vibe/digi'
import { PublicationDocument } from '@vibe/digi'
import { apolloClient } from '@vibe/digi/apollo'
import { getPublication, isListenable, isWatchable } from '@vibe/generic'

import Custom404 from '@/components/Custom404'
import Publication from '@/components/Publication'

type Props = {
  params: { pubId: string }
}

const client = apolloClient()

export default async function Page({ params }: Props) {
  const { pubId } = params
  const { data, error } = await client.query({
    query: PublicationDocument,
    variables: { request: { forId: pubId } }
  })

  if (!data.publication || error) {
    return <Custom404 />
  }

  const publication = data.publication as AnyPublication
  const targetPublication = getPublication(publication)
  const isAudio = isListenable(targetPublication)
  const isVideo = isWatchable(targetPublication)

  if (!isAudio && !isVideo) {
    return <Custom404 />
  }

  return <Publication publication={targetPublication} />
}
