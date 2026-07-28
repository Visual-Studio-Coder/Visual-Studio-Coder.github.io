import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const username = 'Visual-Studio-Coder'
const scriptDirectory = dirname(fileURLToPath(import.meta.url))
const outputPath = resolve(scriptDirectory, '../src/github-repos.json')
const token = process.env.GITHUB_TOKEN

const headers = {
  Accept: 'application/vnd.github+json',
  'User-Agent': 'visual-studio-coder-portfolio-sync',
  'X-GitHub-Api-Version': '2022-11-28',
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
}

async function fetchPage(page) {
  const response = await fetch(
    `https://api.github.com/users/${username}/repos?type=public&sort=updated&per_page=100&page=${page}`,
    { headers },
  )

  if (!response.ok) {
    throw new Error(`GitHub returned ${response.status}: ${await response.text()}`)
  }

  return response.json()
}

const repos = []
for (let page = 1; ; page += 1) {
  const batch = await fetchPage(page)
  repos.push(...batch)
  if (batch.length < 100) break
}

const snapshot = repos.map((repo) => ({
  name: repo.name,
  description: repo.description?.replaceAll('\u2014', ' - ') ?? null,
  html_url: repo.html_url,
  homepage: repo.homepage,
  language: repo.language,
  topics: repo.topics,
  stargazers_count: repo.stargazers_count,
  forks_count: repo.forks_count,
  fork: repo.fork,
  archived: repo.archived,
  updated_at: repo.updated_at,
  pushed_at: repo.pushed_at,
}))

await mkdir(dirname(outputPath), { recursive: true })
await writeFile(outputPath, `${JSON.stringify(snapshot, null, 2)}\n`)
console.log(`Synced ${snapshot.length} public repositories to ${outputPath}`)
