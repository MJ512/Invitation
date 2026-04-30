# Wedding Invitation System

This refactor turns the invitation into a config-driven frontend system that opens directly in the browser with no build tooling.

## Structure

```text
wedd/
├── index.html
├── components/
│   ├── intro/
│   ├── hero/
│   ├── story/
│   ├── gallery/
│   ├── details/
│   └── closing/
├── config/
│   └── wedding.config.js
├── styles/
│   ├── variables.css
│   └── main.css
├── scripts/
│   ├── app.js
│   ├── utils.js
│   ├── animation.js
│   └── audio.js
├── assets/
│   ├── audio/
│   ├── images/
│   └── videos/
└── README.md
```

## How It Works

- `config/wedding.config.js` holds all editable content and media references.
- Each component folder contains:
  - `*.html`: the structural blueprint for the section
  - `*.css`: section-specific styling
  - `*.js`: runtime rendering and behavior
- `scripts/app.js` mounts all sections into `index.html`.
- `scripts/animation.js` centralizes reveal, parallax, and marquee motion.
- `styles/variables.css` defines the shared glass system and design tokens.

## Browser-First Note

Because the invitation is meant to run by opening `index.html` directly, the runtime does not fetch HTML partials from disk. Browsers commonly block local-file fetches. Instead, each component ships with a matching HTML blueprint file and an equivalent JS template used for direct browser rendering.

## Customizing Content

Update only `config/wedding.config.js` for:

- couple names and monogram
- intro copy and video sources
- event date, time, and venue
- story timeline entries
- details cards
- gallery images and captions
- closing message and decorative symbols

## Media

- Replace the SVG artwork in `assets/images/` with real photos whenever ready.
- Add real intro video files to `assets/videos/` and keep the same paths, or update the config sources.
- The intro already supports poster fallback, and gallery/story media fall back gracefully if a source is missing.
