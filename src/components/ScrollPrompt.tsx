import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ScrollPrompt() {
  const [show, setShow] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const resetTimer = (duration: number) => {
      clearTimeout(timeoutId);
      setShow(false);
      timeoutId = setTimeout(() => {
        const scrollHeight = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        const scrollProgress = window.scrollY / scrollHeight;
        if (scrollProgress < 0.95) {
          setShow(true);
        }
      }, duration);
    };

    const handleScroll = () => {
      const scrollHeight = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const scrollProgress = window.scrollY / scrollHeight;
      setIsAtBottom(scrollProgress >= 0.95);
      
      if (scrollProgress >= 0.95) {
        setShow(false);
        clearTimeout(timeoutId);
      } else {
        resetTimer(30000); // 30 seconds after any scroll
      }
    };

    // Initial 10-second timer
    resetTimer(10000);

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <AnimatePresence>
      {show && !isAtBottom && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center z-[9999] pointer-events-none mix-blend-difference text-white"
        >
          <span className="font-mono text-xs mb-2 tracking-[0.3em] uppercase font-bold">Scroll</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center -space-y-3"
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
              <path d="M7 10l5 5 5-5" />
            </svg>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" className="opacity-50">
              <path d="M7 10l5 5 5-5" />
            </svg>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
