import type { RepoResults } from '@cloud/_api/fetchRepos.js'
import type { Metadata } from 'next'

import { fetchGitHubToken } from '@cloud/_api/fetchGitHubToken.js'
import { fetchInstalls } from '@cloud/_api/fetchInstalls.js'
import { fetchMe } from '@cloud/_api/fetchMe.js'
import { fetchRepos, Repo } from '@cloud/_api/fetchRepos.js'
import { Breadcrumbs } from '@components/Breadcrumbs/index.js'
import { Gutter } from '@components/Gutter/index.js'
import { Heading } from '@components/Heading/index.js'
import { mergeOpenGraph } from '@root/seo/mergeOpenGraph.js'
import { uuid as generateUUID } from '@root/utilities/uuid.js'
import { redirect } from 'next/navigation'
import { Fragment } from 'react'

import { ImportProject } from './page_client.js'

const title = `Import a codebase`

export default async () => {
  const { user } = await fetchMe()

  if (!user) {
    redirect(
      `/login?redirect=${encodeURIComponent('/new/import')}&warning=${encodeURIComponent(
        'You must first login to import a repository',
      )}`,
    )
  }

  const token = await fetchGitHubToken()

  if (!token) {
    redirect(`/new/authorize?redirect=${encodeURIComponent(`/new/import`)}`)
  }

  const installs = await fetchInstalls()

  let repos: RepoResults | undefined

  if (Array.isArray(installs) && installs.length > 0) {
    repos = await fetchRepos({
      install: installs[0],
    })
  }

  const uuid = generateUUID()

  return (
    <Fragment>
      <Gutter>
        <h2>{title}</h2>
      </Gutter>
      <ImportProject installs={installs} repos={repos} user={user} uuid={uuid} />
    </Fragment>
  )
}

export const metadata: Metadata = {
  openGraph: mergeOpenGraph({
    title: 'Import Project | Payload Cloud',
    url: '/new/import',
  }),
  title: 'Import Project | Payload Cloud',
}
