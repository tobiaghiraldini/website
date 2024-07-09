import { mergeOpenGraph } from '@root/seo/mergeOpenGraph.js'
import { RenderDocs } from '@components/RenderDocs'
import { fetchDocs } from '../../../api'
import { Banner } from '@components/MDX/components/Banner'
import Link from 'next/link'

const topicOrder = [
  'Getting-Started',
  'Configuration',
  'Database',
  'Fields',
  'Admin',
  'Rich-Text',
  'Lexical',
  'Live-Preview',
  'Access-Control',
  'Hooks',
  'Authentication',
  'Versions',
  'Upload',
  'GraphQL',
  'REST-API',
  'Local-API',
  'Queries',
  'Production',
  'Email',
  'TypeScript',
  'Plugins',
  'Examples',
  'Integrations',
  'Cloud',
]

export default async function DocsPage({ params }: { params: { topic: string; doc: string } }) {
  const topics = await fetchDocs(topicOrder, 'beta')

  return (
    <RenderDocs params={params} topics={topics} version={'beta'}>
      <Banner type="warning">
        <strong>Note:</strong> You are currently viewing the <strong>beta</strong> version of the
        docs. Some docs may be innacurate or incomplete at the moment.{' '}
        <Link href={'/docs'}>Switch to the latest version</Link>
      </Banner>
    </RenderDocs>
  )
}

export async function generateMetadata({ params: { topic: topicSlug, doc: docSlug } }) {
  const topics = await fetchDocs(topicOrder, 'beta')

  const topicIndex = topics.findIndex(topic => topic.slug.toLowerCase() === topicSlug)
  const docIndex = topics[topicIndex].docs.findIndex(
    doc => doc.slug.replace('.mdx', '') === docSlug,
  )

  const currentDoc = topics[topicIndex].docs[docIndex]

  return {
    title: `${currentDoc?.title ? `${currentDoc.title} | ` : ''}Documentation | Payload`,
    description: currentDoc?.desc || `Payload ${topicSlug} Documentation`,
    robots: 'noindex, nofollow, noarchive',
    openGraph: mergeOpenGraph({
      title: `${currentDoc?.title ? `${currentDoc.title} | ` : ''}Documentation | Payload`,
      url: `/docs/${topicSlug}/${docSlug}`,
      images: [
        {
          url: `/api/og?topic=${topicSlug}&title=${currentDoc?.title}`,
        },
      ],
    }),
  }
}
