# Personal Portfolio Site

Personal portfolio for Yago Romano, built with [Astro](https://astro.build) and React/TypeScript islands. Showcases projects pulled from GitHub, a resume download, and links to contact info.

## Stack

- **Astro** for the static shell, only two components hydrate as client-side JavaScript
- **React + TypeScript** for the dark mode toggle and the filterable project grid
- Plain CSS with custom properties for theming, no CSS framework

## Features

- Dark mode by default, with a toggle that persists across visits
- Project cards pulled from a single data file, tag-filterable
- One-click resume download, with a script to re-sync the PDF from its source when it's updated
- No backend, no database, fully static

## Running locally

```sh
npm install
npm run dev
```

Then open `http://localhost:4321`.

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the local dev server |
| `npm run build` | Builds the production site to `./dist/` |
| `npm run preview` | Serves the production build locally |
| `npm run sync-resume` | Copies the latest resume PDF into `public/resume/` |

## License

The code in this repository is MIT licensed, see [LICENSE](./LICENSE). Personal content (resume, bio, project descriptions, name and likeness) is not covered by that license and remains all rights reserved.
