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

      <div className=''>
        <div className='m-3'>
          <div className='mb-8'>
            <span className='text-xl font-bold'>This is my blog!</span>
          </div>
        </div>
      </div>

      {posts.map((post) => (
        <div key={post._id} style={{ margin: '25px 0' }}>
          <div style={{ display: 'inline-block' }}>
            {post.thumbnail && (
              <div>
                <img src={urlFor(post.thumbnail).height(250).url()} />
              </div>
            )}
          </div>

          <Link href={`/post/${post.slug.current}`}>
            <a target='_blank'>{post.title}</a>
          </Link>
        </div>
      ))}
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  //  get all posts except the dev blog post
  const groqQuery = groq`
  *[_type == "post" && slug.current != 'dev-blog']{ _id, title, slug, "thumbnail": mainImage }
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
