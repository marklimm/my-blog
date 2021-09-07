import imageUrlBuilder from '@sanity/image-url'
import { ImageUrlBuilder } from '@sanity/image-url/lib/types/builder'

import sanityClient from 'sanity/client'
import { ImageSanity } from 'sanity/schemas/Image'

export const urlFor = (image: ImageSanity): ImageUrlBuilder => {
  return imageUrlBuilder(sanityClient).image(image)
}
