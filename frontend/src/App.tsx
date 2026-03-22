import { ScrollBackground } from './components/ScrollBackground';
import { FeaturedHero } from './components/FeaturedHero';
import { StaggeredGallery } from './components/StaggeredGallery';
import { FoldersSection } from './components/FoldersSection';
import { featuredPhoto, galleryPhotos } from './data/mockPhotos';

function App() {
  return (
    <ScrollBackground>
      <nav className="fixed left-0 right-0 top-0 z-10 flex justify-between px-6 py-4 mix-blend-difference">
        <span className="text-[10px] tracking-widest text-white">
          vino.mp4
        </span>
        <div className="flex gap-8">
          <a
            href="#hero"
            className="text-[10px] tracking-widest text-white/80 hover:text-white"
          >
            GALLERY
          </a>
          <a
            href="#folders"
            className="text-[10px] tracking-widest text-white/80 hover:text-white"
          >
            FOLDERS
          </a>
        </div>
      </nav>
      <main>
        <section id="hero" className="relative">
          <FeaturedHero photo={featuredPhoto} />
        </section>
        <section id="scroll-dark-phase" className="relative">
          <StaggeredGallery photos={galleryPhotos} />
        </section>
        <section id="folders">
          <FoldersSection />
        </section>
      </main>
    </ScrollBackground>
  );
}

export default App;
