import { useState } from 'react';
import { motion, AnimatePresence, MotionValue, useTransform } from 'framer-motion';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const sections = [
  { id: '00', title: 'Title', fallbackProgress: 0 },
  { id: '01', title: 'Prelude', fallbackProgress: 0.15 },
  { id: '02', title: 'Career', fallbackProgress: 0.54 },
  { id: '03', title: "Director's Cut", fallbackProgress: 0.69 },
  { id: '04', title: 'Core Skills', fallbackProgress: 0.73 },
  { id: '05', title: 'Education', fallbackProgress: 0.77 },
  { id: '06', title: 'About Me', fallbackProgress: 1.0 },
];

interface TableOfContentsProps {
  progress: MotionValue<number>;
}

export default function TableOfContents({ progress }: TableOfContentsProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Background/Text tone switches across the global scroll range
  const bgColor = useTransform(
    progress,
    [0, 0.02, 0.05, 0.47, 0.49, 0.54, 0.72, 0.98, 1],
    ['#ffffff', '#ffffff', '#000000', '#000000', '#ffffff', '#000000', '#000000', '#ffffff', '#ffffff']
  );
  const textColor = useTransform(
    progress,
    [0, 0.02, 0.05, 0.47, 0.49, 0.54, 0.72, 0.98, 1],
    ['#000000', '#000000', '#ffffff', '#ffffff', '#000000', '#ffffff', '#ffffff', '#000000', '#000000']
  );
  const borderColor = useTransform(
    progress,
    [0, 0.02, 0.05, 0.47, 0.49, 0.54, 0.72, 0.98, 1],
    ['#000000', '#000000', '#ffffff', '#ffffff', '#000000', '#ffffff', '#ffffff', '#000000', '#000000']
  );

  const scrollToSection = (sectionId: string, fallbackProgress: number) => {
    let targetY: number | null = null;

    if (sectionId === '00') {
      targetY = 0;
    } else if (sectionId === '01') {
      const intro = document.getElementById('section-intro');
      if (intro) targetY = intro.offsetTop + intro.offsetHeight * 0.25;
    } else if (sectionId === '02') {
      const career = document.getElementById('section-career');
      if (career) targetY = career.offsetTop;
    } else if (sectionId === '03') {
      const trigger = ScrollTrigger.getById('horizontal-career-trigger');
      if (trigger) {
        // Panel 5 is at 4/5 of the horizontal pin progress
        targetY = trigger.start + (trigger.end - trigger.start) * (4 / 5);
      } else {
        const dc = document.getElementById('section-directors-cut');
        if (dc) targetY = dc.offsetTop;
      }
    } else if (sectionId === '04') {
      const trigger = ScrollTrigger.getById('horizontal-career-trigger');
      if (trigger) {
        // Panel 6 is at 5/5 of the horizontal pin progress
        targetY = trigger.start + (trigger.end - trigger.start) * (5 / 5);
      } else {
        const cs = document.getElementById('section-core-skills');
        if (cs) targetY = cs.offsetTop;
      }
    } else if (sectionId === '05') {
      const edu = document.getElementById('section-education');
      if (edu) targetY = edu.offsetTop + 100;
    } else if (sectionId === '06') {
      targetY = document.documentElement.scrollHeight - window.innerHeight;
    }

    if (targetY !== null && !isNaN(targetY)) {
      window.scrollTo({
        top: targetY,
        behavior: 'smooth',
      });
    } else {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo({
        top: scrollHeight * fallbackProgress,
        behavior: 'smooth',
      });
    }
    setIsOpen(false);
  };

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-6 right-6 z-[10000] mix-blend-difference text-white hover:scale-110 transition-transform pointer-events-auto"
        aria-label="Open Navigation"
      >
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="square"
        >
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* Slide-out Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[10000]"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{ backgroundColor: bgColor, borderLeftColor: borderColor }}
              className="fixed top-0 right-0 h-full w-[300px] max-w-[85vw] md:w-[400px] md:max-w-none border-l-4 z-[10001] shadow-2xl overflow-y-auto flex flex-col"
            >
              {/* Close Button */}
              <motion.div
                style={{ borderBottomColor: borderColor }}
                className="flex justify-between items-center p-6 border-b-4"
              >
                <motion.span
                  style={{ color: textColor }}
                  className="font-bold uppercase tracking-widest text-xl"
                >
                  Index
                </motion.span>
                <motion.button
                  onClick={() => setIsOpen(false)}
                  style={{ color: textColor }}
                  className="hover:rotate-90 transition-transform"
                >
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="square"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </motion.button>
              </motion.div>

              {/* Links */}
              <div className="flex flex-col">
                {sections.map((section) => (
                  <motion.button
                    key={section.id}
                    onClick={() => scrollToSection(section.id, section.fallbackProgress)}
                    initial={{ backgroundColor: 'transparent', color: textColor.get() }}
                    whileHover={{ backgroundColor: textColor.get(), color: bgColor.get() }}
                    style={{ borderBottomColor: borderColor, color: textColor }}
                    className="flex flex-col text-left px-6 py-5 border-b border-black/10 transition-colors"
                  >
                    <div className="flex items-baseline gap-4 pointer-events-none">
                      <span className="font-mono text-sm font-bold">{section.id}</span>
                      <span className="font-bold text-2xl uppercase tracking-tighter">
                        {section.title}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
