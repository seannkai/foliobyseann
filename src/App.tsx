import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import SpreadsheetTexture from './components/SpreadsheetTexture';
import ReceiptsBackground from './components/ReceiptsBackground';
import ScrollPrompt from './components/ScrollPrompt';
import TableOfContents from './components/TableOfContents';

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: rawProgress } = useScroll({ 
    target: containerRef, 
    offset: ["start start", "end end"] 
  });
  
  // High stiffness, low damping for that snappy but smooth GSAP feel
  const progress = useSpring(rawProgress, { stiffness: 70, damping: 20, restDelta: 0.001 });

  /* 
    TIMELINE (0 to 1):
    0.00 - 0.08: HEY, IM SEANN
    0.08 - 0.15: Most business systems rely on manual workarounds.
    0.15 - 0.22: People tolerate them because fixing the system requires admitting it's broken.
    0.22 - 0.30: I replace manual work with code.
    0.30 - 0.42: Flatworld
    0.42 - 0.54: Concentrix
    0.54 - 0.66: INFLXD / Alorica
    0.66 - 0.82: Architecture
    0.82 - 1.00: Footer
  */

  // 1. Intro: HEY IM SEANN
  const i1Clip = useTransform(progress, [0, 0.10, 0.12], ["inset(0% 0% 0% 0%)", "inset(0% 0% 0% 0%)", "inset(0% 0% 100% 0%)"]);
  const heyX = useTransform(progress, [0, 0.02, 0.05], ["35%", "35%", "0%"]);
  const imSeannClip = useTransform(progress, [0, 0.02, 0.05], ["inset(0 100% 0 0)", "inset(0 100% 0 0)", "inset(0 0% 0 0)"]);
  const bgCircle = useTransform(progress, [0.02, 0.05], ["circle(150% at center)", "circle(0% at center)"]);
  const textColor = useTransform(progress, [0.02, 0.05], ["#000000", "#ffffff"]);
  const seannColor = useTransform(progress, [0.02, 0.05], ["#000000", "#71717a"]);
  const smileyOpacity = useTransform(progress, [0.02, 0.035], [1, 0]);

  // 2. Intro: Thesis 1
  // Wipes in 0.13 to 0.15, wipes out 0.23 to 0.25
  const t1Clip = useTransform(progress, [0.13, 0.15, 0.23, 0.25], ["inset(100% 0% 0% 0%)", "inset(0% 0% 0% 0%)", "inset(0% 0% 0% 0%)", "inset(0% 0% 100% 0%)"]);
  const t1Scale = useTransform(progress, [0.14, 0.25], [0.95, 1.05]);
  
  // Thesis 1 Main Text Y Shift
  const t1MainY = useTransform(progress, [0.16, 0.17], ["60px", "0px"]);

  // "PROCESS" Reveal & Absurd Stab Animation
  const processRevealClip = useTransform(progress, [0.16, 0.17], ["inset(100% 0 0 0)", "inset(0% 0 0 0)"]);
  const processY = useTransform(progress, [0.16, 0.17, 0.18, 0.185, 0.19, 0.20], ["80px", "0px", "0px", "-50px", "20px", "0px"]);
  const processColor = useTransform(progress, [0.18, 0.182], ["#ffffff", "#991b1b"]); 
  const processScale = useTransform(progress, [0.18, 0.185, 0.19, 0.20], [1, 1.8, 0.8, 1.1]); 
  const processRotate = useTransform(progress, [0.18, 0.185, 0.19, 0.20], ["0deg", "-25deg", "15deg", "-2deg"]); 
  const processSkew = useTransform(progress, [0.18, 0.185, 0.19, 0.20], ["0deg", "30deg", "-20deg", "0deg"]); 

  // 3. Intro: Thesis 2
  // Wipes in 0.26 to 0.28, wipes out 0.36 to 0.38
  const t2Clip = useTransform(progress, [0.26, 0.28, 0.36, 0.38], ["inset(100% 0% 0% 0%)", "inset(0% 0% 0% 0%)", "inset(0% 0% 0% 0%)", "inset(0% 0% 100% 0%)"]);
  const t2Scale = useTransform(progress, [0.27, 0.38], [0.95, 1.05]);

  // "FRAGILE MESS" Break and Tape Animation
  const fragileRotate = useTransform(progress, [0.30, 0.31, 0.32, 0.33], ["0deg", "70deg", "70deg", "12deg"]);
  const fragileY = useTransform(progress, [0.30, 0.31, 0.32, 0.33], ["0px", "60px", "60px", "10px"]);
  const tapeOpacity = useTransform(progress, [0.32, 0.325], [0, 1]);

  // 4. Statement
  // Wipes in 0.39 to 0.41, scrambles until 0.47, wipes out 0.49 to 0.51 (Added pause)
  const sClip = useTransform(progress, [0.39, 0.41, 0.54, 0.55], ["inset(100% 0% 0% 0%)", "inset(0% 0% 0% 0%)", "inset(0% 0% 0% 0%)", "inset(0% 0% 100% 0%)"]);
  const sScale = useTransform(progress, [0.40, 0.51], [0.95, 1.1]);
  const codeWrapBg = useTransform(progress, [0.49, 0.51], ["transparent", "#ffffff"]);
  const codeWrapScale = useTransform(progress, [0.49, 0.55], [1, 150]);

  // "CODE" Highlight & Matrix Scramble Animation
  const codeClip = useTransform(progress, [0.42, 0.44], ["inset(0 0 0 100%)", "inset(0 0 0 0%)"]);
  const cursorLeft = useTransform(progress, [0.42, 0.44], ["100%", "0%"]);
  const cursorOpacity = useTransform(progress, [0.44, 0.445], [1, 0]);

  const codeText = useTransform(progress, (p) => {
    if (p < 0.44) return "CODE.";
    if (p < 0.445) return "<CODE/>";
    if (p < 0.45) return "01000011";
    if (p < 0.452) return "0xDEADBEEF";
    if (p < 0.454) return "fn hack()";
    if (p < 0.456) return "sudo rm -rf /";
    if (p < 0.458) return "INJECT_PAYLOAD";
    if (p < 0.46) return "ACCESS_GRANTED";
    if (p < 0.462) return "{ ... }";
    if (p < 0.464) return "01101111";
    if (p < 0.466) return "OVERRIDE";
    if (p < 0.468) return "SYS_BREACH";
    if (p < 0.47) return "0x00FF00";
    if (p < 0.472) return "ROOT_ACCESS";
    if (p < 0.474) return "COMPILING...";
    if (p < 0.476) return "BUFFER_OVERFLOW";
    if (p < 0.478) return "NO_SYSTEM_IS_SAFE";
    if (p < 0.48) return "NULL_POINTER";
    if (p < 0.482) return "HACK_THE_PLANET";
    if (p < 0.484) return "101010101";
    if (p < 0.486) return "0x1337";
    if (p < 0.488) return "BYPASS_FIREWALL";
    return "CODE.";
  });
  const codeBg = useTransform(progress, (p) => {
    if (p < 0.44) return "#ffffff";
    if (p < 0.445) return "#22c55e"; 
    if (p < 0.45) return "#06b6d4"; 
    if (p < 0.452) return "#eab308"; 
    if (p < 0.454) return "#ef4444"; 
    if (p < 0.456) return "#a855f7"; 
    if (p < 0.458) return "#f97316"; 
    if (p < 0.46) return "#84cc16"; 
    if (p < 0.462) return "#14b8a6"; 
    if (p < 0.464) return "#3b82f6"; 
    if (p < 0.466) return "#ec4899";
    if (p < 0.468) return "#ef4444";
    if (p < 0.47) return "#22c55e";
    if (p < 0.472) return "#3b82f6";
    if (p < 0.474) return "#eab308";
    if (p < 0.476) return "#a855f7";
    if (p < 0.478) return "#f97316";
    if (p < 0.48) return "#06b6d4";
    if (p < 0.482) return "#ef4444";
    if (p < 0.484) return "#22c55e";
    if (p < 0.486) return "#84cc16";
    if (p < 0.488) return "#a855f7";
    return "#ffffff";
  });
  const codeFont = useTransform(progress, (p) => {
    if (p < 0.44) return "inherit";
    return "monospace";
  });

  // 4.5. The Receipts (Experience Intro)
  // Wipes in 0.52 to 0.54, wipes out 0.58 to 0.60
  const pClip = useTransform(progress, [0.52, 0.54, 0.58, 0.60], ["inset(100% 0% 0% 0%)", "inset(0% 0% 0% 0%)", "inset(0% 0% 0% 0%)", "inset(0% 0% 100% 0%)"]);
  const pScale = useTransform(progress, [0.53, 0.60], [1, 1.1]);

  // 5. Flatworld (01)
  const fClip = useTransform(progress, [0.61, 0.63, 0.67, 0.69], ["inset(100% 0% 0% 0%)", "inset(0% 0% 0% 0%)", "inset(0% 0% 0% 0%)", "inset(0% 0% 100% 0%)"]);
  const fY = useTransform(progress, [0.61, 0.63, 0.67, 0.69], ["50px", "0px", "0px", "-50px"]);
  const fVisualX = useTransform(progress, [0.61, 0.64], ["100%", "0%"]);

  // 6. INFLXD (02)
  const i2Clip = useTransform(progress, [0.69, 0.71, 0.75, 0.77], ["inset(100% 0% 0% 0%)", "inset(0% 0% 0% 0%)", "inset(0% 0% 0% 0%)", "inset(0% 0% 100% 0%)"]);
  const i2Y = useTransform(progress, [0.69, 0.71, 0.75, 0.77], ["50px", "0px", "0px", "-50px"]);
  const i2VisualX = useTransform(progress, [0.69, 0.72], ["100%", "0%"]);

  // 7. Alorica (03)
  const aClip = useTransform(progress, [0.75, 0.77, 0.81, 0.83], ["inset(100% 0% 0% 0%)", "inset(0% 0% 0% 0%)", "inset(0% 0% 0% 0%)", "inset(0% 0% 100% 0%)"]);
  const aY = useTransform(progress, [0.75, 0.77, 0.81, 0.83], ["50px", "0px", "0px", "-50px"]);
  const aVisualScale = useTransform(progress, [0.75, 0.78], [0.5, 1]);
  const aVisualOpacity = useTransform(progress, [0.75, 0.78], [0, 1]);

  // 8. Concentrix (04)
  const cClip = useTransform(progress, [0.81, 0.83, 0.87, 0.89], ["inset(100% 0% 0% 0%)", "inset(0% 0% 0% 0%)", "inset(0% 0% 0% 0%)", "inset(0% 0% 100% 0%)"]);
  const cY = useTransform(progress, [0.81, 0.83, 0.87, 0.89], ["50px", "0px", "0px", "-50px"]);
  const cVisualX = useTransform(progress, [0.81, 0.84], ["-100%", "0%"]);

  // 9. Core Skills
  const arClip = useTransform(progress, [0.87, 0.89, 0.93, 0.94], ["inset(100% 0% 0% 0%)", "inset(0% 0% 0% 0%)", "inset(0% 0% 0% 0%)", "inset(0% 0% 100% 0%)"]);
  const arY = useTransform(progress, [0.87, 0.89, 0.93, 0.94], ["100px", "0px", "0px", "-100px"]);

  // 10. Education
  const eduClip = useTransform(progress, [0.93, 0.94, 0.98, 0.995], ["inset(100% 0% 0% 0%)", "inset(0% 0% 0% 0%)", "inset(0% 0% 0% 0%)", "inset(0% 0% 100% 0%)"]);
  const eduY = useTransform(progress, [0.93, 0.94, 0.98, 0.995], ["100px", "0px", "0px", "-100px"]);

  // 11. Footer
  const ftClip = useTransform(progress, [0.99, 0.995, 1, 1], ["inset(100% 0% 0% 0%)", "inset(0% 0% 0% 0%)", "inset(0% 0% 0% 0%)", "inset(0% 0% 0% 0%)"]);
  const ftY = useTransform(progress, [0.99, 0.995, 1], ["200px", "0px", "0px"]);

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
        // Gamma (left-to-right): -45 to 45 degrees
        const clampedGamma = Math.min(Math.max(e.gamma, -45), 45);
        const mappedX = ((clampedGamma + 45) / 90) * window.innerWidth;
        mouseX.set(mappedX);
        
        // Beta (front-to-back): typically resting at 45 degrees. Range 0 to 90
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
    <div ref={containerRef} className="bg-black text-white font-sans selection:bg-[var(--wp-block-synced-color)] selection:text-black h-[2600vh] relative w-full md:cursor-none select-none md:select-auto [-webkit-touch-callout:none] [-webkit-tap-highlight-color:transparent]">
      
      <ScrollPrompt />
      <TableOfContents progress={progress} />

      {/* Custom Cursor */}
      <motion.div 
        style={{ x: cursorX, y: cursorY, translateX: "-50%", translateY: "-50%" }} 
        animate={{ scale: isClicking ? 0.5 : 1 }}
        transition={{ duration: 0.15 }}
        className="hidden md:block fixed top-0 left-0 w-8 h-8 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference"
      />

      {/* Master Fixed Container */}
      <div className="fixed top-0 left-0 h-screen w-full overflow-hidden flex items-center justify-center">
        
        {/* Radial Blast Background */}
        <motion.div style={{ clipPath: bgCircle }} className="absolute inset-0 bg-white z-0 pointer-events-none"></motion.div>

        {/* Layer 1: HEY IM SEANN */}
        <motion.div style={{ clipPath: i1Clip }} className="absolute inset-0 flex items-center justify-center pointer-events-none p-4 md:p-8 z-50">
          <motion.h1 style={{ x: heyX, color: textColor }} className="text-5xl md:text-7xl lg:text-[8rem] font-bold uppercase tracking-tighter text-center leading-none max-w-7xl mx-auto whitespace-nowrap">
            Hey{" "}
            <span className="relative inline-block">
              {/* The smiley is absolutely positioned to cover the start of "I'm Seann" */}
              <motion.span 
                style={{ opacity: smileyOpacity }} 
                className="absolute top-0 left-0 text-black lowercase"
              >
                :)
              </motion.span>
              
              {/* I'm Seann reveals from left to right */}
              <motion.span style={{ color: seannColor, clipPath: imSeannClip, display: 'inline-block' }}>
                I'm Seann.
              </motion.span>
            </span>
          </motion.h1>
        </motion.div>

        {/* Layer 2: Thesis 1 */}
        <motion.div style={{ clipPath: t1Clip, scale: t1Scale, y: t1MainY }} className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none p-4 md:p-8 z-40 bg-black">
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
                display: 'inline-block'
              }}
              className="font-bold whitespace-nowrap mt-2 md:mt-4"
            >
              "process".
            </motion.span>
          </h1>
        </motion.div>

        {/* Layer 3: Thesis 2 */}
        <motion.div style={{ clipPath: t2Clip, scale: t2Scale }} className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none p-4 md:p-8 z-40 bg-black">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-center leading-none max-w-5xl mx-auto flex flex-col items-center">
            <span>Nobody fixes it, because doing so requires</span>
            <span>admitting the system is</span>
            <motion.span 
              style={{
                rotate: fragileRotate,
                y: fragileY,
                transformOrigin: "top left",
                display: 'inline-block',
                position: 'relative'
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
        <motion.div style={{ clipPath: sClip, scale: sScale }} className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-4 md:p-8 z-50 bg-black">
          <h1 className="text-5xl md:text-7xl lg:text-[8rem] font-bold tracking-tighter text-center leading-none max-w-6xl mx-auto flex flex-col items-center">
            <span>I replace the</span>
            <span>busywork with</span>
            <span className="relative inline-block mt-2 md:mt-4">
              {/* Base Text */}
              <span>CODE.</span>

              {/* Highlight Sweep & Scramble Layer */}
              <motion.span 
                style={{ 
                  clipPath: codeClip, 
                  backgroundColor: codeWrapBg,
                  scale: codeWrapScale,
                  transformOrigin: "center center"
                }}
                className="absolute inset-0 px-2 md:px-4 -mx-2 md:-mx-4 flex items-center justify-center whitespace-nowrap z-20"
              >
                <motion.span 
                  style={{
                    backgroundColor: codeBg,
                    color: "#000000",
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
        <motion.div style={{ clipPath: pClip }} className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-4 md:p-8 z-50 bg-white">
          <ReceiptsBackground progress={progress} />
          
          <motion.div
            style={{ 
              opacity: useTransform(progress, [0.54, 0.56], [0, 1]),
              scale: pScale
            }}
            className="flex flex-col items-center z-10 mix-blend-difference text-white relative"
          >
            <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-bold tracking-tighter text-center leading-none max-w-6xl mx-auto">
              THE RECEIPTS.
            </h1>
            <motion.p
              style={{
                opacity: useTransform(progress, [0.55, 0.57], [0, 1]),
                y: useTransform(progress, [0.55, 0.57], [20, 0])
              }}
              className="mt-2 md:mt-4 text-xl md:text-3xl font-mono tracking-widest lowercase font-bold"
            >
              my experience :)
            </motion.p>
          </motion.div>
        </motion.div>

        {/* Layer 5: Flatworld */}
        <motion.div style={{ clipPath: fClip, y: fY }} className="absolute inset-0 z-30 flex items-center justify-center p-4 md:p-8 pointer-events-none">
           <div className="w-full h-full max-w-7xl bg-white flex flex-col border-4 border-black overflow-hidden relative">
           
           <div className="flex border-b-4 border-black bg-white justify-between items-center px-4 py-2 uppercase font-bold text-sm md:text-base tracking-widest flex-shrink-0 relative z-10 text-black">
              <span>EXPERIENCE [01]</span>
              <span>Jan 2026 — Jul 2026</span>
           </div>
           
           <div className="flex flex-col md:flex-row flex-1 overflow-hidden relative z-10">
             {/* Left Text */}
             <div className="flex-1 p-6 md:p-12 lg:p-16 border-b-4 md:border-b-0 md:border-r-4 border-black flex flex-col justify-center relative bg-white">
                <h3 className="text-4xl md:text-5xl lg:text-7xl font-bold uppercase tracking-tighter mb-4 leading-none">Flatworld</h3>
                <div className="font-mono text-xs md:text-sm font-bold text-zinc-500 mb-4 uppercase tracking-widest">Data Entry Executive / Product Management Associate</div>
                <p className="text-2xl md:text-4xl lg:text-5xl max-w-lg mb-8 leading-tight font-medium text-zinc-700">Wrote TypeScript Office Scripts to process 8,000 SKUs.</p>
                <div className="inline-block bg-black text-white px-3 py-2 self-start font-bold text-xs md:text-sm uppercase tracking-widest">
                  It cut processing time by two-thirds.
                </div>
             </div>
             {/* Right Visual */}
             <motion.div style={{ x: fVisualX }} className="flex-1 p-6 md:p-12 lg:p-16 flex items-center justify-center relative bg-zinc-100 overflow-hidden perspective-[1000px]">
                <SpreadsheetTexture />
                <motion.div style={{ x: parallaxX, y: parallaxY }} className="w-full aspect-video border-4 border-black flex flex-col p-4 md:p-6 font-mono text-[10px] md:text-xs overflow-hidden relative shadow-[10px_10px_0px_black] z-10 bg-white text-black">
                  <div className="absolute inset-0 bg-white/90 flex items-center justify-center p-4 backdrop-blur-[1px] z-10">
                    <div className="font-bold text-sm md:text-xl tracking-widest border-2 border-black p-4 md:p-8 shadow-[0_0_15px_rgba(0,0,0,0.3)] text-center bg-white text-black">
                      &gt; SCRIPT_EXEC_SUCCESS<br/>
                      &gt; 8,000 SKUs PROCESSED
                    </div>
                  </div>
                  <div className="flex border-b-2 border-zinc-300 pb-2 md:pb-4 mb-2 md:mb-4 gap-2 md:gap-4 text-zinc-500">
                    <span>SKU</span><span>PRICE</span><span>COMPETITOR</span>
                  </div>
                  {[1,2,3].map(i => (
                    <div key={i} className="flex gap-2 md:gap-4 mb-2 md:mb-3 text-black">
                      <span className="w-12 md:w-16">FW-{2048+i}</span><span className="w-10 md:w-12">$14.99</span><span className="w-16 md:w-24">Verifying...</span>
                    </div>
                  ))}
                </motion.div>
             </motion.div>
           </div>
           </div>
        </motion.div>

        {/* Layer 6: INFLXD */}
        <motion.div style={{ clipPath: i2Clip, y: i2Y }} className="absolute inset-0 z-30 flex items-center justify-center p-4 md:p-8 pointer-events-none">
           <div className="w-full h-full max-w-7xl bg-white flex flex-col border-4 border-black overflow-hidden relative">
           <div className="flex border-b-4 border-black bg-white justify-between items-center px-4 py-2 uppercase font-bold text-sm md:text-base tracking-widest text-black flex-shrink-0">
             <span>EXPERIENCE [02]</span>
             <span>Sep 2025 — Mar 2026</span>
           </div>
           
           <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
             {/* Left Text */}
             <div className="flex-1 p-6 md:p-12 lg:p-16 border-b-4 md:border-b-0 md:border-r-4 border-black flex flex-col justify-center bg-white text-black">
                <h3 className="text-4xl md:text-5xl lg:text-7xl font-bold uppercase tracking-tighter mb-4 leading-none">INFLXD</h3>
                <div className="font-mono text-xs md:text-sm font-bold text-zinc-500 mb-4 uppercase tracking-widest">Transcription Quality Analyst / Data Annotator</div>
                <p className="text-2xl md:text-4xl lg:text-5xl max-w-lg mb-8 leading-tight font-medium text-zinc-700">Corrected AI output for accuracy.</p>
                <div className="inline-block bg-black text-white px-3 py-2 self-start font-bold text-xs md:text-sm uppercase tracking-widest">
                  Maintained strict SLAs.
                </div>
             </div>
             {/* Right Visual */}
             <motion.div style={{ x: i2VisualX }} className="flex-1 p-6 md:p-12 lg:p-16 flex items-center justify-center relative bg-zinc-100 overflow-hidden perspective-[1000px]">
                <motion.div style={{ x: parallaxX, y: parallaxY }} className="w-full aspect-video border-4 border-black flex flex-col p-4 md:p-6 font-mono text-[10px] md:text-xs overflow-hidden relative shadow-[10px_10px_0px_black] bg-white text-black text-left">
                   <div className="text-zinc-500 mb-2 font-bold text-sm">AI_OUTPUT_EVAL:</div>
                   <motion.div 
                     animate={{ opacity: [1, 0.4, 1, 0.8, 1], x: [0, -2, 2, -1, 0] }}
                     transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 3 }}
                     className="line-through text-red-500 font-bold mb-6 text-base md:text-xl border-l-4 border-red-500 pl-4"
                   >
                     The company earned 40 million in Q3.
                   </motion.div>
                   <div className="text-zinc-400 mb-2 font-bold text-sm">HUMAN_CORRECTION (SEANN):</div>
                   <div className="text-white bg-black p-3 md:p-4 text-base md:text-xl mt-auto border-2 border-black font-bold tracking-tight flex items-center">
                     <motion.div 
                       initial={{ width: "0%" }}
                       whileInView={{ width: "100%" }}
                       transition={{ duration: 1.5, ease: "linear", delay: 0.2 }}
                       className="overflow-hidden whitespace-nowrap"
                     >
                       The company earned <span className="underline decoration-white decoration-2">14 million</span> in Q3.
                     </motion.div>
                     <motion.span 
                       animate={{ opacity: [0, 1, 0] }} 
                       transition={{ repeat: Infinity, duration: 0.8 }} 
                       className="inline-block w-2 md:w-3 h-5 md:h-6 bg-white ml-1 flex-shrink-0" 
                     />
                   </div>
                </motion.div>
             </motion.div>
           </div>
           </div>
        </motion.div>

        {/* Layer 7: Alorica */}
        <motion.div style={{ clipPath: aClip, y: aY }} className="absolute inset-0 z-30 flex items-center justify-center p-4 md:p-8 pointer-events-none">
           <div className="w-full h-full max-w-7xl bg-white flex flex-col border-4 border-black overflow-hidden relative">
           <div className="flex border-b-4 border-black bg-white justify-between items-center px-4 py-2 uppercase font-bold text-sm md:text-base tracking-widest text-black flex-shrink-0">
             <span>EXPERIENCE [03]</span>
             <span>Jan 2025 — Jan 2026</span>
           </div>
           
           <div className="flex flex-col flex-1 overflow-hidden relative justify-center items-center p-6 md:p-12 z-10">
              {/* Top Text (Centered) */}
              <div className="text-center mb-8 flex flex-col items-center text-black">
                 <h3 className="text-4xl md:text-5xl lg:text-7xl font-bold uppercase tracking-tighter mb-4 leading-none text-black">Alorica</h3>
                 <div className="font-mono text-xs md:text-sm font-bold text-zinc-500 mb-4 uppercase tracking-widest">Technical Support Representative → Temporary SME</div>
                 <p className="text-xl md:text-3xl text-zinc-300 max-w-2xl font-medium leading-tight mb-6">
                   Managed escalations and directed the floor.
                 </p>
                 <div className="inline-block bg-white text-black px-3 py-2 font-bold text-xs md:text-sm uppercase tracking-widest">
                   High volume traffic.
                 </div>
              </div>
              
              {/* Bottom Visual (Centered) */}
              <motion.div style={{ scale: aVisualScale, opacity: aVisualOpacity }} className="w-full max-w-2xl aspect-video md:aspect-[21/9] perspective-[1000px]">
                 <motion.div style={{ x: parallaxX, y: parallaxY }} className="w-full h-full border-4 border-black bg-white flex flex-col p-4 md:p-6 shadow-[10px_10px_0px_black]">
                   <div className="flex border-b-2 border-black pb-2 mb-4 justify-between items-end font-mono text-xs md:text-sm text-black relative z-20 bg-white">
                    <span>ESCALATION_QUEUE</span>
                    <span className="animate-pulse text-red-500 font-bold bg-zinc-900 px-2 py-1">CRITICAL</span>
                 </div>
                 <div className="flex-1 overflow-hidden relative">
                    <motion.div 
                      animate={{ y: ["0%", "-50%"] }} 
                      transition={{ duration: 8, ease: "linear", repeat: Infinity }}
                      className="flex flex-col gap-2 md:gap-3 absolute inset-x-0 top-0 w-full"
                    >
                      {[0,1,2,3, 4,5,6,7].map(i => (
                        <div key={i} className="flex justify-between items-center border-l-4 border-red-500 pl-3 bg-zinc-900 py-3 px-3 text-zinc-300 font-mono text-xs md:text-sm shadow-md flex-shrink-0">
                          <span className="font-bold text-white">TKT-{8990+(i%4)}</span>
                          <span className="text-red-500 font-bold uppercase tracking-widest">Escalated</span>
                        </div>
                      ))}
                    </motion.div>
                 </div>
                 </motion.div>
              </motion.div>
           </div>
           </div>
        </motion.div>

        {/* Layer 8: Concentrix */}
        <motion.div style={{ clipPath: cClip, y: cY }} className="absolute inset-0 z-30 flex items-center justify-center p-4 md:p-8 pointer-events-none">
           <div className="w-full h-full max-w-7xl bg-white flex flex-col border-4 border-black overflow-hidden relative">
           <div className="flex border-b-4 border-black bg-white justify-between items-center px-4 py-2 uppercase font-bold text-sm md:text-base tracking-widest text-black flex-shrink-0">
              <span>EXPERIENCE [04]</span>
              <span>Jul 2024 — Jan 2025</span>
           </div>
           
           <div className="flex flex-col-reverse md:flex-row flex-1 overflow-hidden">
             {/* Left Visual */}
             <motion.div style={{ x: cVisualX }} className="flex-1 p-6 md:p-12 lg:p-16 flex items-center justify-center bg-zinc-100 border-t-4 md:border-t-0 md:border-r-4 border-black perspective-[1000px]">
                <motion.div style={{ x: parallaxX, y: parallaxY }} className="w-full aspect-video border-4 border-black bg-white flex flex-col p-4 md:p-6 relative overflow-hidden shadow-[10px_10px_0px_black]">
                   <div className="font-mono text-[10px] md:text-sm font-bold mb-4 md:mb-6 border-b-2 border-black pb-2 md:pb-4 text-black">
                     [=VLOOKUP(Data!A:Z, Dashboard!B2, 5, FALSE)]
                   </div>
                   <div className="flex-1 flex items-end gap-2 md:gap-3 px-2 relative z-10">
                     {[40, 60, 45, 80, 65, 90, 100].map((h, i) => (
                       <motion.div 
                         key={i} 
                         className="flex-1 bg-zinc-400" 
                         animate={{ height: [`${h}%`, `${Math.min(100, h + (i%2==0?20:10))}%`, `${Math.max(10, h - 15)}%`, `${h}%`] }}
                         transition={{ duration: 2 + i * 0.3, repeat: Infinity, ease: "easeInOut" }}
                       />
                     ))}
                   </div>
                   <div className="absolute top-1/2 left-0 w-full border-t-4 border-black border-dashed transform -translate-y-1/2 flex justify-end px-2 z-20 pointer-events-none">
                     <span className="bg-black text-white text-[8px] md:text-xs font-bold px-1 md:px-2 py-1 mt-1">GLIDEPATH TARGET</span>
                   </div>
                   <motion.div 
                     animate={{ top: ["0%", "100%", "0%"] }} 
                     transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                     className="absolute left-0 w-full h-1 bg-white/20 z-30 pointer-events-none mix-blend-overlay"
                   />
                </motion.div>
             </motion.div>
             {/* Right Text */}
             <div className="flex-1 p-6 md:p-12 lg:p-16 border-b-4 md:border-b-0 md:border-r-0 border-black flex flex-col justify-center bg-white text-black">
                <h3 className="text-4xl md:text-5xl lg:text-7xl font-bold uppercase tracking-tighter mb-4 leading-none">Concentrix</h3>
                <div className="font-mono text-xs md:text-sm font-bold text-zinc-500 mb-4 uppercase tracking-widest">Customer Service Representative → Reporting Analyst Intern</div>
                <p className="text-2xl md:text-4xl lg:text-5xl max-w-lg mb-8 leading-tight font-medium text-zinc-700">Built glidepath models from performance data.</p>
                <div className="inline-block bg-black text-white px-3 py-2 self-start font-bold text-xs md:text-sm uppercase tracking-widest">
                  It dropped bounce rates drastically.
                </div>
             </div>
           </div>
           </div>
        </motion.div>

        {/* Layer 9: Core Skills */}
        <motion.div style={{ clipPath: arClip, y: arY }} className="absolute inset-0 w-full bg-black z-30 p-8 md:p-16 flex flex-col justify-center pointer-events-none max-w-7xl mx-auto">
          <h2 className="text-5xl md:text-7xl lg:text-[8rem] font-bold uppercase tracking-tighter mb-12 md:mb-16 leading-none border-b-8 border-white pb-4 text-white">
            Core<br/>Skills
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 md:gap-x-16 gap-y-6 md:gap-y-10 uppercase tracking-widest font-bold text-lg md:text-2xl lg:text-3xl text-white">
            
            {/* Skill 1: Microsoft Excel (Advanced) */}
            <motion.div whileHover={{ scale: 1.05, backgroundColor: "#ffffff", color: "#000000", padding: "1rem" }} className="border-b-4 border-zinc-800 pb-4 flex flex-col justify-between pointer-events-auto transition-colors cursor-pointer">
              <div className="mb-4">Microsoft Excel (Advanced)</div>
              <div className="grid grid-cols-4 gap-2 h-6 md:h-8">
                {[0,1,2,3,4,5,6,7].map(i => (
                  <motion.div 
                    key={i} 
                    animate={{ opacity: [0.2, 1, 0.2] }} 
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }} 
                    className="bg-white border-2 border-black" 
                  />
                ))}
              </div>
            </motion.div>

            {/* Skill 2: Workflow Automation */}
            <motion.div whileHover={{ scale: 1.05, backgroundColor: "#ffffff", color: "#000000", padding: "1rem" }} className="border-b-4 border-zinc-800 pb-4 flex flex-col justify-between pointer-events-auto transition-colors cursor-pointer">
              <div className="mb-4">Workflow Automation</div>
              <div className="flex items-center gap-2 h-6 md:h-8 mix-blend-difference">
                 <motion.div animate={{ rotate: 180 }} transition={{ duration: 1, repeat: Infinity, ease: "backInOut", repeatDelay: 0.5 }} className="w-6 h-6 md:w-8 md:h-8 bg-white flex-shrink-0" />
                 <div className="flex-1 h-1 md:h-2 bg-zinc-800 relative overflow-hidden">
                   <motion.div animate={{ x: ["-100%", "100%"] }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} className="absolute inset-0 bg-white" />
                 </div>
                 <motion.div animate={{ scale: [1, 0.5, 1] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }} className="w-6 h-6 md:w-8 md:h-8 bg-zinc-500 rounded-full flex-shrink-0" />
              </div>
            </motion.div>

            {/* Skill 3: Office Scripts / TypeScript */}
            <motion.div whileHover={{ scale: 1.05, backgroundColor: "#ffffff", color: "#000000", padding: "1rem" }} className="border-b-4 border-zinc-800 pb-4 flex flex-col justify-between pointer-events-auto transition-colors cursor-pointer">
              <div className="mb-4">Office Scripts / TypeScript</div>
              <div className="h-6 md:h-8 bg-zinc-900 border-2 border-zinc-700 p-1 md:p-2 flex items-center overflow-hidden relative mix-blend-difference">
                <motion.div 
                  initial={{ width: "0%" }}
                  whileInView={{ width: "100%" }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1, ease: "linear" }}
                  className="font-mono text-[10px] md:text-sm text-zinc-300 whitespace-nowrap overflow-hidden"
                >
                  <span className="text-red-400">const</span> <span className="text-blue-300">script</span> = <span className="text-red-400">async</span> () =&gt; success;
                </motion.div>
                <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ duration: 0.8, repeat: Infinity }} className="w-1.5 md:w-2 h-3 md:h-4 bg-white ml-1" />
              </div>
            </motion.div>

            {/* Skill 4: AI Integration */}
            <motion.div whileHover={{ scale: 1.05, backgroundColor: "#ffffff", color: "#000000", padding: "1rem" }} className="border-b-4 border-zinc-800 pb-4 flex flex-col justify-between pointer-events-auto transition-colors cursor-pointer">
              <div className="mb-4">AI Integration</div>
              <div className="flex items-center justify-center gap-1.5 md:gap-2 h-6 md:h-8 overflow-hidden mix-blend-difference">
                 {[1,2,3,4,5,6,7,8,9,10].map(i => (
                   <motion.div 
                     key={i} 
                     animate={{ height: ["20%", "100%", "20%"] }} 
                     transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.1, ease: "easeInOut" }} 
                     className="flex-1 max-w-[8px] bg-white rounded-full" 
                   />
                 ))}
              </div>
            </motion.div>

            {/* Skill 5: Real-Time Monitoring */}
            <motion.div whileHover={{ scale: 1.05, backgroundColor: "#ffffff", color: "#000000", padding: "1rem" }} className="border-b-4 border-zinc-800 pb-4 flex flex-col justify-between pointer-events-auto transition-colors cursor-pointer">
              <div className="mb-4">Real-Time Monitoring</div>
              <div className="h-6 md:h-8 relative overflow-hidden flex items-center border-l-4 border-red-500 bg-zinc-900 pl-3 mix-blend-difference">
                 <motion.div animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.8, repeat: Infinity }} className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-red-500 mr-2 md:mr-3 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                 <span className="font-mono text-[10px] md:text-sm text-red-400 tracking-widest uppercase font-bold">Live_Feed_Active</span>
                 <motion.div animate={{ x: ["-100%", "300%"] }} transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }} className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
              </div>
            </motion.div>

            {/* Skill 6: Data QA & Reporting */}
            <motion.div whileHover={{ scale: 1.05, backgroundColor: "#ffffff", color: "#000000", padding: "1rem" }} className="border-b-4 border-zinc-800 pb-4 flex flex-col justify-between pointer-events-auto transition-colors cursor-pointer">
              <div className="mb-4">Data QA & Reporting</div>
              <div className="h-6 md:h-8 flex flex-col justify-between overflow-hidden relative p-1 bg-black mix-blend-difference">
                 <div className="w-full h-1 bg-zinc-800" />
                 <div className="w-full h-1 bg-zinc-800" />
                 <div className="w-full h-1 bg-zinc-800" />
                 <motion.div animate={{ x: ["-100%", "200%"] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} className="absolute inset-y-0 w-1/4 border-x-4 border-white bg-white/20 pointer-events-none" />
              </div>
            </motion.div>

          </div>
        </motion.div>

        {/* Layer 10: Education */}
        <motion.div style={{ clipPath: eduClip, y: eduY }} className="absolute inset-0 bg-black z-30 p-8 md:p-16 flex flex-col justify-center pointer-events-none text-white font-sans max-w-7xl mx-auto border-l-8 border-white">
          <h2 className="text-5xl md:text-7xl lg:text-[8rem] font-bold uppercase tracking-tighter mb-12 md:mb-16 leading-none border-b-8 border-white pb-4">
            Education
          </h2>
          
          <div className="flex flex-col gap-12 pointer-events-auto">
            {/* UM */}
            <div className="border-l-4 border-white pl-6 md:pl-10 relative">
              <div className="absolute -left-[14px] top-0 w-6 h-6 bg-white rotate-45" />
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-tighter leading-none mb-2">Bachelor of Science in Computer Science</h3>
              <p className="text-xl md:text-2xl font-bold text-zinc-400 uppercase tracking-widest mb-4">University of Mindanao | Aug 2024 — Dec 2024</p>
              <div className="inline-block bg-white text-black px-3 py-1 font-bold text-xs uppercase tracking-widest">Technical Committee Staff - CCE Student Council</div>
            </div>

            {/* STI */}
            <div className="border-l-4 border-white pl-6 md:pl-10 relative">
              <div className="absolute -left-[14px] top-0 w-6 h-6 bg-white rotate-45" />
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-tighter leading-none mb-2">ICT in Mobile App and Web Development</h3>
              <p className="text-xl md:text-2xl font-bold text-zinc-400 uppercase tracking-widest mb-4">STI College Davao | Aug 2022 — Jul 2024</p>
              <div className="flex gap-2 flex-wrap">
                <div className="bg-white text-black px-3 py-1 font-bold text-xs uppercase tracking-widest">Graduated With Honors</div>
                <div className="bg-white text-black px-3 py-1 font-bold text-xs uppercase tracking-widest">Leadership Award</div>
                <motion.div whileHover={{ scale: 1.05, backgroundColor: "#ffffff", color: "#000000" }} className="bg-zinc-800 text-white px-3 py-1 font-bold text-xs uppercase tracking-widest border border-zinc-700 cursor-pointer relative group">
                  Best Overall Exhibit
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-3 py-2 bg-black border-2 border-white text-white text-[10px] md:text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                    <span className="font-mono text-zinc-400 mr-2">&gt;</span>On-Time QR Attendance System
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Certification */}
            <div className="border-l-4 border-zinc-600 pl-6 md:pl-10 relative mt-8">
              <div className="absolute -left-[14px] top-0 w-6 h-6 bg-zinc-600 rotate-45" />
              <h3 className="text-2xl md:text-3xl font-bold uppercase tracking-tighter leading-none mb-2 text-zinc-300">Responsive Web Design</h3>
              <p className="text-lg font-bold text-zinc-500 uppercase tracking-widest">freeCodeCamp.org | Apr 2024</p>
            </div>
          </div>
        </motion.div>

        {/* Layer 11: Footer */}
        <motion.div style={{ clipPath: ftClip, y: ftY }} className="absolute inset-0 bg-white z-40 p-8 md:p-16 flex flex-col md:flex-row justify-between items-center md:items-end border-t-8 border-black overflow-y-auto">
          <div className="flex flex-col gap-6 md:gap-8 mb-12 md:mb-0 pointer-events-auto items-center md:items-start text-center md:text-left flex-1">
            {/* Square, full color photo */}
            <img src="/seannomac-avatar.jpg" alt="Seann Omac" className="w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 object-cover border-8 border-black shadow-[10px_10px_0px_black] md:shadow-[15px_15px_0px_black]" />
            <p className="text-6xl md:text-8xl lg:text-[10rem] font-bold uppercase tracking-tighter leading-none text-black mt-4">SEANN<br/>OMAC</p>
            
            {/* About Me Text */}
            <div className="border-l-4 border-black pl-4 md:pl-6 mt-6 md:mt-8 max-w-xl text-left">
              <p className="text-sm md:text-base lg:text-lg font-mono text-zinc-700 leading-relaxed normal-case">
                <strong className="text-black">QA, data, automation, ops support, done fast.</strong> Twenty years old, self-taught, ENTP, allergic to doing anything the slow way twice. Hand me your calendar, your backlog, or your spreadsheet mess, I've already rebuilt it before you finish explaining the problem.
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center md:items-end text-center md:text-right pointer-events-auto w-full md:w-auto shrink-0 md:pl-8">
            <div className="flex flex-col gap-4 md:gap-6 mb-8 md:mb-12 w-full md:w-auto">
              <a href="https://github.com/seannkai" target="_blank" rel="noopener noreferrer" className="font-bold uppercase text-3xl md:text-5xl lg:text-6xl text-black hover:bg-black hover:text-white px-4 md:px-6 py-3 md:py-4 transition-none border-4 border-transparent hover:border-black block w-full md:w-auto">GitHub</a>
              <a href="https://linkedin.com/in/seannkai" target="_blank" rel="noopener noreferrer" className="font-bold uppercase text-3xl md:text-5xl lg:text-6xl text-black hover:bg-black hover:text-white px-4 md:px-6 py-3 md:py-4 transition-none border-4 border-transparent hover:border-black block w-full md:w-auto">LinkedIn</a>
              <a href="https://instagram.com/seannkai" target="_blank" rel="noopener noreferrer" className="font-bold uppercase text-3xl md:text-5xl lg:text-6xl text-black hover:bg-black hover:text-white px-4 md:px-6 py-3 md:py-4 transition-none border-4 border-transparent hover:border-black block w-full md:w-auto">Instagram</a>
              <a href="mailto:seanntheuser@gmail.com" className="font-bold uppercase text-3xl md:text-5xl lg:text-6xl text-black hover:bg-black hover:text-white px-4 md:px-6 py-3 md:py-4 transition-none border-4 border-transparent hover:border-black block w-full md:w-auto">Email</a>
            </div>
            <p className="text-xs md:text-sm uppercase tracking-widest font-mono text-black">© 2026 Seann Omac. All rights reserved.</p>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
