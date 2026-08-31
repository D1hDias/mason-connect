import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// Order matters: neither stylesheet uses CSS `@layer`, so for classes that
// exist in both (e.g. plain `.flex`, from design-system's own component
// markup) the browser breaks the specificity tie by document order — the
// later file wins. `./index.css` must load LAST so the app's own responsive
// utilities (`md:hidden`, `hidden md:flex` in `src/shell/`) always beat
// design-system's precompiled unconditional utility classes of the same
// specificity, instead of losing to them regardless of viewport width.
import 'mason-connect-design-system/dist/styles.css';
import './index.css';
import '@fontsource/ibm-plex-sans/400.css';
import '@fontsource/ibm-plex-sans/600.css';
import '@fontsource/ibm-plex-sans/700.css';

import { App } from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('#root element not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
