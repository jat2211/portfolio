import { Archive } from './components/Archive';
import { About } from './components/About';
import { Blob } from './components/Blob';
import { CustomCursor } from './components/CustomCursor';
import { DarkroomEffects } from './components/DarkroomEffects';
import { Hero } from './components/Hero';
import { GalleryHeader } from './components/GalleryHeader';
import { Gallery } from './components/Gallery';
import { featuredPhoto, galleryPhotos } from './data/mockPhotos';

function App() {
  return (
    <div className="min-h-full bg-black text-white darkroom:bg-[#0a0000] darkroom:text-red-100">
      <CustomCursor />
      <DarkroomEffects />
      <nav className="fixed left-0 right-0 top-0 z-30 flex items-center justify-between px-6 py-4 text-white darkroom:text-red-100">
        <div className="whitespace-nowrap">
          <span className="text-sm font-medium tracking-widest text-white sm:text-base darkroom:text-red-100">
            @vino.mp4
          </span>
        </div>
        <div className="flex gap-4 sm:gap-8">
          <a
            href="#hero"
            className="text-sm font-medium tracking-widest text-white hover:text-white/90 sm:text-base darkroom:text-red-200 darkroom:hover:text-red-50"
          >
            Featured Work
          </a>
          <a
            href="#archive"
            className="text-sm font-medium tracking-widest text-white hover:text-white/90 sm:text-base darkroom:text-red-200 darkroom:hover:text-red-50"
          >
            Archive
          </a>
        </div>
      </nav>
      <main className="relative">
        {/* Fixed hero: stays put while content below scrolls over it (scroll-over / curtain reveal). */}
        <div className="pointer-events-none fixed inset-0 z-0">
          <Hero photo={featuredPhoto} />
        </div>
        {/* In-flow height so the page can scroll past the viewport while the hero stays fixed. */}
        <div id="hero" className="h-[100dvh] shrink-0" aria-hidden />
        <div className="relative z-10 bg-black darkroom:bg-[#0a0000]">
          <GalleryHeader />
          {/* Gallery scrolls in full; no negative margin here so the mosaic does not keep moving under the curtain. */}
          <section id="gallery" className="relative">
            <Gallery photos={galleryPhotos} />
          </section>
          <div className="relative">
            <div className="relative z-10">
              <Blob />
            </div>
            {/* Archive pulls up sooner (~118dvh) so it overlaps while curtains are still opening. */}
            <div className="relative z-20 -mt-[min(175dvh,175svh)]">
              <Archive />
            </div>
          </div>
          <About />
        </div>
      </main>
    </div>
  );
}

export default App;
