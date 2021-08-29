import React, { FunctionComponent } from 'react'
import { GetStaticProps } from 'next'
import Head from 'next/head'

import groq from 'groq'

import BlockContent from '@sanity/block-content-to-react'
import sanityClient from 'sanity/client'
import VimeoEmbed from 'sanity/components/VimeoEmbed'

import { Body } from 'sanity/schemas/Body'
import { Tag } from 'sanity/schemas/Tag'

// import styles from './index.module.scss'

/**
 * My typing of the sanity Screencast schema type.  I haven't looked into generating typescript types for sanity schemas yet
 */
interface Screencast {
  _id: string
  blurb: Body
  publishedAt: string
  slug: {
    _type: string
    current: string
  }
  tags: Tag[]
  title: string
  vimeoVideo: {
    url: string
  }
}

interface HomePageProps {
  screencasts: Screencast[]
}

const HomePage: FunctionComponent<HomePageProps> = ({
  screencasts,
}: HomePageProps) => {
  return (
    <>
      <Head>
        <title>This blog right here</title>
        <meta name='description' content='This blog right here'></meta>
      </Head>

      <div className='m-8'>
        <div className='flex'>
          <div className='flex-grow'>&nbsp;</div>
          <div className='flex-none my-8 mr-16'>
            <span className='text-5xl font-bold'>This blog right here</span>
          </div>
        </div>

        {screencasts.map((screencast) => (
          <div key={screencast._id} className=' my-28'>
            <div className='flex'>
              <VimeoEmbed url={screencast.vimeoVideo.url} />

              <div className='ml-5'>
                <div className=' text-3xl'>{screencast.title}</div>

                {screencast.tags.length > 0 && (
                  <div>
                    {screencast.tags.map((tag) => (
                      <div
                        key={tag}
                        className='inline-block rounded-full my-3 py-0.5 px-3 border-2 border-green-700 text-base font-bold'
                      >
                        {tag}
                      </div>
                    ))}
                  </div>
                )}

                <div className=''>
                  <BlockContent
                    blocks={screencast.blurb}
                    {...sanityClient.config()}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  //  get all the screencasts
  const groqQuery = groq`
  *[_type == "screencast"] | order(publishedAt desc) { _id, blurb, publishedAt, slug, "tags": tags[]->title, title, vimeoVideo }
`

  const screencasts = await sanityClient.fetch(groqQuery, {})

  console.log('screencasts', screencasts)

  return {
    props: {
      screencasts,
    },
  }
}

export default HomePage
