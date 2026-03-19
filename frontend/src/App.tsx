import { ScrollBackground } from './components/ScrollBackground';
import { HorizontalGallery } from './components/HorizontalGallery';
import { FoldersSection } from './components/FoldersSection';
import { mockPhotos } from './data/mockPhotos';

function App() {
  return (
    <ScrollBackground>
      <nav className="fixed left-0 right-0 top-0 z-10 flex justify-between px-6 py-4">
        <span className="text-[10px] tracking-widest text-black/90">
          vino.mp4
        </span>
        <div className="flex gap-8">
          <a
            href="#gallery"
            className="text-[10px] tracking-widest text-black/70 hover:text-black"
          >
            GALLERY
          </a>
          <a
            href="#folders"
            className="text-[10px] tracking-widest text-black/70 hover:text-black"
          >
            FOLDERS
          </a>
        </div>
      </nav>
      <main>
        <section id="gallery" className="relative pt-16">
          <HorizontalGallery photos={mockPhotos} />
        </section>
        <section id="folders">
          <FoldersSection />
        </section>
      </main>
    </ScrollBackground>
  );
}

export default App;
