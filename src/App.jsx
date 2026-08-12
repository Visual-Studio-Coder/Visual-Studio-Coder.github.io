import { useEffect, useMemo, useRef, useState } from 'react'
import snapshotRepos from './github-repos.json'
import snapshotStats from './github-stats.json'
import './App.css'

const FEATURED_REPOS = [
  'polytrack-java',
  'EvoLoRA',
  'QR-Share-Pro',
  'Recap',
  'mnist_linux_benchmark',
  'youtube-titlegen',
]

const PROJECT_LINKS = {
  'QR-Share-Pro': {
    label: 'App Store',
    url: 'https://apps.apple.com/app/apple-store/id6479589995',
  },
  Recap: {
    label: 'Watch demo',
    url: 'https://www.youtube.com/watch?v=HSrOVvkOAQ0',
  },
  mnist_linux_benchmark: {
    label: 'Read paper',
    url: 'https://doi.org/10.36227/techrxiv.175295288.85168709/v1',
  },
  EvoLoRA: {
    label: 'Watch demo',
    url: 'https://youtu.be/4lz4LjBrG7I',
  },
  'autolab-for-lynbrook-high-school': {
    label: 'Marketplace',
    url: 'https://marketplace.visualstudio.com/items?itemName=Visual-Studio-Coder.autolab-for-lynbrook-high-school',
  },
}

const FILTERS = ['All', 'Apple', 'AI + Research', 'Developer Tools', 'Experiments']

const SOCIAL_LINKS = [
  ['GitHub', 'https://github.com/Visual-Studio-Coder'],
  ['App Store', 'https://apps.apple.com/us/developer/vaibhav-satishkumar/id1602110086'],
  ['Raycast', 'https://www.raycast.com/Visual-Studio-Coder'],
  ['Hugging Face', 'https://huggingface.co/Visual-Studio-Coder'],
  ['Email', 'mailto:vsdev@duck.com'],
]

const PRINCIPLES = [
  ['01', 'Useful beats impressive.', 'The best software quietly deletes friction from somebody’s day.'],
  ['02', 'Curiosity is a stack.', 'Swift today. Model training tomorrow. Datagram sockets after dinner.'],
  ['03', 'Open source the proof.', 'Ideas become more valuable when other people can inspect, remix, and improve them.'],
]

function categoryFor(repo) {
  const haystack = `${repo.name} ${repo.description ?? ''} ${(repo.topics ?? []).join(' ')}`.toLowerCase()

  if (
    repo.language === 'Swift' ||
    repo.language === 'Objective-C' ||
    /ios|macos|apple watch|swiftui|widgetkit|app store/.test(haystack)
  ) return 'Apple'

  if (
    repo.language === 'Python' ||
    /ai|llm|model|machine|mnist|research|gemini|lora/.test(haystack)
  ) return 'AI + Research'

  if (
    /raycast|vscode|autolab|sdk|cache|server|extension|developer/.test(haystack)
  ) return 'Developer Tools'

  return 'Experiments'
}

function cleanRepos(repos) {
  return repos
    .filter((repo) => !repo.fork && !repo.archived)
    .filter((repo) => !['Visual-Studio-Coder.github.io', 'visual-studio-coder'].includes(repo.name))
    .map((repo) => ({
      ...repo,
      description: repo.description?.replaceAll('\u2014', ' - ') ?? null,
      category: categoryFor(repo),
    }))
}

function formatRepoName(name) {
  if (name === 'mnist_linux_benchmark') return 'MNIST Systems Benchmark'
  if (name === 'youtube-titlegen') return 'YouTube TitleGen'
  return name.replaceAll('-', ' ').replaceAll('_', ' ')
}

function formatDate(date) {
  return new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric' }).format(new Date(date))
}

