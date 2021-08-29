import React, { FunctionComponent } from 'react'

import Vimeo from '@u-wave/react-vimeo'

import getVideoId from 'get-video-id'

interface VimeoEmbedProps {
  url: string
}

const VimeoEmbed: FunctionComponent<VimeoEmbedProps> = ({
  url,
}: VimeoEmbedProps) => {
  const { id } = getVideoId(url)

  return <Vimeo video={id} height={700} />
}

//  this is for when <VideoEmbed /> is a serializer used within <BlockContent />
// const VimeoEmbed: FunctionComponent<VimeoEmbedProps> = (
//   props: VimeoEmbedProps
// ) => {
//   const { id } = getVideoId(props.node.url)

//   return <Vimeo video={id} height={700} />
// }

export default VimeoEmbed
