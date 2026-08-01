import { useState } from 'react';
import { motion, AnimatePresence, MotionValue, useTransform } from 'framer-motion';

const sections = [
  { id: '00', title: 'Title', progress: 0 },
  { id: '01', title: 'Prelude', progress: 0.15 },
  { id: '02', title: 'Career', progress: 0.55 }, // The Receipts
  { id: '03', title: 'Core Skills', progress: 0.87 },
  { id: '04', title: 'Education', progress: 0.94 },
  { id: '05', title: 'About Me', progress: 1.0 }, // Footer
];

interface TableOfContentsProps {
  progress: MotionValue<number>;
}

export default function TableOfContents({ progress }: TableOfContentsProps) {
  const [isOpen, setIsOpen] = useState(false);

  // When page edge is white (0-0.02, 0.51-0.58, 0.99-1.0), TOC is white with black text.
  // When page edge is black (0.05-0.49, 0.60-0.99), TOC is black with white text.
  const bgColor = useTransform(progress, [0, 0.02, 0.05, 0.49, 0.51, 0.58, 0.60, 0.99, 1], ["#ffffff", "#ffffff", "#000000", "#000000", "#ffffff", "#ffffff", "#000000", "#000000", "#ffffff"]);
  const textColor = useTransform(progress, [0, 0.02, 0.05, 0.49, 0.51, 0.58, 0.60, 0.99, 1], ["#000000", "#000000", "#ffffff", "#ffffff", "#000000", "#000000", "#ffffff", "#ffffff", "#000000"]);
  const borderColor = useTransform(progress, [0, 0.02, 0.05, 0.49, 0.51, 0.58, 0.60, 0.99, 1], ["#000000", "#000000", "#ffffff", "#ffffff", "#000000", "#000000", "#ffffff", "#ffffff", "#000000"]);

  const scrollToSection = (progressTarget: number) => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({
      top: scrollHeight * progressTarget,
      behavior: 'smooth'
    });
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
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
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
                <motion.span style={{ color: textColor }} className="font-bold uppercase tracking-widest text-xl">Index</motion.span>
                <motion.button 
                  onClick={() => setIsOpen(false)}
                  style={{ color: textColor }}
                  className="hover:rotate-90 transition-transform"
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
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
                    onClick={() => scrollToSection(section.progress)}
                    initial={{ backgroundColor: "transparent", color: textColor.get() }}
                    whileHover={{ backgroundColor: textColor.get(), color: bgColor.get() }}
                    style={{ borderBottomColor: borderColor, color: textColor }}
                    className="flex flex-col text-left px-6 py-5 border-b border-black/10 transition-colors"
                  >
                    <div className="flex items-baseline gap-4 pointer-events-none">
                      <span className="font-mono text-sm font-bold">{section.id}</span>
                      <span className="font-bold text-2xl uppercase tracking-tighter">{section.title}</span>
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
