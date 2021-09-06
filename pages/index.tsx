import React, { FunctionComponent } from 'react'
import { GetStaticProps } from 'next'
import Head from 'next/head'

import groq from 'groq'

import BlockContent from '@sanity/block-content-to-react'
import sanityClient from 'sanity/client'
import VimeoEmbed from 'sanity/components/VimeoEmbed'

import { Body } from 'sanity/schemas/Body'

import styles from './index.module.scss'

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
  tags: string[]
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

      <div className='m-4'>
        <div className='flex'>
          <div className='flex-grow'>&nbsp;</div>
          <div className='flex-none my-8 mr-16'>
            <span className={styles.headerTitle}>This blog right here</span>
          </div>
        </div>

        {screencasts.map((screencast) => (
          <div key={screencast._id} className='my-32'>
            {/* right now my vimeo image width is fairly large, so I just have the video above the description for all the smaller sizes, and then only at 2xl I use flexbox */}
            <div className='2xl:flex'>
              <div className=''>
                <VimeoEmbed url={screencast.vimeoVideo.url} />
              </div>

              <div className='w-full lg:w-8/12 2xl:pl-16 2xl:w-5/12'>
                <div className={styles.screencastTitle}>{screencast.title}</div>

                <div className='my-5'>
                  <BlockContent
                    blocks={screencast.blurb}
                    {...sanityClient.config()}
                  />
                </div>

                {screencast.tags.length > 0 && (
                  <div>
                    {screencast.tags.map((tag) => (
                      <div key={tag} className={styles.tag}>
                        {tag}
                      </div>
                    ))}
                  </div>
                )}
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
