import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const sections = [
  { id: '00', title: 'Title', progress: 0 },
  { id: '01', title: 'Prelude', progress: 0.15 },
  { id: '02', title: 'Flatworld', progress: 0.35 }, // Adjusted for middle of Flatworld
  { id: '03', title: 'INFLXD', progress: 0.58 }, // Adjusted
  { id: '04', title: 'Alorica', progress: 0.70 }, // Adjusted
  { id: '05', title: 'Concentrix', progress: 0.81 }, // Adjusted
  { id: '06', title: 'Core Skills', progress: 0.87 }, // Adjusted
  { id: '07', title: 'Education', progress: 0.94 }, // Adjusted
];

export default function TableOfContents() {
  const [isOpen, setIsOpen] = useState(false);

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
              className="fixed top-0 right-0 h-full w-full md:w-[400px] bg-white border-l-4 border-black z-[10001] shadow-2xl overflow-y-auto"
            >
              {/* Close Button */}
              <div className="flex justify-between items-center p-6 border-b-4 border-black">
                <span className="font-bold uppercase tracking-widest text-black text-xl">Index</span>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-black hover:rotate-90 transition-transform"
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* Links */}
              <div className="flex flex-col">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.progress)}
                    className="flex flex-col text-left px-6 py-5 border-b border-black/10 hover:bg-black hover:text-white transition-colors group"
                  >
                    <div className="flex items-baseline gap-4">
                      <span className="font-mono text-sm font-bold">{section.id}</span>
                      <span className="font-bold text-2xl uppercase tracking-tighter">{section.title}</span>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
