import { FeaturedHero } from './components/FeaturedHero';
import { FeaturedWorkHeader } from './components/FeaturedWorkHeader';
import { StaggeredGallery } from './components/StaggeredGallery';
import { FoldersSection } from './components/FoldersSection';
import { featuredPhoto, galleryPhotos } from './data/mockPhotos';

function App() {
  return (
    <div className="min-h-full bg-black text-white">
      <nav className="fixed left-0 right-0 top-0 z-30 flex justify-between px-6 py-4 text-white">
        <span className="text-sm font-medium tracking-widest sm:text-base">
          vino.mp4
        </span>
        <div className="flex gap-8">
          <a
            href="#hero"
            className="text-sm font-medium tracking-widest text-white hover:text-white/90 sm:text-base"
          >
            GALLERY
          </a>
          <a
            href="#folders"
            className="text-sm font-medium tracking-widest text-white hover:text-white/90 sm:text-base"
          >
            FOLDERS
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
          <section id="stagger" className="relative">
            <StaggeredGallery photos={galleryPhotos} />
          </section>
          <section id="folders">
            <FoldersSection />
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
