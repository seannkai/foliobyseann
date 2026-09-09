import { useRef } from 'react';
import { motion, MotionValue } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import SpreadsheetTexture from './SpreadsheetTexture';
import DirectorsCutCard from './DirectorsCutCard';
import { directorsCutFilms, type DirectorsCutFilm } from '../data/directorsCut';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface HorizontalCareerScrollProps {
  parallaxX: MotionValue<number>;
  parallaxY: MotionValue<number>;
  onOpenCaseStudy: () => void;
  onSelectFilm: (film: DirectorsCutFilm) => void;
}

export default function HorizontalCareerScroll({
  parallaxX,
  parallaxY,
  onOpenCaseStudy,
  onSelectFilm,
}: HorizontalCareerScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: '(min-width: 768px)',
          isMobile: '(max-width: 767px)',
          reduceMotion: '(prefers-reduced-motion: reduce)',
        },
        (context) => {
          const { isDesktop, reduceMotion } = context.conditions!;

          if (isDesktop && !reduceMotion) {
            const track = trackRef.current;
            if (!track) return;

            const totalPanels = 6;
            const scrollDistance = () => window.innerWidth * (totalPanels - 1);

            const tl = gsap.timeline({
              scrollTrigger: {
                id: 'horizontal-career-trigger',
                trigger: containerRef.current,
                pin: true,
                scrub: 1,
                start: 'top top',
                end: () => `+=${scrollDistance()}`,
                invalidateOnRefresh: true,
              },
            });

            // Master horizontal translation across 6 panels (5 transition intervals)
            tl.to(
              track,
              {
                x: () => -(track.scrollWidth - window.innerWidth),
                ease: 'none',
                duration: totalPanels - 1, // 5 time units
              },
              0
            );

            // BOUNDARY 1 (Flatworld -> INFLXD, t = 0.5 to 1.5):
            // Parallax slide: right visual has a lag offset that snaps into alignment
            tl.fromTo(
              '.inflxd-visual',
              { x: 120, opacity: 0.6 },
              { x: 0, opacity: 1, ease: 'power2.out', duration: 0.6 },
              0.7
            );

            // BOUNDARY 2 (INFLXD -> Alorica, t = 1.6 to 2.4):
            // Depth Zoom & Fade: INFLXD shrinks & dims, Alorica zooms in from 1.08
            tl.to(
              '.inflxd-card',
              {
                scale: 0.92,
                opacity: 0.35,
                ease: 'power1.inOut',
                duration: 0.5,
              },
              1.7
            );
            tl.fromTo(
              '.alorica-card',
              { scale: 1.08, opacity: 0.35 },
              { scale: 1, opacity: 1, ease: 'power2.out', duration: 0.5 },
              1.9
            );

            // BOUNDARY 3 (Alorica -> Concentrix, t = 2.6 to 3.4):
            // Angled Skew Wipe: Concentrix enters with a dynamic -5deg velocity skew
            tl.fromTo(
              '.concentrix-card',
              { skewX: -5, opacity: 0.7 },
              { skewX: 0, opacity: 1, ease: 'power2.out', duration: 0.5 },
              2.8
            );

            // BOUNDARY 4 (Concentrix -> Director's Cut, t = 3.6 to 4.3):
            // Cinematic Shutter Wipe: Horizontal clapper shutters snap close and open
            tl.fromTo(
              '.cinema-shutter-top',
              { scaleY: 0 },
              { scaleY: 1, ease: 'power2.in', duration: 0.2, yoyo: true, repeat: 1 },
              3.75
            );
            tl.fromTo(
              '.cinema-shutter-bottom',
              { scaleY: 0 },
              { scaleY: 1, ease: 'power2.in', duration: 0.2, yoyo: true, repeat: 1 },
              3.75
            );
            tl.fromTo(
              '.directors-cut-card',
              { scale: 0.94, opacity: 0.4 },
              { scale: 1, opacity: 1, ease: 'power2.out', duration: 0.45 },
              3.95
            );

            // BOUNDARY 5 (Director's Cut -> Core Skills, t = 4.5 to 5.0):
            // Terminal Inversion Wipe: High contrast entrance into dark terminal
            tl.fromTo(
              '.core-skills-heading',
              { x: -60, opacity: 0 },
              { x: 0, opacity: 1, ease: 'power2.out', duration: 0.35 },
              4.6
            );
            tl.fromTo(
              '.core-skill-item',
              { y: 35, opacity: 0 },
              { y: 0, opacity: 1, stagger: 0.04, ease: 'power2.out', duration: 0.35 },
              4.65
            );
          }
        }
      );

      return () => mm.revert();
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      id="section-career"
      className="relative w-full bg-black text-white overflow-hidden select-none md:select-auto"
    >
      {/* Cinematic Shutter Overlays for Boundary 4 */}
      <div
        className="cinema-shutter-top fixed top-0 left-0 w-full h-1/2 bg-black z-50 pointer-events-none origin-top"
        style={{ transform: 'scaleY(0)' }}
      />
      <div
        className="cinema-shutter-bottom fixed bottom-0 left-0 w-full h-1/2 bg-black z-50 pointer-events-none origin-bottom"
        style={{ transform: 'scaleY(0)' }}
      />

      {/* Horizontal Strip (Desktop) / Vertical Stack (Mobile) */}
      <div
        ref={trackRef}
        className="flex flex-col md:flex-row w-full md:w-[600vw] h-auto md:h-screen will-change-transform"
      >
        {/* ============================================================ */}
        {/* PANEL 1: Flatworld / Flinn Scientific (01)                   */}
        {/* ============================================================ */}
        <section className="w-full md:w-screen h-auto md:h-screen flex-shrink-0 flex items-center justify-center p-4 md:p-8 relative bg-black">
          <div className="w-full h-full max-w-7xl bg-white flex flex-col border-4 border-black overflow-hidden relative shadow-[10px_10px_0px_white]">
            <div className="flex border-b-4 border-black bg-white justify-between items-center px-4 py-2 uppercase font-bold text-sm md:text-base tracking-widest flex-shrink-0 relative z-10 text-black">
              <span>EXPERIENCE [01]</span>
              <span>Jan 2026 — Jul 2026</span>
            </div>

            <div className="flex flex-col md:flex-row flex-1 overflow-hidden relative z-10">
              {/* Left Text */}
              <div className="flex-1 p-6 md:p-12 lg:p-16 border-b-4 md:border-b-0 md:border-r-4 border-black flex flex-col justify-center relative bg-white text-black">
                <h3 className="text-3xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tighter mb-4 leading-none text-black">
                  Flatworld / Flinn Scientific
                </h3>
                <div className="font-mono text-xs md:text-sm font-bold text-zinc-500 mb-4 uppercase tracking-widest">
                  Data Entry Associate → Project Lead
                </div>
                <p className="text-2xl md:text-4xl lg:text-5xl max-w-lg mb-8 leading-tight font-medium text-zinc-700">
                  Wrote TypeScript Office Scripts & Claude MCP scrapers to process 8,000 SKUs.
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="inline-block bg-black text-white px-3 py-2 font-bold text-xs md:text-sm uppercase tracking-widest">
                    Finished 4 months ahead of schedule.
                  </div>
                  <button
                    onClick={onOpenCaseStudy}
                    className="pointer-events-auto inline-flex items-center gap-2 border-2 border-black bg-black hover:bg-zinc-800 text-white px-3 py-2 font-mono font-bold text-xs md:text-sm uppercase tracking-widest transition-colors shadow-[3px_3px_0px_rgba(0,0,0,0.3)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
                  >
                    <span>View Case Study Breakdown</span>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="square"
                    >
                      <line x1="7" y1="17" x2="17" y2="7" />
                      <polyline points="7 7 17 7 17 17" />
                    </svg>
                  </button>
                  <a
                    href="https://docs.google.com/spreadsheets/d/1IKf3vmdh52uL-qnp_LxbFvr_8n_m6QFr6bTpyASTTeI/edit?usp=sharing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pointer-events-auto inline-flex items-center gap-2 border-2 border-black bg-white hover:bg-black text-black hover:text-white px-3 py-2 font-mono font-bold text-xs md:text-sm uppercase tracking-widest transition-colors shadow-[3px_3px_0px_black] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
                  >
                    <span>Google Sheet</span>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="square"
                    >
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Right Visual */}
              <div className="flex-1 p-6 md:p-12 lg:p-16 flex items-center justify-center relative bg-zinc-100 overflow-hidden perspective-[1000px]">
                <SpreadsheetTexture />
                <motion.div
                  style={{ x: parallaxX, y: parallaxY }}
                  className="w-full aspect-video border-4 border-black flex flex-col p-4 md:p-6 font-mono text-[10px] md:text-xs overflow-hidden relative shadow-[10px_10px_0px_black] z-10 bg-white text-black"
                >
                  <div className="absolute inset-0 bg-white/90 flex items-center justify-center p-4 backdrop-blur-[1px] z-10">
                    <div className="font-bold text-sm md:text-xl tracking-widest border-2 border-black p-4 md:p-8 shadow-[0_0_15px_rgba(0,0,0,0.3)] text-center bg-white text-black flex flex-col items-center gap-3">
                      <div>
                        &gt; SCRIPT_EXEC_SUCCESS
                        <br />
                        &gt; 8,000 SKUs PROCESSED
                      </div>
                      <div className="flex flex-wrap gap-2 justify-center">
                        <button
                          onClick={onOpenCaseStudy}
                          className="pointer-events-auto inline-flex items-center gap-1.5 bg-black hover:bg-zinc-800 text-white px-3 py-1.5 text-xs font-mono font-bold tracking-wider border border-black uppercase transition-colors"
                        >
                          <span>Open Dossier ↗</span>
                        </button>
                        <a
                          href="https://docs.google.com/spreadsheets/d/1IKf3vmdh52uL-qnp_LxbFvr_8n_m6QFr6bTpyASTTeI/edit?usp=sharing"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="pointer-events-auto inline-flex items-center gap-1.5 bg-white hover:bg-black text-black hover:text-white px-3 py-1.5 text-xs font-mono font-bold tracking-wider border border-black uppercase transition-colors"
                        >
                          <span>Live Sheet ↗</span>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="flex border-b-2 border-zinc-300 pb-2 md:pb-4 mb-2 md:mb-4 gap-2 md:gap-4 text-zinc-500">
                    <span>SKU</span>
                    <span>PRICE</span>
                    <span>COMPETITOR</span>
                  </div>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-2 md:gap-4 mb-2 md:mb-3 text-black">
                      <span className="w-12 md:w-16">FW-{2048 + i}</span>
                      <span className="w-10 md:w-12">$14.99</span>
                      <span className="w-16 md:w-24">Verifying...</span>
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* PANEL 2: INFLXD (02)                                         */}
        {/* ============================================================ */}
        <section className="w-full md:w-screen h-auto md:h-screen flex-shrink-0 flex items-center justify-center p-4 md:p-8 relative bg-black">
          <div className="inflxd-card w-full h-full max-w-7xl bg-white flex flex-col border-4 border-black overflow-hidden relative shadow-[10px_10px_0px_white]">
            <div className="flex border-b-4 border-black bg-white justify-between items-center px-4 py-2 uppercase font-bold text-sm md:text-base tracking-widest text-black flex-shrink-0">
              <span>EXPERIENCE [02]</span>
              <span>Sep 2025 — Mar 2026</span>
            </div>

            <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
              {/* Left Text */}
              <div className="flex-1 p-6 md:p-12 lg:p-16 border-b-4 md:border-b-0 md:border-r-4 border-black flex flex-col justify-center bg-white text-black">
                <h3 className="text-3xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tighter mb-4 leading-none text-black">
                  INFLXD
                </h3>
                <div className="font-mono text-xs md:text-sm font-bold text-zinc-500 mb-4 uppercase tracking-widest">
                  Transcription Quality Analyst / Data Annotator
                </div>
                <p className="text-2xl md:text-4xl lg:text-5xl max-w-lg mb-8 leading-tight font-medium text-zinc-700">
                  Corrected AI output for accuracy and domain precision.
                </p>
                <div className="inline-block bg-black text-white px-3 py-2 self-start font-bold text-xs md:text-sm uppercase tracking-widest">
                  Maintained strict SLAs.
                </div>
              </div>

              {/* Right Visual */}
              <div className="inflxd-visual flex-1 p-6 md:p-12 lg:p-16 flex items-center justify-center relative bg-zinc-100 overflow-hidden perspective-[1000px]">
                <motion.div
                  style={{ x: parallaxX, y: parallaxY }}
                  className="w-full aspect-video border-4 border-black flex flex-col p-4 md:p-6 font-mono text-[10px] md:text-xs overflow-hidden relative shadow-[10px_10px_0px_black] bg-white text-black text-left"
                >
                  <div className="text-zinc-500 mb-2 font-bold text-sm">AI_OUTPUT_EVAL:</div>
                  <motion.div
                    animate={{ opacity: [1, 0.4, 1, 0.8, 1], x: [0, -2, 2, -1, 0] }}
                    transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 3 }}
                    className="line-through text-red-500 font-bold mb-6 text-base md:text-xl border-l-4 border-red-500 pl-4"
                  >
                    The company earned 40 million in Q3.
                  </motion.div>
                  <div className="text-zinc-400 mb-2 font-bold text-sm">
                    HUMAN_CORRECTION (SEANN):
                  </div>
                  <div className="text-white bg-black p-3 md:p-4 text-base md:text-xl mt-auto border-2 border-black font-bold tracking-tight flex items-center">
                    <motion.div
                      animate={{ width: ['0%', '100%', '100%', '0%'] }}
                      transition={{ duration: 4.5, repeat: Infinity, repeatDelay: 1.5, ease: 'easeInOut' }}
                      className="overflow-hidden whitespace-nowrap"
                    >
                      The company earned{' '}
                      <span className="underline decoration-white decoration-2">14 million</span> in
                      Q3.
                    </motion.div>
                    <motion.span
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ repeat: Infinity, duration: 0.8 }}
                      className="inline-block w-2 md:w-3 h-5 md:h-6 bg-white ml-1 flex-shrink-0"
                    />
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* PANEL 3: Alorica / Google Fi Wireless (03)                   */}
        {/* ============================================================ */}
        <section className="w-full md:w-screen h-auto md:h-screen flex-shrink-0 flex items-center justify-center p-4 md:p-8 relative bg-black">
          <div className="alorica-card w-full h-full max-w-7xl bg-white flex flex-col border-4 border-black overflow-hidden relative shadow-[10px_10px_0px_white]">
            <div className="flex border-b-4 border-black bg-white justify-between items-center px-4 py-2 uppercase font-bold text-sm md:text-base tracking-widest text-black flex-shrink-0">
              <span>EXPERIENCE [03]</span>
              <span>Jan 2025 — Jan 2026</span>
            </div>

            <div className="flex flex-col flex-1 overflow-hidden relative justify-center items-center p-6 md:p-12 z-10">
              {/* Top Text */}
              <div className="text-center mb-8 flex flex-col items-center text-black">
                <h3 className="text-3xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tighter mb-4 leading-none text-black">
                  Alorica / Google Fi Wireless
                </h3>
                <div className="font-mono text-xs md:text-sm font-bold text-zinc-500 mb-4 uppercase tracking-widest">
                  Technical Support Representative → Team Support / SME
                </div>
                <p className="text-xl md:text-3xl text-zinc-700 max-w-2xl font-medium leading-tight mb-6">
                  Directed floor support and resolved tier-2 escalations for a 15-person team.
                </p>
                <div className="inline-block bg-black text-white px-3 py-2 font-bold text-xs md:text-sm uppercase tracking-widest">
                  High volume tier-2 operations.
                </div>
              </div>

              {/* Bottom Visual */}
              <div className="w-full max-w-2xl aspect-video md:aspect-[21/9] perspective-[1000px]">
                <motion.div
                  style={{ x: parallaxX, y: parallaxY }}
                  className="w-full h-full border-4 border-black bg-white flex flex-col p-4 md:p-6 shadow-[10px_10px_0px_black]"
                >
                  <div className="flex border-b-2 border-black pb-2 mb-4 justify-between items-end font-mono text-xs md:text-sm text-black relative z-20 bg-white">
                    <span>ESCALATION_QUEUE</span>
                    <span className="animate-pulse text-red-500 font-bold bg-zinc-900 px-2 py-1 text-white">
                      CRITICAL
                    </span>
                  </div>
                  <div className="flex-1 overflow-hidden relative">
                    <motion.div
                      animate={{ y: ['0%', '-50%'] }}
                      transition={{ duration: 8, ease: 'linear', repeat: Infinity }}
                      className="flex flex-col gap-2 md:gap-3 absolute inset-x-0 top-0 w-full"
                    >
                      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                        <div
                          key={i}
                          className="flex justify-between items-center border-l-4 border-red-500 pl-3 bg-zinc-900 py-3 px-3 text-zinc-300 font-mono text-xs md:text-sm shadow-md flex-shrink-0"
                        >
                          <span className="font-bold text-white">TKT-{8990 + (i % 4)}</span>
                          <span className="text-red-500 font-bold uppercase tracking-widest">
                            Escalated
                          </span>
                        </div>
                      ))}
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* PANEL 4: Concentrix / Macy's (04)                            */}
        {/* ============================================================ */}
        <section className="w-full md:w-screen h-auto md:h-screen flex-shrink-0 flex items-center justify-center p-4 md:p-8 relative bg-black">
          <div className="concentrix-card w-full h-full max-w-7xl bg-white flex flex-col border-4 border-black overflow-hidden relative shadow-[10px_10px_0px_white]">
            <div className="flex border-b-4 border-black bg-white justify-between items-center px-4 py-2 uppercase font-bold text-sm md:text-base tracking-widest text-black flex-shrink-0">
              <span>EXPERIENCE [04]</span>
              <span>Jul 2024 — Jan 2025</span>
            </div>

            <div className="flex flex-col-reverse md:flex-row flex-1 overflow-hidden">
              {/* Left Visual */}
              <div className="flex-1 p-6 md:p-12 lg:p-16 flex items-center justify-center bg-zinc-100 border-t-4 md:border-t-0 md:border-r-4 border-black perspective-[1000px]">
                <motion.div
                  style={{ x: parallaxX, y: parallaxY }}
                  className="w-full aspect-video border-4 border-black bg-white flex flex-col p-4 md:p-6 relative overflow-hidden shadow-[10px_10px_0px_black]"
                >
                  <div className="font-mono text-[10px] md:text-sm font-bold mb-4 md:mb-6 border-b-2 border-black pb-2 md:pb-4 text-black">
                    [=VLOOKUP(Data!A:Z, Dashboard!B2, 5, FALSE)]
                  </div>
                  <div className="flex-1 flex items-end gap-2 md:gap-3 px-2 relative z-10">
                    {[40, 60, 45, 80, 65, 90, 100].map((h, i) => (
                      <motion.div
                        key={i}
                        className="flex-1 bg-zinc-400"
                        animate={{
                          height: [
                            `${h}%`,
                            `${Math.min(100, h + (i % 2 === 0 ? 20 : 10))}%`,
                            `${Math.max(10, h - 15)}%`,
                            `${h}%`,
                          ],
                        }}
                        transition={{
                          duration: 2 + i * 0.3,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                      />
                    ))}
                  </div>
                  <div className="absolute top-1/2 left-0 w-full border-t-4 border-black border-dashed transform -translate-y-1/2 flex justify-end px-2 z-20 pointer-events-none">
                    <span className="bg-black text-white text-[8px] md:text-xs font-bold px-1 md:px-2 py-1 mt-1">
                      GLIDEPATH TARGET
                    </span>
                  </div>
                  <motion.div
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                    className="absolute left-0 w-full h-1 bg-white/20 z-30 pointer-events-none mix-blend-overlay"
                  />
                </motion.div>
              </div>

              {/* Right Text */}
              <div className="flex-1 p-6 md:p-12 lg:p-16 border-b-4 md:border-b-0 md:border-r-0 border-black flex flex-col justify-center bg-white text-black">
                <h3 className="text-3xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tighter mb-4 leading-none text-black">
                  Concentrix / Macy's
                </h3>
                <div className="font-mono text-xs md:text-sm font-bold text-zinc-500 mb-4 uppercase tracking-widest">
                  Customer Service Representative → Reporting Analyst Apprentice
                </div>
                <p className="text-2xl md:text-4xl lg:text-5xl max-w-lg mb-8 leading-tight font-medium text-zinc-700">
                  Top agent in 3 months; promoted to Reporting Apprentice & SME supporting 50+
                  agents.
                </p>
                <div className="inline-block bg-black text-white px-3 py-2 self-start font-bold text-xs md:text-sm uppercase tracking-widest">
                  Built glidepath models & automated reports.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* PANEL 5: Director's Cut (Archive 01)                         */}
        {/* ============================================================ */}
        <section
          id="section-directors-cut"
          className="w-full md:w-screen h-auto md:h-screen flex-shrink-0 flex items-center justify-center p-4 md:p-8 relative bg-black"
        >
          <div className="directors-cut-card w-full h-full max-w-7xl bg-white flex flex-col border-4 border-black overflow-hidden relative pointer-events-auto shadow-[10px_10px_0px_white]">
            {/* Header Bar */}
            <div className="flex border-b-4 border-black bg-white justify-between items-center px-4 py-2 uppercase font-bold text-sm md:text-base tracking-widest text-black flex-shrink-0">
              <div className="flex items-center gap-2">
                <span className="bg-black text-white px-2 py-0.5 text-xs md:text-sm font-mono font-bold">
                  ARCHIVE [01]
                </span>
                <span>DIRECTOR&apos;S CUT</span>
              </div>
              <span className="font-mono text-xs md:text-sm text-zinc-600">2022 — 2024</span>
            </div>

            {/* Content Area */}
            <div className="flex flex-col flex-1 overflow-y-auto justify-center items-center p-4 md:p-8 z-10 text-black">
              {/* Centered Top Text */}
              <div className="text-center mb-4 md:mb-6 flex flex-col items-center">
                <h3 className="text-3xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tighter mb-2 leading-none text-black">
                  Film &amp; Media Archive
                </h3>
                <div className="font-mono text-xs md:text-sm font-bold text-zinc-500 mb-2 uppercase tracking-widest">
                  Directing &bull; Editing &bull; Scriptwriting &bull; Media Literacy
                </div>
                <div className="inline-block bg-black text-white px-3 py-1 font-bold text-xs md:text-sm uppercase tracking-widest">
                  STI Tagisan ng Sining &bull; 2x Local Champion
                </div>
              </div>

              {/* 3-Column Video Card Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 w-full max-w-5xl items-stretch">
                {directorsCutFilms.map((film, idx) => (
                  <DirectorsCutCard
                    key={film.id}
                    film={film}
                    index={idx}
                    onSelect={(f) => onSelectFilm(f)}
                  />
                ))}
              </div>

              <div className="font-mono text-[10px] md:text-xs font-bold uppercase tracking-widest text-zinc-400 mt-4 text-center">
                [ CLICK ANY ENTRY TO LAUNCH PLAYER ]
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* PANEL 6: Core Skills (09)                                    */}
        {/* ============================================================ */}
        <section
          id="section-core-skills"
          className="w-full md:w-screen h-auto md:h-screen flex-shrink-0 flex items-center justify-center p-4 md:p-8 relative bg-black"
        >
          <div className="w-full h-full max-w-7xl bg-black border-4 border-white flex flex-col justify-center p-6 md:p-12 lg:p-16 relative overflow-hidden shadow-[10px_10px_0px_white]">
            <h2 className="core-skills-heading text-4xl md:text-6xl lg:text-[7rem] font-bold uppercase tracking-tighter mb-8 md:mb-12 leading-none border-b-8 border-white pb-3 text-white">
              Core
              <br />
              Skills
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 md:gap-x-14 gap-y-5 md:gap-y-8 uppercase tracking-widest font-bold text-base md:text-xl lg:text-2xl text-white">
              {/* Skill 1: Microsoft Excel & VBA */}
              <motion.div
                whileHover={{
                  scale: 1.03,
                  backgroundColor: '#ffffff',
                  color: '#000000',
                  padding: '1rem',
                }}
                className="core-skill-item border-b-4 border-zinc-800 pb-3 flex flex-col justify-between pointer-events-auto transition-colors cursor-pointer"
              >
                <div className="mb-3">Microsoft Excel &amp; VBA</div>
                <div className="grid grid-cols-4 gap-2 h-6 md:h-7">
                  {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ opacity: [0.2, 1, 0.2] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.15,
                        ease: 'easeInOut',
                      }}
                      className="bg-white border-2 border-black"
                    />
                  ))}
                </div>
              </motion.div>

              {/* Skill 2: Workflow Automation & PowerApps */}
              <motion.div
                whileHover={{
                  scale: 1.03,
                  backgroundColor: '#ffffff',
                  color: '#000000',
                  padding: '1rem',
                }}
                className="core-skill-item border-b-4 border-zinc-800 pb-3 flex flex-col justify-between pointer-events-auto transition-colors cursor-pointer"
              >
                <div className="mb-3">Workflow Automation &amp; PowerApps</div>
                <div className="flex items-center gap-2 h-6 md:h-7 mix-blend-difference">
                  <motion.div
                    animate={{ rotate: 180 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: 'backInOut',
                      repeatDelay: 0.5,
                    }}
                    className="w-5 h-5 md:w-6 md:h-6 bg-white flex-shrink-0"
                  />
                  <div className="flex-1 h-1 md:h-2 bg-zinc-800 relative overflow-hidden">
                    <motion.div
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                      className="absolute inset-0 bg-white"
                    />
                  </div>
                  <motion.div
                    animate={{ scale: [1, 0.5, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-5 h-5 md:w-6 md:h-6 bg-zinc-500 rounded-full flex-shrink-0"
                  />
                </div>
              </motion.div>

              {/* Skill 3: Office Scripts / TypeScript */}
              <motion.div
                whileHover={{
                  scale: 1.03,
                  backgroundColor: '#ffffff',
                  color: '#000000',
                  padding: '1rem',
                }}
                className="core-skill-item border-b-4 border-zinc-800 pb-3 flex flex-col justify-between pointer-events-auto transition-colors cursor-pointer"
              >
                <div className="mb-3">Office Scripts / TypeScript</div>
                <div className="h-6 md:h-7 bg-zinc-900 border-2 border-zinc-700 p-1 md:p-1.5 flex items-center overflow-hidden relative mix-blend-difference">
                  <motion.div
                    animate={{ width: ['0%', '100%', '100%', '0%'] }}
                    transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 1, ease: 'linear' }}
                    className="font-mono text-[9px] md:text-xs text-zinc-300 whitespace-nowrap overflow-hidden"
                  >
                    <span className="text-red-400">const</span>{' '}
                    <span className="text-blue-300">script</span> ={' '}
                    <span className="text-red-400">async</span> () =&gt; success;
                  </motion.div>
                  <motion.div
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="w-1.5 md:w-2 h-3 md:h-4 bg-white ml-1 flex-shrink-0"
                  />
                </div>
              </motion.div>

              {/* Skill 4: Claude Projects & MCP Scraping */}
              <motion.div
                whileHover={{
                  scale: 1.03,
                  backgroundColor: '#ffffff',
                  color: '#000000',
                  padding: '1rem',
                }}
                className="core-skill-item border-b-4 border-zinc-800 pb-3 flex flex-col justify-between pointer-events-auto transition-colors cursor-pointer"
              >
                <div className="mb-3">Claude Projects &amp; MCP Scraping</div>
                <div className="flex items-center justify-center gap-1.5 md:gap-2 h-6 md:h-7 overflow-hidden mix-blend-difference">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ height: ['20%', '100%', '20%'] }}
                      transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        delay: i * 0.1,
                        ease: 'easeInOut',
                      }}
                      className="flex-1 max-w-[8px] bg-white rounded-full"
                    />
                  ))}
                </div>
              </motion.div>

              {/* Skill 5: Real-Time Monitoring & Floor SME */}
              <motion.div
                whileHover={{
                  scale: 1.03,
                  backgroundColor: '#ffffff',
                  color: '#000000',
                  padding: '1rem',
                }}
                className="core-skill-item border-b-4 border-zinc-800 pb-3 flex flex-col justify-between pointer-events-auto transition-colors cursor-pointer"
              >
                <div className="mb-3">Real-Time Monitoring &amp; Floor SME</div>
                <div className="h-6 md:h-7 relative overflow-hidden flex items-center border-l-4 border-red-500 bg-zinc-900 pl-3 mix-blend-difference">
                  <motion.div
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-red-500 mr-2 shadow-[0_0_8px_rgba(239,68,68,0.8)]"
                  />
                  <span className="font-mono text-[9px] md:text-xs text-red-400 tracking-widest uppercase font-bold">
                    Live_Feed_Active
                  </span>
                  <motion.div
                    animate={{ x: ['-100%', '300%'] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"
                  />
                </div>
              </motion.div>

              {/* Skill 6: Data QA & Operations Reporting */}
              <motion.div
                whileHover={{
                  scale: 1.03,
                  backgroundColor: '#ffffff',
                  color: '#000000',
                  padding: '1rem',
                }}
                className="core-skill-item border-b-4 border-zinc-800 pb-3 flex flex-col justify-between pointer-events-auto transition-colors cursor-pointer"
              >
                <div className="mb-3">Data QA &amp; Operations Reporting</div>
                <div className="h-6 md:h-7 flex flex-col justify-between overflow-hidden relative p-1 bg-black mix-blend-difference">
                  <div className="w-full h-1 bg-zinc-800" />
                  <div className="w-full h-1 bg-zinc-800" />
                  <div className="w-full h-1 bg-zinc-800" />
                  <motion.div
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-y-0 w-1/4 border-x-4 border-white bg-white/20 pointer-events-none"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
