# Lithos

The complete React and TypeScript source for [Lithos](https://lithos.bvdlaan.chatgpt.site/), built with Vite and Tailwind CSS.

## Run locally

Install Node.js 22 LTS, then run from the repository root:

```sh
npm ci
npm run dev
```

## Production build

```sh
npm run build
```

Deploy the contents of `dist/` to a static host. Relative asset paths support both a domain root and a subdirectory such as `/Lithos/`. Do not serve the TypeScript source directly. The `dist/` directory and `node_modules/` are generated and excluded from Git; the lockfile pins dependencies for repeatable installation.

The two original landscape images and favicon are included in `public/`. Fonts are loaded from Google Fonts and fall back to system fonts if unavailable. No API keys, environment variables, database, or backend service are required.

## Project structure

- `src/`: React UI, interactions, and styles.
- `public/`: bundled landscape images and favicon.
- `index.html`: page metadata and application entry point.
- `vite.config.ts`, `tsconfig.json`, `tailwind.config.js`, `postcss.config.js`: build configuration.
- `.openai/hosting.json`: existing Sites project association; other static hosts do not require it.

The site preserves the original spotlight interaction, mobile menu, and dialogs. Registration and several navigation sections display coming-soon messages in the original design.

## Image provenance

The bundled `layer-1.webp` and `layer-2.webp` are copies of the images referenced by the original site, downloaded from its existing `images.higgs.ai` image URLs. This repository does not grant additional rights to those images.
