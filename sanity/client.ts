import sanityClient from '@sanity/client'

export default sanityClient({
  projectId: '9x1ahdfc', // you can find this in sanity.json
  dataset: 'production', // or the name you chose in step 1
  apiVersion: 'v2021-06-07', // use a UTC date string

  useCdn: true, // `false` if you want to ensure fresh data
})