function SignalField() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame
    let width = 0
    let height = 0
    let time = 0
    const pointer = { x: 0.7, y: 0.28 }
    const points = Array.from({ length: 26 }, (_, index) => ({
      angle: (Math.PI * 2 * index) / 26,
      radius: 0.16 + (index % 7) * 0.018,
      speed: 0.0008 + (index % 5) * 0.00012,
    }))

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * ratio
      canvas.height = height * ratio
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
    }

    const move = (event) => {
      pointer.x = event.clientX / width
      pointer.y = event.clientY / height
    }

    const draw = () => {
      context.clearRect(0, 0, width, height)
      const centerX = width * (0.68 + (pointer.x - 0.5) * 0.025)
      const centerY = height * (0.31 + (pointer.y - 0.5) * 0.025)

      context.save()
      context.translate(centerX, centerY)
      context.rotate(-0.34)

      for (let ring = 0; ring < 6; ring += 1) {
        context.beginPath()
        context.ellipse(
          0,
          0,
          width * (0.13 + ring * 0.024),
          height * (0.035 + ring * 0.009),
          ring * 0.16 + time * 0.00004,
          0,
          Math.PI * 2,
        )
        context.strokeStyle = ring % 2 === 0 ? 'rgba(200, 255, 56, .12)' : 'rgba(123, 92, 255, .13)'
        context.lineWidth = 1
        context.stroke()
      }

      points.forEach((point, index) => {
        const angle = point.angle + time * point.speed
        const x = Math.cos(angle) * width * point.radius
        const y = Math.sin(angle) * height * point.radius * 0.28
        context.beginPath()
        context.arc(x, y, index % 4 === 0 ? 2.2 : 1.1, 0, Math.PI * 2)
        context.fillStyle = index % 3 === 0 ? '#c8ff38' : '#7b5cff'
        context.fill()
      })
      context.restore()

      if (!motionQuery.matches) {
        time += 1
        frame = window.requestAnimationFrame(draw)
      }
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', move, { passive: true })
    draw()

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', move)
    }
  }, [])

  return <canvas className="signal-field" ref={canvasRef} aria-hidden="true" />
}

function Arrow() {
  return <span aria-hidden="true">↗</span>
}

function ProjectCard({ repo, index }) {
  const extraLink = PROJECT_LINKS[repo.name] || (repo.homepage ? { label: 'Visit', url: repo.homepage } : null)

  return (
    <article className={`project-card project-card-${(index % 3) + 1}`}>
      <div className="project-card-topline">
        <span>{String(index + 1).padStart(2, '0')} / {repo.category}</span>
        <span className="project-updated">Updated {formatDate(repo.updated_at)}</span>
      </div>
      <div className="project-card-body">
        <div>
          <h3>{formatRepoName(repo.name)}</h3>
          <p>{repo.description || 'An open-source experiment currently taking shape.'}</p>
        </div>
        <div className="project-meta">
          <span className="language-dot" />
          <span>{repo.language || 'Multi-stack'}</span>
          <span>★ {repo.stargazers_count}</span>
          {repo.forks_count > 0 && <span>⑂ {repo.forks_count}</span>}
        </div>
      </div>
      <div className="project-actions">
        <a href={repo.html_url} target="_blank" rel="noreferrer">
          Source <Arrow />
        </a>
        {extraLink && (
          <a href={extraLink.url} target="_blank" rel="noreferrer">
            {extraLink.label} <Arrow />
          </a>
        )}
      </div>
    </article>
  )
}

function CommandDeck({ open, onClose, repos }) {
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    inputRef.current?.focus()
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [open, onClose])

  const results = repos
    .filter((repo) => `${repo.name} ${repo.description}`.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 6)

  if (!open) return null

  return (
    <div className="command-backdrop" role="presentation" onMouseDown={onClose}>
      <div className="command-deck" role="dialog" aria-modal="true" aria-label="Project command menu" onMouseDown={(event) => event.stopPropagation()}>
        <div className="command-input-wrap">
          <span>⌕</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search the lab..."
            aria-label="Search projects"
          />
          <kbd>ESC</kbd>
        </div>
        <div className="command-results">
          <span className="command-label">Jump to a project</span>
          {results.map((repo) => (
            <a key={repo.name} href={repo.html_url} target="_blank" rel="noreferrer" onClick={onClose}>
              <span>{formatRepoName(repo.name)}</span>
              <small>{repo.language || repo.category}</small>
              <Arrow />
            </a>
          ))}
          {results.length === 0 && <p className="empty-command">No signal found. Try another frequency.</p>}
        </div>
      </div>
    </div>
  )
}

