<<<<<<< HEAD
<<<<<<< HEAD
# Graphician Studios

A 5-page React site for a digital Creations  & ads creation studio, with a
different 3D scroll-driven animation on every page (react-three-fiber +
framer-motion). Built with Vite.

## Run it

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build -> dist/
npm run preview   # preview the production build
```

Requires Node 18+.

## Structure

```
src/
  App.jsx              routes + page transitions
  index.css             design tokens (colors, type, spacing) — edit here first
  components/           Navbar, Footer, Loader, ScrollToTop
  hooks/
    useScrollProgress.js   whole-page scroll progress (0→1), ref-based
    useSectionProgress.js  progress of one element through the viewport
  pages/                 Home, Service, Portfolio, About, Contact + their .css
  three/                 one Canvas scene per page:
    HomeScene.jsx         "Idea Core" — icosahedron that fractures into
                           shards as you scroll, camera dollies in
    ServiceScene.jsx      rotating hex carousel of 6 service panels,
                           synced to a DOM caption via useSectionProgress
    PortfolioScene.jsx    camera flies down a corridor of project
                           billboards, one per scroll segment
    AboutScene.jsx        a signal line draws itself across a timeline,
                           lighting up milestone markers as it passes them
    ContactScene.jsx      a scattered particle field converges into a
                           glowing beacon as you approach the form
```

Each `*Scene.jsx` is a self-contained `<Canvas>` mounted as a fixed,
full-viewport background (`.canvas-fixed`) for its page only, so switching
routes swaps the whole animation rather than reusing one global scene.

## Editing content

- **Logo / brand name**: `src/components/Navbar.jsx`
- **Copy, services, portfolio items, milestones, FAQ**: top of each file in
  `src/pages/`
- **Colors / fonts**: CSS variables at the top of `src/index.css`
- **Contact form**: `src/pages/Contact.jsx` — the submit handler currently
  simulates a send with `setTimeout`. Point it at a real endpoint (a
  serverless function, Formspree, etc.) before going live.

## Notes

- `prefers-reduced-motion` is respected for CSS transitions/animations.
- 3D scenes are capped at `dpr={[1, 1.6]}` to keep them light on mobile.
- No backend is included — this is a static front end, deployable to any
  static host (Vercel, Netlify, GitHub Pages, S3, etc.) after `npm run build`.
=======
# graphician-studio
Static Website
>>>>>>> 455f3b3d26505bdcba82f139bf24117b91f0e7db
=======
# graphician-studio
Static Website
>>>>>>> 455f3b3d26505bdcba82f139bf24117b91f0e7db
