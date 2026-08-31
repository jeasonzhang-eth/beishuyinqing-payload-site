import { getSiteData } from '@/lib/site/data'
import { localizePath } from '@/lib/site/routes'

export async function GET() {
  const data = await getSiteData()
  const projectLines = data.projects
    .map(
      (project) =>
        `- ${project.title} (${project.language.toUpperCase()}): ${data.settings.siteUrl}${localizePath(project.language, `projects/${project.slug}`)}`,
    )
    .join('\n')
  const serviceLines = data.services
    .map(
      (service) =>
        `- ${service.title} (${service.language.toUpperCase()}): ${data.settings.siteUrl}${localizePath(service.language, 'services')}#${service.slug}`,
    )
    .join('\n')
  const noteLines = data.notes
    .map(
      (note) =>
        `- ${note.title} (${note.language.toUpperCase()}): ${data.settings.siteUrl}${localizePath(note.language, `notes/${note.slug}`)}`,
    )
    .join('\n')
  const body = [
    `# ${data.settings.shortNameZh} / ${data.settings.shortNameEn}`,
    '',
    `> ${data.settings.llmsDescription}`,
    '',
    '## Primary pages',
    `- English home: ${data.settings.siteUrl}/en/`,
    `- Chinese home: ${data.settings.siteUrl}/zh/`,
    `- Services (EN): ${data.settings.siteUrl}/en/services/`,
    `- Services (ZH): ${data.settings.siteUrl}/zh/services/`,
    `- Company (EN): ${data.settings.siteUrl}/en/company/`,
    `- Company (ZH): ${data.settings.siteUrl}/zh/company/`,
    '',
    '## Services',
    serviceLines,
    '',
    '## Projects',
    projectLines,
    '',
    '## Notes',
    noteLines,
    '',
    '## Verified company facts',
    `- Legal name: ${data.settings.legalNameZh} / ${data.settings.legalNameEn}`,
    `- Phone: ${data.settings.phoneDisplay}`,
    `- Address: ${data.settings.addressZh}`,
    `- ICP: ${data.settings.icpNumber}`,
    '',
  ].join('\n')

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