function App() {
  const rootRef = useRef(null)
  const repos = useMemo(() => cleanRepos(snapshotRepos), [])
  const [filter, setFilter] = useState('All')
  const [archiveOpen, setArchiveOpen] = useState(false)
  const [commandOpen, setCommandOpen] = useState(false)

  useEffect(() => {
    const handleKey = (event) => {
      if ((event.key === 'k' && (event.metaKey || event.ctrlKey)) || event.key === '/') {
        if (event.target instanceof HTMLInputElement) return
        event.preventDefault()
        setCommandOpen(true)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  const featured = useMemo(() => {
    const selected = FEATURED_REPOS
      .map((name) => repos.find((repo) => repo.name.toLowerCase() === name.toLowerCase()))
      .filter(Boolean)
    return selected.length >= 4 ? selected : repos.slice(0, 6)
  }, [repos])

  const archive = useMemo(() => {
    const featuredNames = new Set(featured.map((repo) => repo.name))
    return repos
      .filter((repo) => !featuredNames.has(repo.name))
      .filter((repo) => filter === 'All' || repo.category === filter)
  }, [repos, featured, filter])

  const languages = useMemo(
    () => [...new Set(repos.map((repo) => repo.language).filter(Boolean))],
    [repos],
  )

  const stars = useMemo(
    () => repos.reduce((total, repo) => total + repo.stargazers_count, 0),
    [repos],
  )

  const handlePointerMove = (event) => {
    rootRef.current?.style.setProperty('--pointer-x', `${event.clientX}px`)
    rootRef.current?.style.setProperty('--pointer-y', `${event.clientY}px`)
  }

  return (
    <div className="site-shell" ref={rootRef} onPointerMove={handlePointerMove}>
      <SignalField />
      <div className="grain" aria-hidden="true" />
      <div className="cursor-light" aria-hidden="true" />

      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Back to top">
          <span className="wordmark-mark">VS</span>
          <span>Vaibhav Satishkumar</span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
        <button className="command-trigger" onClick={() => setCommandOpen(true)} aria-label="Open project search">
          <span>Search</span>
          <kbd>⌘ K</kbd>
        </button>
      </header>

      <main>
        <section className="hero" id="top">
          <div className="hero-kicker reveal">
            <span className="live-dot" />
            Building from California
            <span className="hero-kicker-divider">/</span>
            Open-source by default
          </div>

          <h1>
            <span>I make useful things</span>
            <span className="hero-line-accent">before they feel obvious.</span>
          </h1>

          <div className="hero-orbit" aria-hidden="true">
            <span className="orbit orbit-1" />
            <span className="orbit orbit-2" />
            <span className="orbit orbit-3" />
            <span className="orbit-core">VS</span>
          </div>

          <div className="hero-bottom">
            <p>
              I’m Vaibhav, an experimental software engineer turning daily annoyances into
              native apps, applied AI, developer tools, and open-source systems.
            </p>
            <div className="hero-actions">
              <a className="primary-cta" href="#work">Enter the lab <span>↓</span></a>
              <a className="text-link" href="https://github.com/Visual-Studio-Coder" target="_blank" rel="noreferrer">
                GitHub <Arrow />
              </a>
            </div>
          </div>

          <div className="hero-telemetry" aria-label="Portfolio statistics">
            <div><strong>{repos.length}</strong><span>Original public repos</span></div>
            <div><strong>{stars}</strong><span>Community stars</span></div>
            <div><strong>{languages.length}</strong><span>Languages in motion</span></div>
            <div><strong>{snapshotStats.merged_pull_requests}</strong><span>Merged pull requests</span></div>
          </div>
        </section>

        <section className="ticker" aria-label="Current areas of work">
          <div className="ticker-track">
            <span>Swift + SwiftUI</span><i>✦</i>
            <span>Applied AI</span><i>✦</i>
            <span>Developer Tools</span><i>✦</i>
            <span>Systems Research</span><i>✦</i>
            <span>Curious Experiments</span><i>✦</i>
            <span>Swift + SwiftUI</span><i>✦</i>
            <span>Applied AI</span><i>✦</i>
            <span>Developer Tools</span><i>✦</i>
            <span>Systems Research</span><i>✦</i>
            <span>Curious Experiments</span><i>✦</i>
          </div>
        </section>

        <section className="work-section" id="work">
          <div className="section-heading">
            <div>
              <span className="section-index">01 / Selected transmissions</span>
              <h2>Built because<br />it needed to exist.</h2>
            </div>
            <div className="sync-status">
              <span className="sync-dot" />
              <span>
                Daily GitHub snapshot
                <small>Names, copy, stars, and new public repos refresh every 24 hours.</small>
              </span>
            </div>
          </div>

          <div className="featured-grid">
            {featured.map((repo, index) => (
              <ProjectCard key={repo.name} repo={repo} index={index} />
            ))}
          </div>

          <div className="archive">
            <div className="archive-header">
              <div>
                <span className="section-index">The full frequency range</span>
                <h3>Open-source archive</h3>
              </div>
              <button onClick={() => setArchiveOpen((value) => !value)} aria-expanded={archiveOpen}>
                {archiveOpen ? 'Collapse index' : `Explore ${repos.length - featured.length} more`}
                <span>{archiveOpen ? '−' : '+'}</span>
              </button>
            </div>

            {archiveOpen && (
              <div className="archive-content">
                <div className="filter-row" role="group" aria-label="Filter projects">
                  {FILTERS.map((item) => (
                    <button
                      key={item}
                      className={filter === item ? 'active' : ''}
                      onClick={() => setFilter(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
                <div className="archive-list">
                  {archive.map((repo, index) => (
                    <a key={repo.name} href={repo.html_url} target="_blank" rel="noreferrer" className="archive-row">
                      <span className="archive-number">{String(index + 1).padStart(2, '0')}</span>
                      <strong>{formatRepoName(repo.name)}</strong>
                      <span>{repo.category}</span>
                      <span>{repo.language || 'Multi-stack'}</span>
                      <span>★ {repo.stargazers_count}</span>
                      <Arrow />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="about-section" id="about">
          <div className="about-intro">
            <span className="section-index">02 / Operating system</span>
            <p>
              Rapid prototyper.<br />
              Open-source developer.<br />
              <em>Skilled artisan.</em>
            </p>
          </div>

          <div className="about-copy">
            <p>
              I build across layers because the problem decides the stack. That has meant privacy-first
              iOS apps, an Apple Watch Mac controller, a fine-tuned language model, scalable autograding
              infrastructure, a C++ / Rust / Python energy benchmark, and a voice-controlled snake game.
            </p>
            <p>
              The common thread is obsessive usefulness, strong product taste, and a willingness to learn
              whatever makes the idea real.
            </p>
            <span className="anti-vibe">NO VIBES WITHOUT CRAFT.</span>
          </div>

          <div className="principles">
            {PRINCIPLES.map(([number, title, copy]) => (
              <article key={number}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="stack-section">
          <div className="stack-heading">
            <span className="section-index">03 / Toolchain</span>
            <h2>Polyglot on purpose.</h2>
          </div>
          <div className="stack-cloud">
            {[
              'Swift', 'SwiftUI', 'Python', 'PyTorch', 'Java', 'TypeScript', 'React',
              'C++', 'Rust', 'Kotlin', 'CloudKit', 'REST APIs', 'GitHub Actions',
              'Figma', 'Machine Learning', 'Systems Design',
            ].map((skill, index) => (
              <span key={skill} className={index % 5 === 0 ? 'accent' : ''}>{skill}</span>
            ))}
          </div>
        </section>

        <section className="contact-section" id="contact">
          <span className="section-index">04 / Open channel</span>
          <p className="contact-overline">Have an impossible idea?</p>
          <a className="contact-headline" href="mailto:vsdev@duck.com">
            Let’s make it<br /><span>embarrassingly real.</span>
          </a>
          <div className="contact-bottom">
            <p>Available for ambitious collaborations, research, and strange software.</p>
            <div className="social-links">
              {SOCIAL_LINKS.map(([label, url]) => (
                <a key={label} href={url} target={url.startsWith('mailto:') ? undefined : '_blank'} rel="noreferrer">
                  {label} <Arrow />
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer>
        <span>© {new Date().getFullYear()} Vaibhav Satishkumar</span>
        <span>Designed in code / Fed by GitHub</span>
        <a href="#top">Back to orbit ↑</a>
      </footer>

      <CommandDeck open={commandOpen} onClose={() => setCommandOpen(false)} repos={repos} />
    </div>
  )
}

export default App
