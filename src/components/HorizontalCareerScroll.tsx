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
      const track = trackRef.current;
      if (!track) return;

      const scrollDist = () => document.documentElement.scrollHeight - window.innerHeight;
      const getX = (panelIndex: number) => -(panelIndex * window.innerWidth);

      /*
        CHOREOGRAPHED TIMELINE WITH COMPLETE STOPS / DWELL WINDOWS:
        Total duration = 8.5 time units.
        Dwell 0: 0.0 -> 1.0 (Flatworld solid stop / pause)
        Slide 0->1: 1.0 -> 1.5 (Snappy slide to INFLXD)
        Dwell 1: 1.5 -> 2.5 (INFLXD solid stop / pause)
        Slide 1->2: 2.5 -> 3.0 (Snappy slide to Alorica)
        Dwell 2: 3.0 -> 4.0 (Alorica solid stop / pause)
        Slide 2->3: 4.0 -> 4.5 (Snappy slide to Concentrix)
        Dwell 3: 4.5 -> 5.5 (Concentrix solid stop / pause)
        Slide 3->4: 5.5 -> 6.0 (Snappy slide to Director's Cut)
        Dwell 4: 6.0 -> 7.0 (Director's Cut solid stop / pause)
        Slide 4->5: 7.0 -> 7.5 (Snappy slide to Core Skills)
        Dwell 5: 7.5 -> 8.5 (Core Skills solid stop / pause)

        Midpoints of the 6 dwells for snapping:
        0.5/8.5 ≈ 0.059, 2.0/8.5 ≈ 0.235, 3.5/8.5 ≈ 0.412,
        5.0/8.5 ≈ 0.588, 6.5/8.5 ≈ 0.765, 8.0/8.5 ≈ 0.941
      */
      const snapPoints = [
        0.5 / 8.5,
        2.0 / 8.5,
        3.5 / 8.5,
        5.0 / 8.5,
        6.5 / 8.5,
        8.0 / 8.5,
      ];

      const tl = gsap.timeline({
        scrollTrigger: {
          id: 'horizontal-career-trigger',
          trigger: document.body,
          start: () => scrollDist() * 0.58,
          end: () => scrollDist() * 0.90,
          scrub: 0.8,
          snap: {
            snapTo: snapPoints,
            duration: { min: 0.25, max: 0.5 },
            delay: 0.04,
            ease: 'power2.out',
          },
          invalidateOnRefresh: true,
        },
      });

      // Panel 0 (Flatworld) holds at 0 from 0.0 to 1.0 (SOLID DWELL)

      // Slide 1: to Panel 1 (INFLXD)
      tl.to(
        track,
        {
          x: () => getX(1),
          ease: 'power2.inOut',
          duration: 0.5,
        },
        1.0
      );
      // Subtle settling offset
      tl.fromTo(
        '.inflxd-visual',
        { x: 30, opacity: 0.85 },
        { x: 0, opacity: 1, ease: 'power2.out', duration: 0.3 },
        1.1
      );

      // Panel 1 (INFLXD) holds at -100vw from 1.5 to 2.5 (SOLID DWELL)

      // Slide 2: to Panel 2 (Alorica)
      tl.to(
        track,
        {
          x: () => getX(2),
          ease: 'power2.inOut',
          duration: 0.5,
        },
        2.5
      );

      // Panel 2 (Alorica) holds at -200vw from 3.0 to 4.0 (SOLID DWELL)

      // Slide 3: to Panel 3 (Concentrix)
      tl.to(
        track,
        {
          x: () => getX(3),
          ease: 'power2.inOut',
          duration: 0.5,
        },
        4.0
      );

      // Panel 3 (Concentrix) holds at -300vw from 4.5 to 5.5 (SOLID DWELL)

      // Slide 4: to Panel 4 (Director's Cut)
      tl.to(
        track,
        {
          x: () => getX(4),
          ease: 'power2.inOut',
          duration: 0.5,
        },
        5.5
      );
      // Subtle cinematic depth zoom
      tl.fromTo(
        '.directors-cut-card',
        { scale: 0.97, opacity: 0.85 },
        { scale: 1, opacity: 1, ease: 'power2.out', duration: 0.4 },
        5.6
      );

      // Panel 4 (Director's Cut) holds at -400vw from 6.0 to 7.0 (SOLID DWELL)

      // Slide 5: to Panel 5 (Core Skills)
      tl.to(
        track,
        {
          x: () => getX(5),
          ease: 'power2.inOut',
          duration: 0.5,
        },
        7.0
      );
      tl.fromTo(
        '.core-skill-item',
        { y: 15, opacity: 0.4 },
        { y: 0, opacity: 1, stagger: 0.02, ease: 'power2.out', duration: 0.3 },
        7.1
      );

      // Panel 5 (Core Skills) holds at -500vw from 7.5 to 8.5 (SOLID DWELL)
      tl.set({}, {}, 8.5);

      return () => {
        tl.kill();
      };
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      id="section-career"
      className="w-full h-full relative overflow-hidden bg-black select-none md:select-auto"
    >
      {/* Horizontal Track: 6 side-by-side full-screen panels */}
      <div
        ref={trackRef}
        className="flex flex-row w-[600vw] h-full will-change-transform"
      >
        {/* ============================================================ */}
        {/* PANEL 1: Flatworld / Flinn Scientific (01)                   */}
        {/* ============================================================ */}
        <section className="w-screen h-full flex-shrink-0 flex items-center justify-center p-2.5 sm:p-4 md:p-8 relative bg-black">
          <div className="w-full h-full max-w-7xl max-h-[calc(100vh-1rem)] md:max-h-[calc(100vh-4rem)] bg-white flex flex-col border-2 md:border-4 border-black overflow-hidden relative">
            {/* Top Bar */}
            <div className="flex border-b-2 md:border-b-4 border-black bg-white justify-between items-center px-3 md:px-4 py-1.5 md:py-2 uppercase font-bold text-[10px] md:text-sm tracking-widest flex-shrink-0 text-black">
              <span>EXPERIENCE [01]</span>
              <span>Jan 2026 — Jul 2026</span>
            </div>

            {/* Brutalist KPI Metric Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 border-b-2 md:border-b-4 border-black bg-zinc-100 text-black flex-shrink-0">
              <div className="p-1.5 md:p-3 border-r border-b md:border-b-0 border-black flex flex-col">
                <span className="font-mono text-[9px] md:text-xs text-zinc-500 uppercase font-bold tracking-wider">Processed Volume</span>
                <span className="text-sm md:text-2xl font-bold font-mono tracking-tight">8,000 SKUs</span>
              </div>
              <div className="p-1.5 md:p-3 border-b md:border-b-0 md:border-r border-black flex flex-col">
                <span className="font-mono text-[9px] md:text-xs text-zinc-500 uppercase font-bold tracking-wider">Delivery Velocity</span>
                <span className="text-sm md:text-2xl font-bold font-mono tracking-tight text-emerald-600">-4 Months</span>
              </div>
              <div className="p-1.5 md:p-3 border-r border-black flex flex-col">
                <span className="font-mono text-[9px] md:text-xs text-zinc-500 uppercase font-bold tracking-wider">Tech Architecture</span>
                <span className="text-sm md:text-2xl font-bold font-mono tracking-tight truncate">TypeScript + MCP</span>
              </div>
              <div className="p-1.5 md:p-3 flex flex-col">
                <span className="font-mono text-[9px] md:text-xs text-zinc-500 uppercase font-bold tracking-wider">Data Quality</span>
                <span className="text-sm md:text-2xl font-bold font-mono tracking-tight text-black">100% Validated</span>
              </div>
            </div>

            {/* Main Content Split (Adaptive, Safe Internal Scrolling) */}
            <div className="flex flex-col md:flex-row flex-1 overflow-y-auto md:overflow-hidden relative z-10">
              {/* Left Column */}
              <div className="flex-1 p-4 md:p-8 lg:p-12 border-b-2 md:border-b-0 md:border-r-4 border-black flex flex-col justify-between bg-white text-black">
                <div>
                  <div className="inline-block bg-zinc-900 text-white font-mono text-[9px] md:text-xs font-bold px-2 py-0.5 md:px-2.5 md:py-1 mb-2 md:mb-3 uppercase tracking-widest">
                    Data Entry Associate → Project Lead
                  </div>
                  <h3 className="text-xl md:text-4xl lg:text-5xl font-bold uppercase tracking-tighter mb-2 md:mb-3 leading-none text-black">
                    Flatworld / Flinn Scientific
                  </h3>
                  <p className="text-sm md:text-xl lg:text-2xl text-zinc-700 font-medium leading-snug mb-3 md:mb-4">
                    Engineered autonomous TypeScript Office Scripts &amp; Claude MCP scrapers to extract, reconcile, and catalog 8,000 scientific product SKUs.
                  </p>
                  <p className="text-xs md:text-sm text-zinc-600 leading-relaxed font-sans mb-4 md:mb-6">
                    Eliminated months of manual copy-pasting, reduced error rates to zero, and was promoted to Project Lead overseeing the full catalog validation lifecycle.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 pt-3 md:pt-4 border-t-2 border-zinc-200">
                  <button
                    onClick={onOpenCaseStudy}
                    className="pointer-events-auto inline-flex items-center gap-1.5 md:gap-2 border-2 border-black bg-black hover:bg-zinc-800 text-white px-3 py-1.5 md:px-4 md:py-2 font-mono font-bold text-xs md:text-sm uppercase tracking-widest transition-all shadow-[2px_2px_0px_rgba(0,0,0,0.3)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px]"
                  >
                    <span>View Case Study</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="7" y1="17" x2="17" y2="7" />
                      <polyline points="7 7 17 7 17 17" />
                    </svg>
                  </button>
                  <a
                    href="https://docs.google.com/spreadsheets/d/1IKf3vmdh52uL-qnp_LxbFvr_8n_m6QFr6bTpyASTTeI/edit?usp=sharing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pointer-events-auto inline-flex items-center gap-1.5 md:gap-2 border-2 border-black bg-white hover:bg-black text-black hover:text-white px-3 py-1.5 md:px-4 md:py-2 font-mono font-bold text-xs md:text-sm uppercase tracking-widest transition-all shadow-[2px_2px_0px_black] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px]"
                  >
                    <span>Google Sheet ↗</span>
                  </a>
                </div>
              </div>

              {/* Right Column: Live Data Workbench */}
              <div className="flex-1 p-4 md:p-8 lg:p-12 flex items-center justify-center relative bg-zinc-100 overflow-hidden perspective-[1000px]">
                <SpreadsheetTexture />
                <motion.div
                  style={{ x: parallaxX, y: parallaxY }}
                  className="w-full aspect-auto md:aspect-video border-2 md:border-4 border-black flex flex-col p-3 md:p-6 font-mono text-xs overflow-hidden relative shadow-[6px_6px_0px_black] md:shadow-[8px_8px_0px_black] z-10 bg-white text-black"
                >
                  <div className="flex border-b-2 border-black pb-2 mb-2 md:mb-3 justify-between items-center text-[11px] md:text-xs font-bold">
                    <span className="text-zinc-500">&gt; TS_OFFICE_SCRIPT_MONITOR</span>
                    <span className="bg-emerald-500 text-black px-2 py-0.5 text-[9px] md:text-[10px] tracking-wider uppercase font-bold">ACTIVE</span>
                  </div>

                  <div className="p-2 md:p-3 bg-zinc-900 text-emerald-400 font-mono text-[10px] md:text-xs mb-2 md:mb-3 border border-zinc-700">
                    <div>&gt; STATUS: EXEC_SUCCESS</div>
                    <div>&gt; BATCH: 8,000 SKUs IMPORTED &amp; VERIFIED</div>
                    <div className="text-zinc-400">&gt; VARIANCE: 0.00% (AUDIT_PASSED)</div>
                  </div>

                  <div className="flex border-b border-zinc-300 pb-1 mb-1.5 gap-3 md:gap-4 text-zinc-500 text-[10px] md:text-[11px] font-bold">
                    <span className="w-14 md:w-16">SKU_ID</span>
                    <span className="w-12 md:w-14">PRICE</span>
                    <span className="w-20 md:w-24">STATUS</span>
                    <span className="flex-1 text-right">TIME</span>
                  </div>
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex gap-3 md:gap-4 mb-1 text-[10px] md:text-[11px] text-zinc-800">
                      <span className="w-14 md:w-16 font-bold">FW-{2048 + i}</span>
                      <span className="w-12 md:w-14 font-mono">$14.99</span>
                      <span className="w-20 md:w-24 text-emerald-600 font-bold">VERIFIED</span>
                      <span className="flex-1 text-right text-zinc-400 font-mono">00:0{i}.4s</span>
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
        <section className="w-screen h-full flex-shrink-0 flex items-center justify-center p-2.5 sm:p-4 md:p-8 relative bg-black">
          <div className="w-full h-full max-w-7xl max-h-[calc(100vh-1rem)] md:max-h-[calc(100vh-4rem)] bg-white flex flex-col border-2 md:border-4 border-black overflow-hidden relative">
            {/* Top Bar */}
            <div className="flex border-b-2 md:border-b-4 border-black bg-white justify-between items-center px-3 md:px-4 py-1.5 md:py-2 uppercase font-bold text-[10px] md:text-sm tracking-widest flex-shrink-0 text-black">
              <span>EXPERIENCE [02]</span>
              <span>Sep 2025 — Mar 2026</span>
            </div>

            {/* Brutalist KPI Metric Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 border-b-2 md:border-b-4 border-black bg-zinc-100 text-black flex-shrink-0">
              <div className="p-1.5 md:p-3 border-r border-b md:border-b-0 border-black flex flex-col">
                <span className="font-mono text-[9px] md:text-xs text-zinc-500 uppercase font-bold tracking-wider">Quality Metric</span>
                <span className="text-sm md:text-2xl font-bold font-mono tracking-tight">Strict SLAs</span>
              </div>
              <div className="p-1.5 md:p-3 border-b md:border-b-0 md:border-r border-black flex flex-col">
                <span className="font-mono text-[9px] md:text-xs text-zinc-500 uppercase font-bold tracking-wider">Domain Focus</span>
                <span className="text-sm md:text-2xl font-bold font-mono tracking-tight text-blue-600">AI Transcription</span>
              </div>
              <div className="p-1.5 md:p-3 border-r border-black flex flex-col">
                <span className="font-mono text-[9px] md:text-xs text-zinc-500 uppercase font-bold tracking-wider">Validation Type</span>
                <span className="text-sm md:text-2xl font-bold font-mono tracking-tight truncate">Human-in-the-Loop</span>
              </div>
              <div className="p-1.5 md:p-3 flex flex-col">
                <span className="font-mono text-[9px] md:text-xs text-zinc-500 uppercase font-bold tracking-wider">Breach Rate</span>
                <span className="text-sm md:text-2xl font-bold font-mono tracking-tight text-emerald-600">0.00%</span>
              </div>
            </div>

            {/* Main Content Split */}
            <div className="flex flex-col md:flex-row flex-1 overflow-y-auto md:overflow-hidden relative z-10">
              {/* Left Column */}
              <div className="flex-1 p-4 md:p-8 lg:p-12 border-b-2 md:border-b-0 md:border-r-4 border-black flex flex-col justify-between bg-white text-black">
                <div>
                  <div className="inline-block bg-zinc-900 text-white font-mono text-[9px] md:text-xs font-bold px-2 py-0.5 md:px-2.5 md:py-1 mb-2 md:mb-3 uppercase tracking-widest">
                    Transcription Quality Analyst / Data Annotator
                  </div>
                  <h3 className="text-xl md:text-4xl lg:text-5xl font-bold uppercase tracking-tighter mb-2 md:mb-3 leading-none text-black">
                    INFLXD
                  </h3>
                  <p className="text-sm md:text-xl lg:text-2xl text-zinc-700 font-medium leading-snug mb-3 md:mb-4">
                    Conducted rigorous quality analysis and benchmark validation on automated speech-to-text outputs and model transcriptions.
                  </p>
                  <p className="text-xs md:text-sm text-zinc-600 leading-relaxed font-sans mb-3 md:mb-6">
                    Audited high-stakes corporate conference calls, legal audio, and earnings transcripts—detecting hallucinated figures, technical misinterpretations, and acoustic errors under strict delivery deadlines.
                  </p>

                  <div className="flex flex-wrap gap-1.5 md:gap-2 mb-3">
                    <span className="px-2 py-0.5 bg-zinc-100 border border-zinc-300 font-mono text-[10px] md:text-[11px] font-bold">Named Entity Recognition</span>
                    <span className="px-2 py-0.5 bg-zinc-100 border border-zinc-300 font-mono text-[10px] md:text-[11px] font-bold">Acoustic QA</span>
                    <span className="px-2 py-0.5 bg-zinc-100 border border-zinc-300 font-mono text-[10px] md:text-[11px] font-bold">Numerical Drift Detection</span>
                  </div>
                </div>

                <div className="pt-3 md:pt-4 border-t-2 border-zinc-200">
                  <div className="inline-block bg-black text-white px-3 py-1.5 font-bold text-xs uppercase tracking-widest font-mono">
                    Zero SLA Breaches Across Full Tenure
                  </div>
                </div>
              </div>

              {/* Right Column: AI Benchmarking Console */}
              <div className="inflxd-visual flex-1 p-4 md:p-8 lg:p-12 flex items-center justify-center relative bg-zinc-100 overflow-hidden perspective-[1000px]">
                <motion.div
                  style={{ x: parallaxX, y: parallaxY }}
                  className="w-full border-2 md:border-4 border-black flex flex-col p-3 md:p-6 font-mono text-xs overflow-hidden relative shadow-[6px_6px_0px_black] md:shadow-[8px_8px_0px_black] bg-white text-black"
                >
                  <div className="flex justify-between items-center border-b-2 border-black pb-2 mb-3">
                    <span className="text-zinc-500 font-bold">&gt; AI_MODEL_EVALUATION_DIFF</span>
                    <span className="bg-red-500 text-white font-bold px-2 py-0.5 text-[9px] md:text-[10px]">HALLUCINATION_DETECTED</span>
                  </div>

                  <div className="mb-3">
                    <div className="text-zinc-500 font-bold mb-1 text-[10px] md:text-[11px] uppercase tracking-wider">Raw Model Transcription:</div>
                    <motion.div
                      animate={{ opacity: [1, 0.5, 1, 0.7, 1], x: [0, -1, 1, 0] }}
                      transition={{ duration: 0.25, repeat: Infinity, repeatDelay: 2.5 }}
                      className="line-through text-red-600 bg-red-50 p-2 border-l-4 border-red-500 font-bold text-xs md:text-base"
                    >
                      "The company reported <span className="bg-red-200 px-1">40 million</span> in Q3 revenues."
                    </motion.div>
                  </div>

                  <div className="mb-3">
                    <div className="text-zinc-600 font-bold mb-1 text-[10px] md:text-[11px] uppercase tracking-wider">Human Ground Truth (Verified by Seann):</div>
                    <div className="text-white bg-black p-2.5 md:p-3 text-xs md:text-base border-2 border-black font-bold tracking-tight flex items-center">
                      <motion.div
                        animate={{ width: ['0%', '100%', '100%', '0%'] }}
                        transition={{ duration: 4.5, repeat: Infinity, repeatDelay: 1.5, ease: 'easeInOut' }}
                        className="overflow-hidden whitespace-nowrap"
                      >
                        "The company reported <span className="underline decoration-emerald-400 decoration-2 text-emerald-300">14 million</span> in Q3 revenues."
                      </motion.div>
                      <motion.span
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 0.8 }}
                        className="inline-block w-1.5 h-3.5 bg-white ml-1 flex-shrink-0"
                      />
                    </div>
                  </div>

                  <div className="p-2 bg-zinc-50 border border-zinc-300 text-[9px] md:text-[10px] text-zinc-600 flex justify-between font-mono">
                    <span>Source: Earnings_Call_Aud.wav</span>
                    <span>Audit: 100% Passed</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* PANEL 3: Alorica / Google Fi Wireless (03)                   */}
        {/* ============================================================ */}
        <section className="w-screen h-full flex-shrink-0 flex items-center justify-center p-2.5 sm:p-4 md:p-8 relative bg-black">
          <div className="w-full h-full max-w-7xl max-h-[calc(100vh-1rem)] md:max-h-[calc(100vh-4rem)] bg-white flex flex-col border-2 md:border-4 border-black overflow-hidden relative">
            {/* Top Bar */}
            <div className="flex border-b-2 md:border-b-4 border-black bg-white justify-between items-center px-3 md:px-4 py-1.5 md:py-2 uppercase font-bold text-[10px] md:text-sm tracking-widest flex-shrink-0 text-black">
              <span>EXPERIENCE [03]</span>
              <span>Jan 2025 — Jan 2026</span>
            </div>

            {/* Brutalist KPI Metric Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 border-b-2 md:border-b-4 border-black bg-zinc-100 text-black flex-shrink-0">
              <div className="p-1.5 md:p-3 border-r border-b md:border-b-0 border-black flex flex-col">
                <span className="font-mono text-[9px] md:text-xs text-zinc-500 uppercase font-bold tracking-wider">Leadership Scope</span>
                <span className="text-sm md:text-2xl font-bold font-mono tracking-tight">15-Person Team</span>
              </div>
              <div className="p-1.5 md:p-3 border-b md:border-b-0 md:border-r border-black flex flex-col">
                <span className="font-mono text-[9px] md:text-xs text-zinc-500 uppercase font-bold tracking-wider">Operational Tier</span>
                <span className="text-sm md:text-2xl font-bold font-mono tracking-tight text-red-600">Tier-2 SME</span>
              </div>
              <div className="p-1.5 md:p-3 border-r border-black flex flex-col">
                <span className="font-mono text-[9px] md:text-xs text-zinc-500 uppercase font-bold tracking-wider">Enterprise Account</span>
                <span className="text-sm md:text-2xl font-bold font-mono tracking-tight truncate">Google Fi Wireless</span>
              </div>
              <div className="p-1.5 md:p-3 flex flex-col">
                <span className="font-mono text-[9px] md:text-xs text-zinc-500 uppercase font-bold tracking-wider">Resolution Rate</span>
                <span className="text-sm md:text-2xl font-bold font-mono tracking-tight text-black">98.4% First-Touch</span>
              </div>
            </div>

            {/* Main Content Split: Balanced 2 Columns */}
            <div className="flex flex-col md:flex-row flex-1 overflow-y-auto md:overflow-hidden relative z-10">
              {/* Left Column */}
              <div className="flex-1 p-4 md:p-8 lg:p-12 border-b-2 md:border-b-0 md:border-r-4 border-black flex flex-col justify-between bg-white text-black">
                <div>
                  <div className="inline-block bg-zinc-900 text-white font-mono text-[9px] md:text-xs font-bold px-2 py-0.5 md:px-2.5 md:py-1 mb-2 md:mb-3 uppercase tracking-widest">
                    Technical Support Rep → Team Support / Floor SME
                  </div>
                  <h3 className="text-xl md:text-4xl lg:text-5xl font-bold uppercase tracking-tighter mb-2 md:mb-3 leading-none text-black">
                    Alorica / Google Fi Wireless
                  </h3>
                  <p className="text-sm md:text-xl lg:text-2xl text-zinc-700 font-medium leading-snug mb-3 md:mb-4">
                    Directed real-time floor support and resolved complex tier-2 technical escalations for a high-volume 15-person engineering team.
                  </p>
                  <p className="text-xs md:text-sm text-zinc-600 leading-relaxed font-sans mb-3 md:mb-6">
                    Promoted to Team Support &amp; Subject Matter Expert (SME), troubleshooting cellular carrier routing, eSIM profile activations, and device telemetry bugs while conducting continuous calibration training for frontline agents.
                  </p>

                  <div className="flex flex-wrap gap-1.5 md:gap-2 mb-3">
                    <span className="px-2 py-0.5 bg-zinc-100 border border-zinc-300 font-mono text-[10px] md:text-[11px] font-bold">Network Provisioning</span>
                    <span className="px-2 py-0.5 bg-zinc-100 border border-zinc-300 font-mono text-[10px] md:text-[11px] font-bold">Tier-2 Escalations</span>
                    <span className="px-2 py-0.5 bg-zinc-100 border border-zinc-300 font-mono text-[10px] md:text-[11px] font-bold">Floor SME Coaching</span>
                  </div>
                </div>

                <div className="pt-3 md:pt-4 border-t-2 border-zinc-200">
                  <div className="inline-block bg-black text-white px-3 py-1.5 font-bold text-xs uppercase tracking-widest font-mono">
                    High Volume Tier-2 Operations &bull; 15-Person Team
                  </div>
                </div>
              </div>

              {/* Right Column: Live Incident Queue Terminal */}
              <div className="flex-1 p-4 md:p-8 lg:p-12 flex items-center justify-center relative bg-zinc-100 overflow-hidden perspective-[1000px]">
                <motion.div
                  style={{ x: parallaxX, y: parallaxY }}
                  className="w-full border-2 md:border-4 border-black bg-white flex flex-col p-3 md:p-6 shadow-[6px_6px_0px_black] md:shadow-[8px_8px_0px_black]"
                >
                  <div className="flex border-b-2 border-black pb-2 mb-3 justify-between items-center font-mono text-xs text-black">
                    <span className="font-bold">&gt; INCIDENT_QUEUE // LIVE</span>
                    <span className="animate-pulse bg-red-600 px-2 py-0.5 text-white font-bold text-[9px] md:text-[10px]">CRITICAL</span>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 md:gap-2 mb-3 font-mono text-[10px] md:text-[11px] text-center">
                    <div className="bg-zinc-100 border border-zinc-300 p-1.5 md:p-2">
                      <div className="text-zinc-400 text-[8px] md:text-[9px] uppercase">Queue</div>
                      <div className="font-bold text-red-600 text-xs md:text-sm">4 Critical</div>
                    </div>
                    <div className="bg-zinc-100 border border-zinc-300 p-1.5 md:p-2">
                      <div className="text-zinc-400 text-[8px] md:text-[9px] uppercase">Agents</div>
                      <div className="font-bold text-black text-xs md:text-sm">15 On Duty</div>
                    </div>
                    <div className="bg-zinc-100 border border-zinc-300 p-1.5 md:p-2">
                      <div className="text-zinc-400 text-[8px] md:text-[9px] uppercase">Avg Triage</div>
                      <div className="font-bold text-emerald-600 text-xs md:text-sm">11.4 min</div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 md:gap-2 font-mono text-[11px] md:text-xs">
                    <div className="flex justify-between items-center border-l-4 border-red-500 pl-2.5 bg-zinc-900 py-2 px-2.5 text-zinc-300">
                      <div>
                        <span className="font-bold text-white">TKT-8990:</span> eSIM Handshake Timeout
                      </div>
                      <span className="text-red-400 font-bold uppercase text-[9px] md:text-[10px]">Escalated</span>
                    </div>
                    <div className="flex justify-between items-center border-l-4 border-amber-500 pl-2.5 bg-zinc-900 py-2 px-2.5 text-zinc-300">
                      <div>
                        <span className="font-bold text-white">TKT-8991:</span> Carrier Switch Latency
                      </div>
                      <span className="text-amber-400 font-bold uppercase text-[9px] md:text-[10px]">Triage</span>
                    </div>
                    <div className="flex justify-between items-center border-l-4 border-emerald-500 pl-2.5 bg-zinc-900 py-2 px-2.5 text-zinc-300">
                      <div>
                        <span className="font-bold text-white">TKT-8992:</span> APN Config Resolved
                      </div>
                      <span className="text-emerald-400 font-bold uppercase text-[9px] md:text-[10px]">Closed</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* PANEL 4: Concentrix / Macy's (04)                            */}
        {/* ============================================================ */}
        <section className="w-screen h-full flex-shrink-0 flex items-center justify-center p-2.5 sm:p-4 md:p-8 relative bg-black">
          <div className="w-full h-full max-w-7xl max-h-[calc(100vh-1rem)] md:max-h-[calc(100vh-4rem)] bg-white flex flex-col border-2 md:border-4 border-black overflow-hidden relative">
            {/* Top Bar */}
            <div className="flex border-b-2 md:border-b-4 border-black bg-white justify-between items-center px-3 md:px-4 py-1.5 md:py-2 uppercase font-bold text-[10px] md:text-sm tracking-widest flex-shrink-0 text-black">
              <span>EXPERIENCE [04]</span>
              <span>Jul 2024 — Jan 2025</span>
            </div>

            {/* Brutalist KPI Metric Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 border-b-2 md:border-b-4 border-black bg-zinc-100 text-black flex-shrink-0">
              <div className="p-1.5 md:p-3 border-r border-b md:border-b-0 border-black flex flex-col">
                <span className="font-mono text-[9px] md:text-xs text-zinc-500 uppercase font-bold tracking-wider">Promotion Speed</span>
                <span className="text-sm md:text-2xl font-bold font-mono tracking-tight">3 Months</span>
              </div>
              <div className="p-1.5 md:p-3 border-b md:border-b-0 md:border-r border-black flex flex-col">
                <span className="font-mono text-[9px] md:text-xs text-zinc-500 uppercase font-bold tracking-wider">Workforce Scope</span>
                <span className="text-sm md:text-2xl font-bold font-mono tracking-tight text-blue-600">50+ Agents</span>
              </div>
              <div className="p-1.5 md:p-3 border-r border-black flex flex-col">
                <span className="font-mono text-[9px] md:text-xs text-zinc-500 uppercase font-bold tracking-wider">Core Analytics</span>
                <span className="text-sm md:text-2xl font-bold font-mono tracking-tight truncate">Excel Glidepaths</span>
              </div>
              <div className="p-1.5 md:p-3 flex flex-col">
                <span className="font-mono text-[9px] md:text-xs text-zinc-500 uppercase font-bold tracking-wider">Initial Standing</span>
                <span className="text-sm md:text-2xl font-bold font-mono tracking-tight text-emerald-600">#1 Top Agent</span>
              </div>
            </div>

            {/* Main Content Split */}
            <div className="flex flex-col-reverse md:flex-row flex-1 overflow-y-auto md:overflow-hidden relative z-10">
              {/* Left Column: Dynamic Glidepath Chart */}
              <div className="flex-1 p-4 md:p-8 lg:p-12 flex items-center justify-center bg-zinc-100 border-t-2 md:border-t-0 md:border-r-4 border-black perspective-[1000px]">
                <motion.div
                  style={{ x: parallaxX, y: parallaxY }}
                  className="w-full border-2 md:border-4 border-black bg-white flex flex-col p-3 md:p-6 relative overflow-hidden shadow-[6px_6px_0px_black] md:shadow-[8px_8px_0px_black]"
                >
                  <div className="font-mono text-xs md:text-sm font-bold mb-2 md:mb-3 border-b-2 border-black pb-2 text-black flex justify-between">
                    <span>[=VLOOKUP(Data!A:Z, Dashboard!B2, 5, FALSE)]</span>
                    <span className="text-zinc-500 font-mono text-[9px] md:text-[10px]">WFM_LIVE</span>
                  </div>

                  <div className="flex justify-between text-[10px] md:text-[11px] font-mono text-zinc-500 mb-2">
                    <span>CSAT GLIDEPATH TREND</span>
                    <span className="text-black font-bold">TARGET: 85% | ACTUAL: 92.4%</span>
                  </div>

                  <div className="h-28 md:h-40 flex items-end gap-2 md:gap-3 px-2 relative z-10 pb-2 border-b border-zinc-300">
                    {[45, 62, 55, 82, 74, 91, 98].map((h, i) => (
                      <motion.div
                        key={i}
                        className="flex-1 bg-zinc-800"
                        animate={{
                          height: [
                            `${h}%`,
                            `${Math.min(100, h + (i % 2 === 0 ? 12 : 6))}%`,
                            `${Math.max(20, h - 10)}%`,
                            `${h}%`,
                          ],
                        }}
                        transition={{
                          duration: 2.2 + i * 0.25,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                      />
                    ))}
                  </div>
                  <div className="absolute top-[58%] left-0 w-full border-t-2 border-red-500 border-dashed flex justify-end px-2 z-20 pointer-events-none">
                    <span className="bg-red-500 text-white text-[8px] md:text-[9px] font-bold px-1.5 py-0.5">GLIDEPATH TARGET</span>
                  </div>
                </motion.div>
              </div>

              {/* Right Column */}
              <div className="flex-1 p-4 md:p-8 lg:p-12 border-b-2 md:border-b-0 border-black flex flex-col justify-between bg-white text-black">
                <div>
                  <div className="inline-block bg-zinc-900 text-white font-mono text-[9px] md:text-xs font-bold px-2 py-0.5 md:px-2.5 md:py-1 mb-2 md:mb-3 uppercase tracking-widest">
                    Customer Service Rep → Reporting Analyst Apprentice
                  </div>
                  <h3 className="text-xl md:text-4xl lg:text-5xl font-bold uppercase tracking-tighter mb-2 md:mb-3 leading-none text-black">
                    Concentrix / Macy's
                  </h3>
                  <p className="text-sm md:text-xl lg:text-2xl text-zinc-700 font-medium leading-snug mb-3 md:mb-4">
                    Recognized as the top-ranking customer service agent within 3 months, earning an immediate promotion into Workforce Management reporting.
                  </p>
                  <p className="text-xs md:text-sm text-zinc-600 leading-relaxed font-sans mb-3 md:mb-6">
                    Automated performance dashboards, constructed VLOOKUP glidepath forecast spreadsheets, and supported 50+ representatives with real-time metric calibrations.
                  </p>

                  <div className="flex flex-wrap gap-1.5 md:gap-2 mb-3">
                    <span className="px-2 py-0.5 bg-zinc-100 border border-zinc-300 font-mono text-[10px] md:text-[11px] font-bold">WFM Automation</span>
                    <span className="px-2 py-0.5 bg-zinc-100 border border-zinc-300 font-mono text-[10px] md:text-[11px] font-bold">Glidepath Modeling</span>
                    <span className="px-2 py-0.5 bg-zinc-100 border border-zinc-300 font-mono text-[10px] md:text-[11px] font-bold">50+ Reps Supported</span>
                  </div>
                </div>

                <div className="pt-3 md:pt-4 border-t-2 border-zinc-200">
                  <div className="inline-block bg-black text-white px-3 py-1.5 font-bold text-xs uppercase tracking-widest font-mono">
                    Fast-Track Promotion &bull; Operations Reporting
                  </div>
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
          className="w-screen h-full flex-shrink-0 flex items-center justify-center p-2.5 sm:p-4 md:p-8 relative bg-black"
        >
          <div className="directors-cut-card w-full h-full max-w-7xl max-h-[calc(100vh-1rem)] md:max-h-[calc(100vh-4rem)] bg-white flex flex-col border-2 md:border-4 border-black overflow-hidden relative pointer-events-auto">
            {/* Header Bar */}
            <div className="flex border-b-2 md:border-b-4 border-black bg-white justify-between items-center px-3 md:px-4 py-1.5 md:py-2 uppercase font-bold text-[10px] md:text-sm tracking-widest text-black flex-shrink-0">
              <div className="flex items-center gap-2">
                <span className="bg-black text-white px-2 py-0.5 text-[9px] md:text-xs font-mono font-bold">
                  ARCHIVE [01]
                </span>
                <span>DIRECTOR&apos;S CUT</span>
              </div>
              <span className="font-mono text-xs text-zinc-600">2022 — 2024</span>
            </div>

            {/* Brutalist Laurel Strip */}
            <div className="grid grid-cols-2 md:grid-cols-3 border-b-2 md:border-b-4 border-black bg-zinc-100 text-black flex-shrink-0">
              <div className="p-1.5 md:p-3 border-r border-b md:border-b-0 border-black flex flex-col">
                <span className="font-mono text-[9px] md:text-xs text-zinc-500 uppercase font-bold tracking-wider">Competition Accolade</span>
                <span className="text-xs md:text-lg font-bold font-mono tracking-tight">2x Local Champion</span>
              </div>
              <div className="p-1.5 md:p-3 border-b md:border-b-0 md:border-r border-black flex flex-col">
                <span className="font-mono text-[9px] md:text-xs text-zinc-500 uppercase font-bold tracking-wider">Host Organization</span>
                <span className="text-xs md:text-lg font-bold font-mono tracking-tight text-black">STI Tagisan ng Sining</span>
              </div>
              <div className="p-1.5 md:p-3 col-span-2 md:col-span-1 flex flex-col">
                <span className="font-mono text-[9px] md:text-xs text-zinc-500 uppercase font-bold tracking-wider">Disciplines</span>
                <span className="text-xs md:text-lg font-bold font-mono tracking-tight truncate">Directing &bull; Editing &bull; Script</span>
              </div>
            </div>

            {/* Content Area: Responsive Card Showcase */}
            <div className="flex flex-col flex-1 overflow-y-auto p-3 md:p-6 z-10 text-black justify-between">
              <div className="text-center mb-2 md:mb-3 flex flex-col items-center">
                <h3 className="text-lg md:text-3xl lg:text-4xl font-bold uppercase tracking-tighter leading-none text-black">
                  Film &amp; Media Archive
                </h3>
                <p className="text-[11px] md:text-sm text-zinc-600 font-medium mt-1">
                  Selected short films, documentaries, and visual storytelling pieces.
                </p>
              </div>

              {/* 3-Column Video Card Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 md:gap-5 w-full max-w-5xl mx-auto items-stretch">
                {directorsCutFilms.map((film, idx) => (
                  <DirectorsCutCard
                    key={film.id}
                    film={film}
                    index={idx}
                    onSelect={(f) => onSelectFilm(f)}
                  />
                ))}
              </div>

              <div className="font-mono text-[9px] md:text-xs font-bold uppercase tracking-widest text-zinc-400 mt-2 md:mt-3 text-center">
                [ CLICK ANY FILM TO LAUNCH EMBEDDED PLAYER ]
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* PANEL 6: Core Skills (09)                                    */}
        {/* ============================================================ */}
        <section
          id="section-core-skills"
          className="w-screen h-full flex-shrink-0 flex items-center justify-center p-2.5 sm:p-4 md:p-8 relative bg-black"
        >
          <div className="w-full h-full max-w-7xl max-h-[calc(100vh-1rem)] md:max-h-[calc(100vh-4rem)] bg-black border-2 md:border-4 border-white flex flex-col justify-between p-3 md:p-8 lg:p-10 relative overflow-y-auto md:overflow-hidden">
            {/* Header Area */}
            <div className="border-b-2 md:border-b-4 border-white pb-2 md:pb-3 mb-3 md:mb-4 flex justify-between items-end flex-shrink-0">
              <div>
                <span className="font-mono text-[9px] md:text-xs text-zinc-400 font-bold uppercase tracking-widest block mb-1">
                  TECHNICAL COMPETENCIES // AUTOMATION STACK
                </span>
                <h2 className="text-2xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tighter leading-none text-white">
                  Core Skills
                </h2>
              </div>
              <div className="hidden md:block font-mono text-xs text-zinc-400 font-bold text-right">
                6 PRODUCTION CAPABILITIES<br/>OPERATIONAL &bull; SCRIPTED &bull; AI
              </div>
            </div>

            {/* Balanced 6-Card Grid: Responsive across mobile and desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 uppercase tracking-wider font-bold text-xs md:text-base text-white flex-1">
              {/* Skill 1 */}
              <div className="core-skill-item bg-zinc-950 border border-zinc-800 p-2.5 md:p-3.5 flex flex-col justify-between hover:border-white transition-colors">
                <div className="text-xs md:text-sm mb-1.5 text-white">Microsoft Excel &amp; Advanced Formulas</div>
                <div className="grid grid-cols-8 gap-1 h-4 md:h-5 mb-1.5">
                  {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ opacity: [0.2, 1, 0.2] }}
                      transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.12, ease: 'easeInOut' }}
                      className="bg-white"
                    />
                  ))}
                </div>
                <span className="font-mono text-[9px] md:text-[10px] text-zinc-500 normal-case">VLOOKUP, INDEX/MATCH, glidepath modeling, pivot pipelines</span>
              </div>

              {/* Skill 2 */}
              <div className="core-skill-item bg-zinc-950 border border-zinc-800 p-2.5 md:p-3.5 flex flex-col justify-between hover:border-white transition-colors">
                <div className="text-xs md:text-sm mb-1.5 text-white">Workflow Automation &amp; PowerApps</div>
                <div className="flex items-center gap-2 h-4 md:h-5 mb-1.5">
                  <motion.div
                    animate={{ rotate: 180 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'backInOut', repeatDelay: 0.5 }}
                    className="w-3.5 h-3.5 md:w-4 md:h-4 bg-white flex-shrink-0"
                  />
                  <div className="flex-1 h-1 bg-zinc-800 relative overflow-hidden">
                    <motion.div
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                      className="absolute inset-0 bg-white"
                    />
                  </div>
                  <motion.div
                    animate={{ scale: [1, 0.5, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-3.5 h-3.5 md:w-4 md:h-4 bg-zinc-500 rounded-full flex-shrink-0"
                  />
                </div>
                <span className="font-mono text-[9px] md:text-[10px] text-zinc-500 normal-case">End-to-end data pipeline automation &amp; operational flows</span>
              </div>

              {/* Skill 3 */}
              <div className="core-skill-item bg-zinc-950 border border-zinc-800 p-2.5 md:p-3.5 flex flex-col justify-between hover:border-white transition-colors">
                <div className="text-xs md:text-sm mb-1.5 text-white">Office Scripts &amp; TypeScript Automation</div>
                <div className="h-4 md:h-5 bg-zinc-900 px-2 flex items-center overflow-hidden mb-1.5">
                  <motion.div
                    animate={{ width: ['0%', '100%', '100%', '0%'] }}
                    transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 1, ease: 'linear' }}
                    className="font-mono text-[8px] md:text-xs text-zinc-300 whitespace-nowrap overflow-hidden"
                  >
                    <span className="text-red-400">const</span> <span className="text-blue-300">etl</span> = <span className="text-red-400">async</span> () =&gt; processSKU();
                  </motion.div>
                </div>
                <span className="font-mono text-[9px] md:text-[10px] text-zinc-500 normal-case">TypeScript scripts for automated batch transformation</span>
              </div>

              {/* Skill 4 */}
              <div className="core-skill-item bg-zinc-950 border border-zinc-800 p-2.5 md:p-3.5 flex flex-col justify-between hover:border-white transition-colors">
                <div className="text-xs md:text-sm mb-1.5 text-white">Claude Projects &amp; MCP Tooling</div>
                <div className="flex items-center gap-1.5 h-4 md:h-5 mb-1.5">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ height: ['20%', '100%', '20%'] }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.08, ease: 'easeInOut' }}
                      className="flex-1 max-w-[7px] bg-white rounded-full"
                    />
                  ))}
                </div>
                <span className="font-mono text-[9px] md:text-[10px] text-zinc-500 normal-case">Model Context Protocol integration, scrapers, prompt systems</span>
              </div>

              {/* Skill 5 */}
              <div className="core-skill-item bg-zinc-950 border border-zinc-800 p-2.5 md:p-3.5 flex flex-col justify-between hover:border-white transition-colors">
                <div className="text-xs md:text-sm mb-1.5 text-white">Real-Time Operations &amp; Floor SME</div>
                <div className="h-4 md:h-5 flex items-center border-l-2 border-red-500 bg-zinc-900 px-2 mb-1.5">
                  <motion.div
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="w-2 h-2 rounded-full bg-red-500 mr-2"
                  />
                  <span className="font-mono text-[8px] md:text-xs text-red-400 tracking-wider font-bold uppercase">Live Floor Support</span>
                </div>
                <span className="font-mono text-[9px] md:text-[10px] text-zinc-500 normal-case">Tier-2 escalation dispatch, team calibration, mentorship</span>
              </div>

              {/* Skill 6 */}
              <div className="core-skill-item bg-zinc-950 border border-zinc-800 p-2.5 md:p-3.5 flex flex-col justify-between hover:border-white transition-colors">
                <div className="text-xs md:text-sm mb-1.5 text-white">Data QA &amp; Operations Reporting</div>
                <div className="h-4 md:h-5 flex flex-col justify-between p-1 bg-black mb-1.5 relative overflow-hidden">
                  <div className="w-full h-0.5 bg-zinc-800" />
                  <div className="w-full h-0.5 bg-zinc-800" />
                  <motion.div
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-y-0 w-1/4 bg-white/30 pointer-events-none"
                  />
                </div>
                <span className="font-mono text-[9px] md:text-[10px] text-zinc-500 normal-case">Error auditing, SLA tracking, executive dashboards</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
