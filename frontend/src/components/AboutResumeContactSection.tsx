import { HalftoneDots } from '@paper-design/shaders-react';

const PORTRAIT_IMAGE_PATH = '/artist/portrait.jpg';

export function AboutResumeContactSection() {
  return (
    <section
      id="about-resume-contact"
      className="relative bg-[#f2f1e8] pb-24 pt-16 text-neutral-950 md:pb-32 md:pt-20"
      aria-label="About, resume, and contact"
    >
      <div className="mx-auto max-w-[min(96rem,calc(100%-2rem))] px-4 md:px-6">
        <div className="flex flex-col gap-10 md:grid md:grid-cols-12 md:gap-x-10 md:gap-y-12">
          <aside className="md:col-span-5">
            <div className="md:sticky md:top-8 md:max-h-[calc(100dvh-2rem)] md:overflow-y-auto">
              <div className="relative md:-mt-8 md:-ml-4 overflow-hidden rounded-sm bg-[#f2f1e8]">
                <div className="pointer-events-none absolute inset-0 bg-[#f2f1e8]" aria-hidden />
                <div className="relative aspect-[4/5] w-full">
                  <HalftoneDots
                    width={560}
                    height={700}
                    image={PORTRAIT_IMAGE_PATH}
                    colorBack="#f2f1e8"
                    colorFront="#2b2b2b"
                    originalColors={false}
                    type="gooey"
                    grid="hex"
                    inverted={false}
                    size={0.81}
                    radius={1.01}
                    contrast={0.73}
                    grainMixer={0.13}
                    grainOverlay={0}
                    grainSize={0.6}
                    scale={1}
                    fit="contain"
                    className="h-full w-full"
                  />
                </div>
              </div>
            </div>
          </aside>

          <div className="space-y-12 md:col-span-7">
            <section aria-label="About summary">
              <p className="max-w-2xl text-4xl leading-tight tracking-tight text-neutral-800 sm:text-5xl md:text-6xl">
                <span className="font-black">Jay Trevino is a visual artist</span>{' '}
                focused on cinematic, emotionally precise media work. This
                archive and featured collection document ongoing projects across
                portraiture, motion, and editorial storytelling. Currently 
                documenting new media and featured collections @vino.mp4.
              </p>
            </section>

            <section aria-labelledby="contact-heading">
              <h3
                id="contact-heading"
                className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500"
              >
                Contact
              </h3>
              <ul className="flex flex-wrap items-center gap-3">
                <li>
                  <a
                    href="mailto:jayalexandertrevino@gmail.com"
                    aria-label="Email Jay"
                    className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-neutral-950 text-neutral-950 transition-colors hover:bg-neutral-950 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2"
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <rect x="3" y="5" width="18" height="14" rx="2" />
                      <path d="m4 7 8 6 8-6" />
                    </svg>
                    <span className="sr-only">Email Jay</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com/in/jayalexandertrevino/"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="LinkedIn profile"
                    className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-neutral-950 text-neutral-950 transition-colors hover:bg-neutral-950 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2"
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                      <path d="M6.94 8.5a1.44 1.44 0 1 1 0-2.88 1.44 1.44 0 0 1 0 2.88ZM5.7 9.7h2.5v8.6H5.7Zm4 0h2.4v1.18h.03c.33-.63 1.15-1.3 2.36-1.3 2.53 0 3 1.66 3 3.82v4.9h-2.5v-4.34c0-1.04-.02-2.37-1.44-2.37-1.44 0-1.66 1.13-1.66 2.3v4.41h-2.5Z" />
                    </svg>
                    <span className="sr-only">LinkedIn profile</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/jat2211"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="GitHub profile"
                    className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-neutral-950 text-neutral-950 transition-colors hover:bg-neutral-950 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2"
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                      <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.87c-2.78.61-3.37-1.18-3.37-1.18-.46-1.15-1.1-1.46-1.1-1.46-.9-.61.06-.6.06-.6 1 .07 1.53 1.03 1.53 1.03.88 1.52 2.32 1.08 2.88.82.09-.65.34-1.08.62-1.33-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.02-2.68-.1-.25-.44-1.28.1-2.66 0 0 .84-.27 2.75 1.02a9.54 9.54 0 0 1 5 0c1.91-1.3 2.75-1.02 2.75-1.02.54 1.38.2 2.41.1 2.66.64.7 1.02 1.6 1.02 2.68 0 3.84-2.34 4.68-4.57 4.93.35.31.66.92.66 1.86v2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
                    </svg>
                    <span className="sr-only">GitHub profile</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://instagram.com/vino.mp4"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Instagram profile"
                    className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-neutral-950 text-neutral-950 transition-colors hover:bg-neutral-950 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2"
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <rect x="3" y="3" width="18" height="18" rx="5" />
                      <circle cx="12" cy="12" r="4" />
                      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                    </svg>
                    <span className="sr-only">Instagram profile</span>
                  </a>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </section>
  );
}
