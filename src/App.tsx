import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import ReceiptsBackground from './components/ReceiptsBackground';
import ScrollPrompt from './components/ScrollPrompt';
import TableOfContents from './components/TableOfContents';
import CaseStudyModal from './components/CaseStudyModal';
import VideoModal from './components/VideoModal';
import HorizontalCareerScroll from './components/HorizontalCareerScroll';
import type { DirectorsCutFilm } from './data/directorsCut';

export default function App() {
  const [isCaseStudyOpen, setIsCaseStudyOpen] = useState(false);
  const [selectedFilm, setSelectedFilm] = useState<DirectorsCutFilm | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: rawProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // High stiffness, low damping for smooth, snappy response
  const progress = useSpring(rawProgress, { stiffness: 70, damping: 20, restDelta: 0.001 });

  /* 
    TIMELINE (0 to 1 over h-[2600vh]):
    0.00 - 0.12: Intro (HEY, IM SEANN)
    0.13 - 0.25: Thesis 1 ("PROCESS")
    0.26 - 0.38: Thesis 2 ("FRAGILE MESS")
    0.39 - 0.52: Statement ("CODE")
    0.50 - 0.58: The Receipts (Experience Intro)
    0.58 - 0.88: Career Block through Core Skills (GSAP Horizontal Scroll)
    0.88 - 0.96: Education
    0.97 - 1.00: Footer / About Me
  */

  // 1. Intro: HEY IM SEANN
  const i1Clip = useTransform(progress, [0, 0.10, 0.12], ['inset(0% 0% 0% 0%)', 'inset(0% 0% 0% 0%)', 'inset(0% 0% 100% 0%)']);
  const heyX = useTransform(progress, [0, 0.02, 0.05], ['35%', '35%', '0%']);
  const imSeannClip = useTransform(progress, [0, 0.02, 0.05], ['inset(0 100% 0 0)', 'inset(0 100% 0 0)', 'inset(0 0% 0 0)']);
  const bgCircle = useTransform(progress, [0.02, 0.05], ['circle(150% at center)', 'circle(0% at center)']);
  const textColor = useTransform(progress, [0.02, 0.05], ['#000000', '#ffffff']);
  const seannColor = useTransform(progress, [0.02, 0.05], ['#000000', '#71717a']);
  const smileyOpacity = useTransform(progress, [0.02, 0.035], [1, 0]);

  // 2. Intro: Thesis 1
  const t1Clip = useTransform(progress, [0.13, 0.15, 0.23, 0.25], ['inset(100% 0% 0% 0%)', 'inset(0% 0% 0% 0%)', 'inset(0% 0% 0% 0%)', 'inset(0% 0% 100% 0%)']);
  const t1Scale = useTransform(progress, [0.14, 0.25], [0.95, 1.05]);
  const t1MainY = useTransform(progress, [0.16, 0.17], ['60px', '0px']);

  // "PROCESS" Reveal & Stab Animation
  const processRevealClip = useTransform(progress, [0.16, 0.17], ['inset(100% 0 0 0)', 'inset(0% 0 0 0)']);
  const processY = useTransform(progress, [0.16, 0.17, 0.18, 0.185, 0.19, 0.20], ['80px', '0px', '0px', '-50px', '20px', '0px']);
  const processColor = useTransform(progress, [0.18, 0.182], ['#ffffff', '#991b1b']);
  const processScale = useTransform(progress, [0.18, 0.185, 0.19, 0.20], [1, 1.8, 0.8, 1.1]);
  const processRotate = useTransform(progress, [0.18, 0.185, 0.19, 0.20], ['0deg', '-25deg', '15deg', '-2deg']);
  const processSkew = useTransform(progress, [0.18, 0.185, 0.19, 0.20], ['0deg', '30deg', '-20deg', '0deg']);

  // 3. Intro: Thesis 2
  const t2Clip = useTransform(progress, [0.26, 0.28, 0.36, 0.38], ['inset(100% 0% 0% 0%)', 'inset(0% 0% 0% 0%)', 'inset(0% 0% 0% 0%)', 'inset(0% 0% 100% 0%)']);
  const t2Scale = useTransform(progress, [0.27, 0.38], [0.95, 1.05]);

  // "FRAGILE MESS" Break and Tape Animation
  const fragileRotate = useTransform(progress, [0.30, 0.31, 0.32, 0.33], ['0deg', '70deg', '70deg', '12deg']);
  const fragileY = useTransform(progress, [0.30, 0.31, 0.32, 0.33], ['0px', '60px', '60px', '10px']);
  const tapeOpacity = useTransform(progress, [0.32, 0.325], [0, 1]);

  // 4. Statement
  const sClip = useTransform(progress, [0.39, 0.41, 0.51, 0.52], ['inset(100% 0% 0% 0%)', 'inset(0% 0% 0% 0%)', 'inset(0% 0% 0% 0%)', 'inset(0% 0% 100% 0%)']);
  const sScale = useTransform(progress, [0.40, 0.49], [0.95, 1.1]);
  const codeWrapBg = useTransform(progress, [0.49, 0.50], ['transparent', '#ffffff']);
  const codeWrapScale = useTransform(progress, [0.49, 0.52], [1, 150]);

  // "CODE" Highlight & Matrix Scramble Animation
  const codeClip = useTransform(progress, [0.42, 0.44], ['inset(0 0 0 100%)', 'inset(0 0 0 0%)']);
  const cursorLeft = useTransform(progress, [0.42, 0.44], ['100%', '0%']);
  const cursorOpacity = useTransform(progress, [0.44, 0.445], [1, 0]);

  const codeText = useTransform(progress, (p) => {
    if (p < 0.44) return 'CODE.';
    if (p < 0.445) return '<CODE/>';
    if (p < 0.45) return '01000011';
    if (p < 0.452) return '0xDEADBEEF';
    if (p < 0.454) return 'fn hack()';
    if (p < 0.456) return 'sudo rm -rf /';
    if (p < 0.458) return 'INJECT_PAYLOAD';
    if (p < 0.46) return 'ACCESS_GRANTED';
    if (p < 0.462) return '{ ... }';
    if (p < 0.464) return '01101111';
    if (p < 0.466) return 'OVERRIDE';
    if (p < 0.468) return 'SYS_BREACH';
    if (p < 0.47) return '0x00FF00';
    if (p < 0.472) return 'ROOT_ACCESS';
    if (p < 0.474) return 'COMPILING...';
    if (p < 0.476) return 'BUFFER_OVERFLOW';
    if (p < 0.478) return 'NO_SYSTEM_IS_SAFE';
    if (p < 0.48) return 'NULL_POINTER';
    if (p < 0.482) return 'HACK_THE_PLANET';
    if (p < 0.484) return '101010101';
    if (p < 0.486) return '0x1337';
    if (p < 0.488) return 'BYPASS_FIREWALL';
    return 'CODE.';
  });

  const codeBg = useTransform(progress, (p) => {
    if (p < 0.44) return '#ffffff';
    if (p < 0.445) return '#22c55e';
    if (p < 0.45) return '#06b6d4';
    if (p < 0.452) return '#eab308';
    if (p < 0.454) return '#ef4444';
    if (p < 0.456) return '#a855f7';
    if (p < 0.458) return '#f97316';
    if (p < 0.46) return '#84cc16';
    if (p < 0.462) return '#14b8a6';
    if (p < 0.464) return '#3b82f6';
    if (p < 0.466) return '#ec4899';
    if (p < 0.468) return '#ef4444';
    if (p < 0.47) return '#22c55e';
    if (p < 0.472) return '#3b82f6';
    if (p < 0.474) return '#eab308';
    if (p < 0.476) return '#a855f7';
    if (p < 0.478) return '#f97316';
    if (p < 0.48) return '#06b6d4';
    if (p < 0.482) return '#ef4444';
    if (p < 0.484) return '#22c55e';
    if (p < 0.486) return '#84cc16';
    if (p < 0.488) return '#a855f7';
    return '#ffffff';
  });

  const codeFont = useTransform(progress, (p) => {
    if (p < 0.44) return 'inherit';
    return 'monospace';
  });

  // 4.5. The Receipts (Experience Intro)
  const pClip = useTransform(progress, [0.50, 0.52, 0.56, 0.58], ['inset(100% 0% 0% 0%)', 'inset(0% 0% 0% 0%)', 'inset(0% 0% 0% 0%)', 'inset(0% 0% 100% 0%)']);
  const pScale = useTransform(progress, [0.51, 0.58], [1, 1.1]);

  // 5. Horizontal Career Scroll Block (Flatworld through Core Skills)
  const careerClip = useTransform(
    progress,
    [0.56, 0.58, 0.88, 0.90],
    ['inset(100% 0% 0% 0%)', 'inset(0% 0% 0% 0%)', 'inset(0% 0% 0% 0%)', 'inset(0% 0% 100% 0%)']
  );

  // 6. Education
  const eduClip = useTransform(progress, [0.88, 0.90, 0.96, 0.97], ['inset(100% 0% 0% 0%)', 'inset(0% 0% 0% 0%)', 'inset(0% 0% 0% 0%)', 'inset(0% 0% 100% 0%)']);
  const eduY = useTransform(progress, [0.88, 0.90, 0.96, 0.97], ['100px', '0px', '0px', '-100px']);

  // 7. Footer / About Me
  const ftClip = useTransform(progress, [0.97, 0.985, 1, 1], ['inset(100% 0% 0% 0%)', 'inset(0% 0% 0% 0%)', 'inset(0% 0% 0% 0%)', 'inset(0% 0% 0% 0%)']);
  const ftY = useTransform(progress, [0.97, 0.985, 1], ['200px', '0px', '0px']);

  // --- INTERACTIVITY: Mouse Tracking & Parallax ---
  const mouseX = useMotionValue(typeof window !== 'undefined' ? window.innerWidth / 2 : 0);
  const mouseY = useMotionValue(typeof window !== 'undefined' ? window.innerHeight / 2 : 0);

  const cursorX = useSpring(mouseX, { damping: 25, stiffness: 200, mass: 0.5 });
  const cursorY = useSpring(mouseY, { damping: 25, stiffness: 200, mass: 0.5 });

  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseX.set(e.touches[0].clientX);
        mouseY.set(e.touches[0].clientY);
      }
    };
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma !== null && e.beta !== null) {
        const clampedGamma = Math.min(Math.max(e.gamma, -45), 45);
        const mappedX = ((clampedGamma + 45) / 90) * window.innerWidth;
        mouseX.set(mappedX);

        const clampedBeta = Math.min(Math.max(e.beta, 0), 90);
        const mappedY = (clampedBeta / 90) * window.innerHeight;
        mouseY.set(mappedY);
      }
    };
    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('deviceorientation', handleOrientation);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('touchstart', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchend', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('deviceorientation', handleOrientation);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('touchstart', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [mouseX, mouseY]);

  const parallaxX = useTransform(mouseX, [0, typeof window !== 'undefined' ? window.innerWidth : 1920], [20, -20]);
  const parallaxY = useTransform(mouseY, [0, typeof window !== 'undefined' ? window.innerHeight : 1080], [20, -20]);

  return (
    <div
      ref={containerRef}
      className="bg-black text-white font-sans selection:bg-[var(--wp-block-synced-color)] selection:text-black h-[2600vh] relative w-full md:cursor-none select-none md:select-auto [-webkit-touch-callout:none] [-webkit-tap-highlight-color:transparent]"
    >
      <ScrollPrompt />
      <TableOfContents progress={progress} />

      {/* Custom Cursor */}
      <motion.div
        style={{ x: cursorX, y: cursorY, translateX: '-50%', translateY: '-50%' }}
        animate={{ scale: isClicking ? 0.5 : 1 }}
        transition={{ duration: 0.15 }}
        className="hidden md:block fixed top-0 left-0 w-8 h-8 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference"
      />

      {/* ============================================================ */}
      {/* Master Fixed Viewport: Razor-sharp, grounded, non-floating    */}
      {/* ============================================================ */}
      <div className="fixed top-0 left-0 h-screen w-full overflow-hidden flex items-center justify-center">
        {/* Radial Blast Background */}
        <motion.div
          style={{ clipPath: bgCircle }}
          className="absolute inset-0 bg-white z-0 pointer-events-none"
        />

        {/* Layer 1: HEY IM SEANN */}
        <motion.div
          style={{ clipPath: i1Clip }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none p-4 md:p-8 z-50"
        >
          <motion.h1
            style={{ x: heyX, color: textColor }}
            className="text-5xl md:text-7xl lg:text-[8rem] font-bold uppercase tracking-tighter text-center leading-none max-w-7xl mx-auto whitespace-nowrap"
          >
            Hey{' '}
            <span className="relative inline-block">
              <motion.span
                style={{ opacity: smileyOpacity }}
                className="absolute top-0 left-0 text-black lowercase"
              >
                :)
              </motion.span>
              <motion.span style={{ color: seannColor, clipPath: imSeannClip, display: 'inline-block' }}>
                I'm Seann.
              </motion.span>
            </span>
          </motion.h1>
        </motion.div>

        {/* Layer 2: Thesis 1 */}
        <motion.div
          style={{ clipPath: t1Clip, scale: t1Scale, y: t1MainY }}
          className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none p-4 md:p-8 z-40 bg-black"
        >
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold tracking-tighter text-center leading-none max-w-5xl mx-auto flex flex-col items-center">
            <span>Your company runs on manual workarounds disguised as</span>
            <motion.span
              style={{
                color: processColor,
                scale: processScale,
                rotate: processRotate,
                y: processY,
                skewX: processSkew,
                clipPath: processRevealClip,
                display: 'inline-block',
              }}
              className="font-bold whitespace-nowrap mt-2 md:mt-4"
            >
              "process".
            </motion.span>
          </h1>
        </motion.div>

        {/* Layer 3: Thesis 2 */}
        <motion.div
          style={{ clipPath: t2Clip, scale: t2Scale }}
          className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none p-4 md:p-8 z-40 bg-black"
        >
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-center leading-none max-w-5xl mx-auto flex flex-col items-center">
            <span>Nobody fixes it, because doing so requires</span>
            <span>admitting the system is</span>
            <motion.span
              style={{
                rotate: fragileRotate,
                y: fragileY,
                transformOrigin: 'top left',
                display: 'inline-block',
                position: 'relative',
              }}
              className="mt-2 text-white"
            >
              a fragile mess.
              {/* Comical Tape */}
              <motion.div
                style={{ opacity: tapeOpacity }}
                className="absolute -top-2 -right-8 w-24 h-12 bg-white/40 backdrop-blur-[2px] -rotate-12 border border-white/20 shadow-sm"
              />
              <motion.div
                style={{ opacity: tapeOpacity }}
                className="absolute top-4 -right-12 w-20 h-10 bg-white/30 backdrop-blur-[2px] rotate-45 border border-white/10 shadow-sm"
              />
            </motion.span>
          </h2>
        </motion.div>

        {/* Layer 4: Statement */}
        <motion.div
          style={{ clipPath: sClip, scale: sScale }}
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-4 md:p-8 z-50 bg-black"
        >
          <h1 className="text-5xl md:text-7xl lg:text-[8rem] font-bold tracking-tighter text-center leading-none max-w-6xl mx-auto flex flex-col items-center">
            <span>I replace the</span>
            <span>busywork with</span>
            <span className="relative inline-block mt-2 md:mt-4">
              <span>CODE.</span>

              {/* Highlight Sweep & Scramble Layer */}
              <motion.span
                style={{
                  clipPath: codeClip,
                  backgroundColor: codeWrapBg,
                  scale: codeWrapScale,
                  transformOrigin: 'center center',
                }}
                className="absolute inset-0 px-2 md:px-4 -mx-2 md:-mx-4 flex items-center justify-center whitespace-nowrap z-20"
              >
                <motion.span
                  style={{
                    backgroundColor: codeBg,
                    color: '#000000',
                    fontFamily: codeFont,
                  }}
                  className="px-2 w-full h-full flex items-center justify-center"
                >
                  <motion.span>{codeText as any}</motion.span>
                </motion.span>
              </motion.span>

              {/* Flashing Cursor */}
              <motion.div
                style={{ left: cursorLeft, opacity: cursorOpacity }}
                className="absolute top-0 bottom-0 w-1 md:w-2 bg-white animate-pulse z-30"
              />
            </span>
          </h1>
        </motion.div>

        {/* Layer 4.5: Proof of Work Intro */}
        <motion.div
          style={{ clipPath: pClip }}
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-4 md:p-8 z-50 bg-white"
        >
          <ReceiptsBackground progress={progress} />

          <motion.div
            style={{
              opacity: useTransform(progress, [0.54, 0.56], [0, 1]),
              scale: pScale,
            }}
            className="flex flex-col items-center z-10 mix-blend-difference text-white relative"
          >
            <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-bold tracking-tighter text-center leading-none max-w-6xl mx-auto">
              THE RECEIPTS.
            </h1>
            <motion.p
              style={{
                opacity: useTransform(progress, [0.55, 0.57], [0, 1]),
                y: useTransform(progress, [0.55, 0.57], [20, 0]),
              }}
              className="mt-2 md:mt-4 text-xl md:text-3xl font-mono tracking-widest lowercase font-bold"
            >
              my experience :)
            </motion.p>
          </motion.div>
        </motion.div>

        {/* Layer 5: GSAP Pinned Horizontal Career Sequence */}
        <motion.div
          style={{ clipPath: careerClip }}
          className="absolute inset-0 z-30 flex items-center justify-center pointer-events-auto"
        >
          <HorizontalCareerScroll
            parallaxX={parallaxX}
            parallaxY={parallaxY}
            onOpenCaseStudy={() => setIsCaseStudyOpen(true)}
            onSelectFilm={(f) => setSelectedFilm(f)}
          />
        </motion.div>

        {/* Layer 6: Education */}
        <motion.div
          style={{ clipPath: eduClip, y: eduY }}
          className="absolute inset-0 bg-black z-30 p-8 md:p-16 flex flex-col justify-center pointer-events-none text-white font-sans max-w-7xl mx-auto border-l-8 border-white"
        >
          <h2 className="text-5xl md:text-7xl lg:text-[8rem] font-bold uppercase tracking-tighter mb-12 md:mb-16 leading-none border-b-8 border-white pb-4">
            Education
          </h2>

          <div className="flex flex-col gap-12 pointer-events-auto">
            {/* UM */}
            <div className="border-l-4 border-white pl-6 md:pl-10 relative">
              <div className="absolute -left-[14px] top-0 w-6 h-6 bg-white rotate-45" />
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-tighter leading-none mb-2">
                Bachelor of Science in Computer Science
              </h3>
              <p className="text-xl md:text-2xl font-bold text-zinc-400 uppercase tracking-widest mb-4">
                University of Mindanao | Aug 2024 — Dec 2024
              </p>
              <div className="inline-block bg-white text-black px-3 py-1 font-bold text-xs uppercase tracking-widest">
                Technical Committee Staff - CCE Student Council
              </div>
            </div>

            {/* STI */}
            <div className="border-l-4 border-white pl-6 md:pl-10 relative">
              <div className="absolute -left-[14px] top-0 w-6 h-6 bg-white rotate-45" />
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-tighter leading-none mb-2">
                ICT in Mobile App and Web Development
              </h3>
              <p className="text-xl md:text-2xl font-bold text-zinc-400 uppercase tracking-widest mb-4">
                STI College Davao | Aug 2022 — Jul 2024
              </p>
              <div className="flex gap-2 flex-wrap">
                <div className="bg-white text-black px-3 py-1 font-bold text-xs uppercase tracking-widest">
                  Graduated With Honors
                </div>
                <div className="bg-white text-black px-3 py-1 font-bold text-xs uppercase tracking-widest">
                  Leadership Award
                </div>
                <motion.div
                  whileHover={{ scale: 1.05, backgroundColor: '#ffffff', color: '#000000' }}
                  className="bg-zinc-800 text-white px-3 py-1 font-bold text-xs uppercase tracking-widest border border-zinc-700 cursor-pointer relative group"
                >
                  Best Overall Exhibit
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-3 py-2 bg-black border-2 border-white text-white text-[10px] md:text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                    <span className="font-mono text-zinc-400 mr-2">&gt;</span>On-Time QR Attendance
                    System
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Certification */}
            <div className="border-l-4 border-zinc-600 pl-6 md:pl-10 relative mt-8">
              <div className="absolute -left-[14px] top-0 w-6 h-6 bg-zinc-600 rotate-45" />
              <h3 className="text-2xl md:text-3xl font-bold uppercase tracking-tighter leading-none mb-2 text-zinc-300">
                Responsive Web Design
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-lg font-bold text-zinc-500 uppercase tracking-widest">
                  freeCodeCamp.org | Apr 2024
                </p>
                <a
                  href="https://www.freecodecamp.org/certification/kaizo1101/responsive-web-design"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pointer-events-auto inline-flex items-center gap-1.5 bg-zinc-800 hover:bg-white text-zinc-300 hover:text-black border border-zinc-700 hover:border-black px-3 py-1 font-mono font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
                >
                  <span>Verify Credential ↗</span>
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Layer 7: Footer */}
        <motion.div
          style={{ clipPath: ftClip, y: ftY }}
          className="absolute inset-0 bg-white z-40 p-8 md:p-16 flex flex-col md:flex-row justify-between items-center md:items-end border-t-8 border-black overflow-y-auto"
        >
          <div className="flex flex-col gap-6 md:gap-8 mb-12 md:mb-0 pointer-events-auto items-center md:items-start text-center md:text-left flex-1">
            <img
              src="/seannomac-avatar.jpg"
              alt="Seann Omac"
              className="w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 object-cover border-8 border-black shadow-[10px_10px_0px_black] md:shadow-[15px_15px_0px_black]"
            />
            <p className="text-6xl md:text-8xl lg:text-[10rem] font-bold uppercase tracking-tighter leading-none text-black mt-4">
              SEANN
              <br />
              OMAC
            </p>

            <div className="border-l-4 border-black pl-4 md:pl-6 mt-6 md:mt-8 max-w-xl text-left">
              <p className="text-sm md:text-base lg:text-lg font-sans text-zinc-700 leading-relaxed normal-case font-medium mb-4">
                <strong className="text-black font-bold">
                  QA, data, automation, ops support, done fast.
                </strong>{' '}
                Twenty years old, self-taught, ENTP, allergic to doing anything the slow way
                twice. Hand me your calendar, your backlog, or your spreadsheet mess, I've already
                rebuilt it before you finish explaining the problem.
              </p>
              <div className="p-3 md:p-4 bg-zinc-100 border-2 border-black font-mono text-xs md:text-sm text-black font-bold tracking-tight shadow-[3px_3px_0px_black]">
                &gt; "If you need someone who follows instructions well but also flags the dumb
                step nobody’s questioned yet, hire me."
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end text-center md:text-right pointer-events-auto w-full md:w-auto shrink-0 md:pl-8">
            <div className="flex flex-col gap-4 md:gap-6 mb-8 md:mb-12 w-full md:w-auto">
              <a
                href="https://github.com/seannkai"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold uppercase text-3xl md:text-5xl lg:text-6xl text-black hover:bg-black hover:text-white px-4 md:px-6 py-3 md:py-4 transition-none border-4 border-transparent hover:border-black block w-full md:w-auto"
              >
                GitHub
              </a>
              <a
                href="https://linkedin.com/in/seannkai"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold uppercase text-3xl md:text-5xl lg:text-6xl text-black hover:bg-black hover:text-white px-4 md:px-6 py-3 md:py-4 transition-none border-4 border-transparent hover:border-black block w-full md:w-auto"
              >
                LinkedIn
              </a>
              <a
                href="https://instagram.com/seannkai"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold uppercase text-3xl md:text-5xl lg:text-6xl text-black hover:bg-black hover:text-white px-4 md:px-6 py-3 md:py-4 transition-none border-4 border-transparent hover:border-black block w-full md:w-auto"
              >
                Instagram
              </a>
              <a
                href="mailto:seanntheuser@gmail.com"
                className="font-bold uppercase text-3xl md:text-5xl lg:text-6xl text-black hover:bg-black hover:text-white px-4 md:px-6 py-3 md:py-4 transition-none border-4 border-transparent hover:border-black block w-full md:w-auto"
              >
                Email
              </a>
            </div>
            <p className="text-xs md:text-sm uppercase tracking-widest font-mono text-black">
              © 2026 Seann Omac. All rights reserved.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Case Study Breakdown Modal */}
      <CaseStudyModal isOpen={isCaseStudyOpen} onClose={() => setIsCaseStudyOpen(false)} />

      {/* Director's Cut Video Modal */}
      <VideoModal film={selectedFilm} onClose={() => setSelectedFilm(null)} />
    </div>
  );
}
