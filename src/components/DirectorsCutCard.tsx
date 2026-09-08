import { useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import type { DirectorsCutFilm } from '../data/directorsCut';

interface DirectorsCutCardProps {
  film: DirectorsCutFilm;
  index: number;
  onSelect: (film: DirectorsCutFilm) => void;
}

const thumbnailVariants: Variants = {
  initial: {
    filter: 'grayscale(100%) contrast(1.1)',
    scale: 1,
  },
  hover: {
    filter: 'grayscale(0%) contrast(1)',
    scale: 1.03,
    transition: { duration: 0.15, ease: 'linear' as const },
  },
};

export default function DirectorsCutCard({ film, index, onSelect }: DirectorsCutCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      onClick={() => onSelect(film)}
      className="group bg-white border-4 border-black shadow-[6px_6px_0px_black] md:shadow-[8px_8px_0px_black] hover:shadow-[12px_12px_0px_black] transition-shadow flex flex-col cursor-pointer select-none text-black relative"
    >
      {/* Thumbnail Area with Variants */}
      <div className="relative w-full aspect-video overflow-hidden border-b-4 border-black bg-zinc-900">
        <motion.div
          variants={thumbnailVariants}
          initial="initial"
          whileHover="hover"
          className="w-full h-full relative flex items-center justify-center"
        >
          {imgError ? (
            // Solid gray placeholder box with film title text (prevent broken img)
            <div className="w-full h-full bg-zinc-800 flex flex-col items-center justify-center p-4 text-center">
              <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-400 font-bold mb-1">
                STILL FRAME PENDING
              </span>
              <span className="font-bold text-white text-sm md:text-base uppercase tracking-tight max-w-[80%] line-clamp-2">
                {film.title}
              </span>
            </div>
          ) : (
            <img
              src={film.thumbnailUrl}
              alt={film.title}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover"
            />
          )}

          {/* Square Play-Icon Overlay (fades in on hover) */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="w-12 h-12 md:w-14 md:h-14 border-2 border-white bg-black/80 flex items-center justify-center text-white shadow-[4px_4px_0px_black]">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="translate-x-0.5"
              >
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Top Tag Bar */}
        <div className="absolute top-2 left-2 flex items-center gap-1.5 z-10 pointer-events-none">
          <span className="font-mono text-[10px] font-bold bg-black text-white px-2 py-0.5 uppercase tracking-wider">
            0{index + 1}
          </span>
          {film.year !== null && (
            <span className="font-mono text-[10px] font-bold bg-white text-black px-2 py-0.5 uppercase tracking-wider border border-black">
              {film.year}
            </span>
          )}
        </div>
      </div>

      {/* Card Info Details */}
      <div className="p-4 md:p-5 flex flex-col flex-1 justify-between gap-3">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h4 className="font-bold text-lg md:text-xl uppercase tracking-tight leading-tight group-hover:underline">
              {film.title}
            </h4>
          </div>

          <p className="text-xs md:text-sm text-zinc-600 line-clamp-2 leading-relaxed">
            {film.synopsis}
          </p>
        </div>

        {/* Accolades & CTA */}
        <div className="space-y-2 pt-2 border-t-2 border-zinc-200">
          {film.accolades.length > 0 && (
            <div className="font-mono text-[10px] text-red-600 font-bold uppercase truncate">
              {film.accolades[0]}
            </div>
          )}

          <div className="flex justify-between items-center font-mono text-xs font-bold pt-1">
            <span className="uppercase text-zinc-500 text-[10px]">
              {film.platform === 'google-drive' ? 'DRIVE STREAM' : 'YOUTUBE'}
            </span>
            <span className="inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              WATCH ↗
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}