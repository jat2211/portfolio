import { AllVisualMediaArchive } from './components/AllVisualMediaArchive';
import { CurtainIntroSection } from './components/CurtainIntroSection';
import { FeaturedHero } from './components/FeaturedHero';
import { FeaturedWorkHeader } from './components/FeaturedWorkHeader';
import { FeaturedMedia } from './components/FeaturedMedia';
import { featuredPhoto, galleryPhotos } from './data/mockPhotos';

function App() {
  return (
    <div className="min-h-full bg-black text-white">
      <nav className="fixed left-0 right-0 top-0 z-30 flex justify-between px-6 py-4 text-white">
        <span className="text-sm font-medium tracking-widest sm:text-base">
          @vino.mp4
        </span>
        <div className="flex gap-8">
          <a
            href="#hero"
            className="text-sm font-medium tracking-widest text-white hover:text-white/90 sm:text-base"
          >
            Featured Work
          </a>
          <a
            href="#all-visual-media"
            className="text-sm font-medium tracking-widest text-white hover:text-white/90 sm:text-base"
          >
            Archive
          </a>
        </div>
      </nav>
      <main className="relative">
        {/* Fixed hero: stays put while content below scrolls over it (scroll-over / curtain reveal). */}
        <div className="pointer-events-none fixed inset-0 z-0">
          <FeaturedHero photo={featuredPhoto} />
        </div>
        {/* In-flow height so the page can scroll past the viewport while the hero stays fixed. */}
        <div id="hero" className="h-[100dvh] shrink-0" aria-hidden />
        <div className="relative z-10 bg-black">
          <FeaturedWorkHeader />
          {/* Gallery scrolls in full; no negative margin here so the mosaic does not keep moving under the curtain. */}
          <section id="stagger" className="relative z-10">
            <FeaturedMedia photos={galleryPhotos} />
          </section>
          <div className="relative">
            <div className="relative z-10">
              <CurtainIntroSection />
            </div>
            {/* Archive pulls up sooner (~118dvh) so it overlaps while curtains are still opening. */}
            <div className="relative z-20 -mt-[min(175dvh,175svh)]">
              <AllVisualMediaArchive />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
