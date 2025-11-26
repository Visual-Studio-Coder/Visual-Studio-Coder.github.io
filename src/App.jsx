import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import projectsData from './projects.json';
import './App.css';

function App() {
  const panelRef = useRef(null);
  const [githubStats, setGithubStats] = useState({});

  useEffect(() => {
    const tl = gsap.timeline();

    tl.fromTo(panelRef.current, 
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: "power3.out" }
    );
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      const stats = {};
      for (const project of projectsData) {
        if (project.urls) {
          const githubUrl = project.urls.find(url => url.includes('github.com'));
          if (githubUrl) {
            try {
              const parts = githubUrl.split('github.com/')[1].split('/');
              const owner = parts[0];
              const repo = parts[1];
              
              const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
              if (response.ok) {
                const data = await response.json();
                stats[project.name] = { stars: data.stargazers_count, forks: data.forks_count };
              }
            } catch (error) {
              console.error("Failed to fetch stats for", project.name, error);
            }
          }
        }
      }
      setGithubStats(stats);
    };

    fetchStats();
  }, []);

  // Group projects by category
  const projectsByCategory = projectsData.reduce((acc, project) => {
    if (!acc[project.category]) {
      acc[project.category] = [];
    }
    acc[project.category].push(project);
    return acc;
  }, {});

  return (
    <div className="app-container">
      <div className="glass-panel" ref={panelRef}>
        <header className="header">
          <div className="logo-container">
            <img src="/logo.png" alt="Visual Studio Coder Logo" className="logo-img" />
            <div className="logo-text">VISUALSTUDIOCODER</div>
          </div>
          <nav className="nav-links">
            <a href="#about">About</a>
            <a href="#projects">Projects</a>
            <a href="#skills">Skills</a>
            <a href="#connect">Connect</a>
          </nav>
        </header>

        <main>
          <div className="hero-text">
            A personal mission to accelerate digital innovation, <span>strengthen user experiences, and drive creative engineering.</span>
          </div>

          <div className="divider"></div>

          <div id="about" className="content-row">
            <div className="row-label">About</div>
            <div className="row-content">
              I build high-quality, modern, scalable, and open-source solutions to solve problems I face in my daily life. Even if the task is only a few seconds long, I’m willing to spend 10 hours automating it.
            </div>
          </div>

          <div className="divider"></div>

          <div id="projects" className="content-row">
            <div className="row-label">Projects</div>
            <div className="row-content">
              {Object.entries(projectsByCategory).map(([category, projects]) => (
                <div key={category} className="project-category">
                  <h4 className="category-title">{category}</h4>
                  {projects.map((project, index) => (
                    <div key={index} className="project-item">
                      <div className="project-header">
                        <h3>{project.name}</h3>
                        {project.urls && (
                          <div className="project-links">
                            {project.urls.map((url, i) => {
                              const isGithub = url.includes('github');
                              const stats = isGithub ? githubStats[project.name] : null;
                              return (
                                <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="project-link">
                                  {isGithub ? 'GitHub' : url.includes('youtube') ? 'Demo' : url.includes('doi') ? 'Paper' : url.includes('apps.apple.com') ? 'App Store' : 'Link'}
                                  {stats && (
                                    <span className="stats-badge">
                                      <span className="stat-item">★ {stats.stars}</span>
                                      <span className="stat-item">⑂ {stats.forks}</span>
                                    </span>
                                  )}
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M7 17L17 7" />
                                    <path d="M7 7h10v10" />
                                  </svg>
                                </a>
                              );
                            })}
                          </div>
                        )}
                      </div>
                      <p>{project.description}</p>
                      <div className="project-skills">
                        {project.skills.map((skill, i) => (
                          <span key={i} className="skill-tag">{skill}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
              
              <div className="show-more-container">
                <a href="https://github.com/Visual-Studio-Coder?tab=repositories" target="_blank" rel="noopener noreferrer" className="show-more-link">
                  Show More Projects
                </a>
              </div>
            </div>
          </div>

          <div className="divider"></div>

          <div id="skills" className="content-row">
            <div className="row-label">Skills</div>
            <div className="row-content skills-grid">
              <span>Java</span>
              <span>Python</span>
              <span>Swift</span>
              <span>SwiftUI</span>
              <span>UIKit</span>
              <span>JavaScript, TypeScript</span>
              <span>SQL</span>
              <span>MongoDB</span>
              <span>Systems Design</span>
              <span>UI/UX Design</span>
              <span>Automation</span>
              <span>Prompt Engineering</span>
              <span>Figma</span>
              <span>Git + GitHub</span>
              <span>GitHub Copilot</span>
            </div>
          </div>

          <div className="divider"></div>

          <div id="connect" className="content-row">
            <div className="row-label">Connect</div>
            <div className="row-content connect-links">
              <a href="mailto:vsdev@duck.com" target="_blank" rel="noopener noreferrer" className="connect-link">
                Email
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 17L17 7" />
                  <path d="M7 7h10v10" />
                </svg>
              </a>
              <a href="https://github.com/visual-studio-coder" target="_blank" rel="noopener noreferrer" className="connect-link">
                GitHub
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 17L17 7" />
                  <path d="M7 7h10v10" />
                </svg>
              </a>
              <a href="https://apps.apple.com/us/developer/satish-kumar-kashi-visvanathan/id1826186789" target="_blank" rel="noopener noreferrer" className="connect-link">
                App Store
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 17L17 7" />
                  <path d="M7 7h10v10" />
                </svg>
              </a>
              <a href="https://www.raycast.com/Visual-Studio-Coder" target="_blank" rel="noopener noreferrer" className="connect-link">
                Raycast
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 17L17 7" />
                  <path d="M7 7h10v10" />
                </svg>
              </a>
              <a href="https://huggingface.co/Visual-Studio-Coder" target="_blank" rel="noopener noreferrer" className="connect-link">
                Hugging Face
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 17L17 7" />
                  <path d="M7 7h10v10" />
                </svg>
              </a>
              <a href="https://buymeacoffee.com/visualstudiocoder" target="_blank" rel="noopener noreferrer" className="connect-link">
                Buy Me a Coffee
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 17L17 7" />
                  <path d="M7 7h10v10" />
                </svg>
              </a>
            </div>
          </div>
        </main>

        <footer className="footer">
          <p>DESIGNED BY VISUAL-STUDIO-CODER • © 2025 Vaibhav Satishkumar</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
