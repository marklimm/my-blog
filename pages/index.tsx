import React, { FunctionComponent } from 'react'
import { GetStaticProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'

import groq from 'groq'

import BlockContent from '@sanity/block-content-to-react'
import sanityClient from 'sanity/client'
import VimeoEmbed from 'sanity/components/VimeoEmbed'

import { urlFor } from 'sanity/renderHelpers'
import { Body } from 'sanity/schemas/Body'
import { ImageSanity } from 'sanity/schemas/Image'

import styles from './index.module.scss'

/**
 * My typing of the sanity Project schema type.  I haven't looked into generating typescript types for sanity schemas yet
 */
interface Project {
  _id: string
  blurb: Body
  githubUrl: string
  mainImage: ImageSanity
  order: string
  title: string
  url: string
}

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
  projects: Project[]
  screencasts: Screencast[]
}

const HomePage: FunctionComponent<HomePageProps> = ({
  projects,
  screencasts,
}: HomePageProps) => {
  return (
    <>
      <Head>
        <title>This blog right here</title>
        <meta name='description' content='This blog right here'></meta>
      </Head>

      <div className='m-6'>
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

                <div className='block-content my-5'>
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

        {/* justify-center centers the child div horizontally */}
        <div className='flex justify-center'>
          {/* flex-col to have the items render vertically */}
          <div className='flex flex-col xl:w-3/4'>
            {projects.map((project) => {
              const sanityImageUrlLoader = ({ width }) => {
                return `${urlFor(project.mainImage).width(width).url()}`
              }

              return (
                <div key={project._id} className='my-12 '>
                  <div className='flex'>
                    {project.mainImage && (
                      <Link href={project.url}>
                        <a target='_blank'>
                          <Image
                            loader={sanityImageUrlLoader}
                            src='this-doesnt-matter.png'
                            alt={`${project.title}`}
                            width='500'
                            height='500'
                            layout='fixed'
                            objectFit='cover'
                          />
                        </a>
                      </Link>
                    )}

                    <div className='pl-8'>
                      <div className={styles.screencastTitle}>
                        <a
                          href={`${project.url}`}
                          target='_blank'
                          rel='noreferrer'
                        >
                          {project.title}
                        </a>
                      </div>
                      <div className='text-base mt-3'>
                        Github: &nbsp;
                        <Link href={project.githubUrl}>
                          <a target='_blank'>{project.githubUrl}</a>
                        </Link>
                      </div>
                      <div className='block-content my-5'>
                        <BlockContent
                          blocks={project.blurb}
                          {...sanityClient.config()}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  //  the groq query to retrieve screencasts
  const screencastsQuery = groq`
  *[_type == "screencast"] | order(publishedAt desc) { _id, blurb, publishedAt, slug, "tags": tags[]->title, title, vimeoVideo }
`

  //  the groq query to retrieve projects
  const projectsQuery = groq`
  *[_type == "project"] | order(order) { _id, blurb, githubUrl, mainImage, order, title, url }
`

  const screencasts = await sanityClient.fetch(screencastsQuery, {})
  const projects = await sanityClient.fetch(projectsQuery, {})

  return {
    props: {
      projects,
      screencasts,
    },
  }
}

export default HomePage
