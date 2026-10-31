import { BeforeAfter } from './components/sections/BeforeAfter';
import { Contact } from './components/sections/Contact';
import { Faq } from './components/sections/Faq';
import { Features } from './components/sections/Features';
import { Footer } from './components/sections/Footer';
import { Hero } from './components/sections/Hero';
import { HowItWorks } from './components/sections/HowItWorks';
import { Mobile } from './components/sections/Mobile';
import { Nav } from './components/sections/Nav';
import { Ownership } from './components/sections/Ownership';
import { Roles } from './components/sections/Roles';
import { ScrollProgress } from './components/ui/ScrollProgress';

export default function App() {
  return (
    <>
      <ScrollProgress />
      <Nav />
      <main>
        <Hero />
        <BeforeAfter />
        <Features />
        <Roles />
        <HowItWorks />
        <Mobile />
        <Ownership />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
