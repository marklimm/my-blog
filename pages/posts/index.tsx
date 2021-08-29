import React, { FunctionComponent } from 'react'
import { GetStaticProps } from 'next'
import Head from 'next/head'

import Link from 'next/link'
import groq from 'groq'

import sanityClient from 'sanity/client'
import { Image } from 'sanity/schemas//Image'
import { urlFor } from 'sanity/renderHelpers'

// import styles from './index.module.scss'

/**
 * My typing of the sanity Post schema type.  I haven't looked into generating typescript types for sanity schemas yet
 */
interface IndexPagePost {
  _id: string
  previewText: string
  slug: {
    _type: string
    current: string
  }
  thumbnail: Image
  title: string
}

interface HomePageProps {
  posts: IndexPagePost[]
}

const HomePage: FunctionComponent<HomePageProps> = ({
  posts,
}: HomePageProps) => {
  return (
    <>
      <Head>
        <title>This blog right here</title>
        <meta name='description' content='This blog right here'></meta>
      </Head>

      <div className='m-6'>
        <div className='m-3 flex'>
          <div className='flex-grow'>&nbsp;</div>
          <div className='flex-none my-8 mr-16'>
            <span className='text-5xl font-bold'>This blog right here</span>
          </div>
        </div>

        {posts.map((post) => (
          <div key={post._id} className='my-20'>
            <div className='flex'>
              {post.thumbnail && (
                <div className='w-1/3 mr-10 '>
                  <img
                    className='object-cover w-full h-80'
                    src={urlFor(post.thumbnail).height(300).url()}
                  />
                </div>
              )}

              <div className='w-1/2'>
                <div className='mb-3'>
                  <Link href={`/post/${post.slug.current}`}>
                    <a target='_blank'>{post.title}</a>
                  </Link>
                </div>
                {post.previewText}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  //  get all posts except the dev blog post
  const groqQuery = groq`
  *[_type == "post" && slug.current != 'dev-blog'] | order(publishedAt desc) { _id, title, slug, "thumbnail": mainImage, previewText, publishedAt }
`

  const posts = await sanityClient.fetch(groqQuery, {})

  console.log('posts', posts)

  return {
    props: {
      posts,
    },
  }
}

export default HomePage
