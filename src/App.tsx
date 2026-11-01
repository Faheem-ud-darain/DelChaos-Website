import { BeforeAfter } from './components/sections/BeforeAfter';
import { Contact } from './components/sections/Contact';
import { Faq } from './components/sections/Faq';
import { Features } from './components/sections/Features';
import { Footer } from './components/sections/Footer';
import { Hero } from './components/sections/Hero';
import { HowItWorks } from './components/sections/HowItWorks';
import { Mobile } from './components/sections/Mobile';
import { Nav } from './components/sections/Nav';
import { Problems } from './components/sections/Problems';
import { Ownership } from './components/sections/Ownership';
import { Roles } from './components/sections/Roles';
import { ScrollProgress } from './components/ui/ScrollProgress';
import { StackPane } from './components/ui/StackPane';
import { useStackAnchors } from './hooks/useStack';

const LAYERS = [
  ['top', Hero],
  ['problem', BeforeAfter],
  ['features', Features],
  ['solutions', Problems],
  ['roles', Roles],
  ['how', HowItWorks],
  ['mobile', Mobile],
  ['ownership', Ownership],
  ['faq', Faq],
] as const;

/** Each section sticks and the next one slides over it, until the closing Contact section, after which the page scrolls freely to the footer. */
export default function App() {
  useStackAnchors();
  return (
    <>
      <ScrollProgress />
      <Nav />
      <main>
        {LAYERS.map(([target, Layer], i) => (
          <StackPane key={target} target={target} layer={i + 1}><Layer /></StackPane>
        ))}
        <StackPane target="contact" layer={LAYERS.length + 1} sticky={false}><Contact /></StackPane>
      </main>
      <Footer />
    </>
  );
}
