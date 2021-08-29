import React, { FunctionComponent } from 'react'
import { GetStaticPaths, GetStaticProps } from 'next'
import groq from 'groq'

import BlockContent from '@sanity/block-content-to-react'

import sanityClient from 'sanity/client'
import CodeBlock from 'sanity/components/CodeBlock'
import VimeoEmbed from 'sanity/components/VimeoEmbed'

import { Image } from 'sanity/schemas/Image'
import { urlFor } from 'sanity/renderHelpers'
import { Body } from 'sanity/schemas/Body'

const serializers = {
  types: {
    code: CodeBlock,
    vimeo: VimeoEmbed,
  },
}

/**
 * My typing of the sanity Post schema type.  I haven't looked into generating typescript types for sanity schemas yet
 */
interface PostPagePost {
  _id: string

  authorImage: Image
  authorName: string
  body: Body
  categories: string[]
  categoryName: string
  slug: {
    _type: string
    current: string
  }
  thumbnail: Image
  title: string
}

interface PostPageProps {
  post: PostPagePost
}

const PostPage: FunctionComponent<PostPageProps> = ({
  post,
}: PostPageProps) => {
  const {
    authorImage,
    authorName,
    body,
    categories,
    categoryName,
    slug,
    title,
  } = post

  return (
    <article>
      <h1>{title}</h1>
      <div>Slug: {slug.current}</div>

      <div>Category: {categoryName}</div>

      {categories && (
        <ul>
          Posted in
          {categories.map((category) => (
            <li key={category}>{category}</li>
          ))}
        </ul>
      )}

      <BlockContent
        blocks={body}
        imageOptions={{ h: 500, fit: 'max' }}
        //w: 320, h: 240,

        serializers={serializers}
        {...sanityClient.config()}
      />

      <div style={{ marginTop: '25px' }}>By: {authorName}</div>

      {authorImage && (
        <div>
          <img src={urlFor(authorImage).height(100).url()} />
        </div>
      )}
    </article>
  )
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  // It's important to default the slug so that it doesn't return "undefined"
  // const { slug = "" } = context.query

  const groqQuery = groq`
  *[_type == "post" && slug.current == $slug][0]{ body, "slug": slug.current, title, "authorName": author->name, "categoryName": categories[0]->title, "categories": categories[]->title, "authorImage": author->image}`

  const post = await sanityClient.fetch(groqQuery, { slug: params.slug })

  //  get posts that match the given slug
  return {
    props: {
      post,
    },
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const groqQuery = groq`
  *[_type == "post"]
`

  const posts: PostPagePost[] = await sanityClient.fetch(groqQuery, {})

  return {
    paths: posts.map((p) => {
      return `/posts/${p.slug.current}`
    }),
    fallback: false,
  }
}

export default PostPage
