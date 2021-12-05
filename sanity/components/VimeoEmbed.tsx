import React from 'react'

import Vimeo from '@u-wave/react-vimeo'
import getVideoId from 'get-video-id'

interface VimeoEmbedProps {
  url: string
}

/**
 * This component renders an embed of the Vimeo video in react
 * @param param0
 * @returns
 */
const VimeoEmbed = ({ url }: VimeoEmbedProps): JSX.Element => {
  const { id } = getVideoId(url)

  return <Vimeo video={id} height={700} />
}

export default VimeoEmbed
