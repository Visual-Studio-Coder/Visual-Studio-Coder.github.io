import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const username = 'Visual-Studio-Coder'
const scriptDirectory = dirname(fileURLToPath(import.meta.url))
const reposOutputPath = resolve(scriptDirectory, '../src/github-repos.json')
const statsOutputPath = resolve(scriptDirectory, '../src/github-stats.json')
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

async function fetchMergedPullRequestCount() {
  const query = encodeURIComponent(`author:${username} is:pr is:merged`)
  const response = await fetch(
    `https://api.github.com/search/issues?q=${query}&per_page=1`,
    { headers },
  )

  if (!response.ok) {
    throw new Error(`GitHub returned ${response.status}: ${await response.text()}`)
  }

  const result = await response.json()
  return result.total_count
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

const stats = {
  merged_pull_requests: await fetchMergedPullRequestCount(),
}

await mkdir(dirname(reposOutputPath), { recursive: true })
await writeFile(reposOutputPath, `${JSON.stringify(snapshot, null, 2)}\n`)
await writeFile(statsOutputPath, `${JSON.stringify(stats, null, 2)}\n`)
console.log(`Synced ${snapshot.length} public repositories to ${reposOutputPath}`)
console.log(`Synced GitHub profile statistics to ${statsOutputPath}`)
