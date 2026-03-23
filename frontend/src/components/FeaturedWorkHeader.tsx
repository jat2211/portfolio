import { motion, useReducedMotion } from 'framer-motion';

export function FeaturedWorkHeader() {
  const reducedMotion = useReducedMotion();

  return (
    <motion.header
      className="flex flex-col gap-8 px-6 pb-12 pt-10 sm:flex-row sm:items-start sm:justify-between sm:gap-6"
      initial={reducedMotion ? false : { opacity: 0 }}
      whileInView={reducedMotion ? undefined : { opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className="space-y-2">
        <h2 className="text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">
          Featured Work
        </h2>
        <p className="text-lg text-neutral-500 sm:text-xl">{"'23 - '25"}</p>
      </div>
      <a
        href="#stagger"
        className="shrink-0 text-base font-medium tracking-wide text-white/80 transition-colors hover:text-white sm:pt-2 sm:text-lg"
      >
        {"See All Work ->"}
      </a>
    </motion.header>
  );
}
