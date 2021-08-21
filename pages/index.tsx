import React, { FunctionComponent } from 'react'
import { GetStaticProps } from 'next'
import Head from 'next/head'

// import styles from './index.module.scss'

const HomePage: FunctionComponent = () => {
  return (
    <>
      <Head>
        <title>Mark Limm</title>
        <meta name='description' content='Mark Limm'></meta>
      </Head>

      <div className=''>
        <div className='m-3'>
          <div className='mb-8'>
            <span className='text-xl font-bold'>This is my blog!</span>
          </div>
        </div>
      </div>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  }
}

export default HomePage
