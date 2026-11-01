import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const root = document.getElementById('root')!

// No StrictMode: its development-only double mount releases the WebGL context that Lightfall gives up on cleanup, and the card then renders
// as a white wash in `npm run dev` (production is unaffected). The built page is prerendered, so hydrate it; the dev server serves an empty
// root and renders from scratch.
if (root.firstElementChild) hydrateRoot(root, <App />)
else createRoot(root).render(<App />)
