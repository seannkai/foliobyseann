import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { DirectorsCutFilm } from '../data/directorsCut';

interface VideoModalProps {
  film: DirectorsCutFilm | null;
  onClose: () => void;
}

export default function VideoModal({ film, onClose }: VideoModalProps) {
  useEffect(() => {
    if (film) {
      // Lock background scroll on body and documentElement
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';

      // Wire up Escape key
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      window.addEventListener('keydown', handleKeyDown);

      return () => {
        document.body.style.overflow = 'unset';
        document.documentElement.style.overflow = 'unset';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [film, onClose]);

  return (
    <AnimatePresence>
      {film && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center p-4 md:p-8 pointer-events-auto select-auto"
          onClick={(e) => {
            // Close only when clicking outside dialog content
            if (e.target === e.currentTarget) onClose();
          }}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-white border-4 border-black shadow-[12px_12px_0px_white] md:shadow-[16px_16px_0px_white] flex flex-col overflow-hidden text-black z-10"
          >
            {/* Header */}
            <div className="flex justify-between items-center px-4 md:px-6 py-3 md:py-4 border-b-4 border-black bg-black text-white flex-shrink-0">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs md:text-sm font-bold bg-white text-black px-2 py-0.5 uppercase tracking-wider">
                  DIRECTOR&apos;S CUT
                </span>
                <span className="font-bold text-sm md:text-lg tracking-tight uppercase truncate max-w-[200px] sm:max-w-md">
                  {film.title}
                </span>
              </div>
              <button
                onClick={onClose}
                className="hover:rotate-90 transition-transform p-1 text-white hover:text-zinc-300 cursor-pointer"
                aria-label="Close Video Modal"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-4 md:p-8 overflow-y-auto space-y-6 text-left font-sans">
              {/* Video Embed */}
              <div className="w-full aspect-video bg-black border-4 border-black shadow-[8px_8px_0px_black] overflow-hidden flex items-center justify-center">
                {film.platform === 'video' ? (
                  <video
                    src={film.embedUrl}
                    controls
                    playsInline
                    className="w-full h-full object-contain bg-black"
                  />
                ) : (
                  <iframe
                    src={film.embedUrl}
                    title={film.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )}
              </div>

              {/* Title, Year & Badges */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-black pb-4">
                <div>
                  <h2 className="text-2xl md:text-4xl font-bold uppercase tracking-tight">
                    {film.title}
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    {film.year !== null && (
                      <span className="font-mono text-xs font-bold bg-black text-white px-2 py-0.5 uppercase tracking-wider">
                        {film.year}
                      </span>
                    )}
                    <span className="font-mono text-xs font-bold border border-black px-2 py-0.5 uppercase tracking-wider text-zinc-700">
                      {film.platform === 'video'
                        ? 'DIRECT VIDEO'
                        : film.platform === 'google-drive'
                        ? 'GOOGLE DRIVE PREVIEW'
                        : 'YOUTUBE'}
                    </span>
                  </div>
                </div>

                {film.accolades.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {film.accolades.map((accolade, idx) => (
                      <span
                        key={idx}
                        className="font-mono text-[10px] md:text-xs font-bold bg-zinc-100 border-2 border-black px-2.5 py-1 uppercase shadow-[2px_2px_0px_black]"
                      >
                        {accolade}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Synopsis */}
              <div className="border-l-4 border-black pl-4 md:pl-6 space-y-2">
                <div className="font-mono text-xs font-bold uppercase tracking-widest text-zinc-500">
                  [ SYNOPSIS ]
                </div>
                <p className="text-sm md:text-base text-zinc-800 leading-relaxed font-medium">
                  {film.synopsis}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
