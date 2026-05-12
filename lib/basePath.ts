// Mirrors the basePath in next.config.mjs so we can build static URLs (e.g. for public/ assets)
// that work both locally and when deployed to GitHub Pages.
export const basePath = process.env.NODE_ENV === 'production' ? '/cold-calling-trainer' : '';
