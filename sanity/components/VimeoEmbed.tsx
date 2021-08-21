import React, { FunctionComponent } from 'react'

import Vimeo from '@u-wave/react-vimeo'

import getVideoId from 'get-video-id'

interface VimeoEmbedProps {
  node: {
    url: string
  }
}

const VimeoEmbed: FunctionComponent<VimeoEmbedProps> = (
  props: VimeoEmbedProps
) => {
  const { id } = getVideoId(props.node.url)

  return <Vimeo video={id} height={700} />
}

export default VimeoEmbed
