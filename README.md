# Vaibhav Satishkumar Portfolio

This repository contains my personal website. It presents my open-source software, technical work, and contact links.

![Website preview](public/og.png)

## Main Features

- A responsive portfolio interface
- Featured project cards
- A searchable project index
- Project filters for Apple, AI and research, developer tools, and experiments
- Daily GitHub repository and profile statistics
- Automatic deployment to GitHub Pages

## Technology

- React 19
- Vite 6
- JavaScript
- CSS
- GitHub Actions
- GitHub Pages

## Run the Website Locally

Requirements:

- Node.js 22 or a compatible version
- npm

Install the dependencies:

```sh
npm ci
```

Start the local development server:

```sh
npm run dev
```

Open the local address that Vite shows in the terminal.

## Build and Check

Create the production build:

```sh
npm run build
```

Check the source files:

```sh
npm run lint
```

## GitHub Data Update

The website reads project data from JSON files in `src/`. The daily GitHub Actions job runs `scripts/sync-projects.mjs`. This script updates public repository data and the merged pull-request count.

The job also runs when code is pushed to `main`. It builds the website and publishes the `dist/` output to GitHub Pages.

## Privacy

The website contains public professional information and public GitHub repository data. The update script reads public GitHub data. It does not add private repository data to the website.

## License

This project uses the MIT License. See [LICENSE](LICENSE).
