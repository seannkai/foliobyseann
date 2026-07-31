import { motion, MotionValue, useTransform } from 'framer-motion';

interface Props {
  progress: MotionValue<number>;
}

// Pre-generate static random positions for 25 receipts
// We use a fixed seed-like approach by generating it once so they don't jump around on re-renders
const receipts = Array.from({ length: 30 }).map(() => {
  const top = -10 + Math.random() * 110;
  const left = -10 + Math.random() * 110;
  const rotate = -40 + Math.random() * 80;
  const width = 120 + Math.random() * 150;
  const height = 180 + Math.random() * 200;
  
  // They blow upwards from the bottom
  const targetY = 1500 + Math.random() * 1000;
  const targetX = -400 + Math.random() * 800;
  const targetRotate = rotate + (-360 + Math.random() * 720);

  return { top, left, rotate, width, height, targetY, targetX, targetRotate, zIndex: Math.floor(Math.random() * 20) };
});

export default function ReceiptsBackground({ progress }: Props) {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {receipts.map((r, i) => {
        // Fly in from bottom at 0.53, settle by 0.55
        const y = useTransform(progress, [0.53, 0.55], [r.targetY, 0]);
        const x = useTransform(progress, [0.53, 0.55], [r.targetX, 0]);
        const rot = useTransform(progress, [0.53, 0.55], [r.targetRotate, r.rotate]);
        
        return (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              top: `${r.top}%`,
              left: `${r.left}%`,
              width: r.width,
              height: r.height,
              y,
              x,
              rotate: rot,
              zIndex: r.zIndex
            }}
            className="bg-[#fcfcfc] border border-zinc-200 shadow-[2px_4px_12px_rgba(0,0,0,0.08)] flex flex-col p-3"
          >
            {/* Cluttered Tape */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-10 h-6 bg-yellow-900/10 backdrop-blur-[1px] rotate-[-5deg] border border-black/5" />
            
            {/* Fake text / receipt lines */}
            <div className="w-full h-3 bg-zinc-200 mb-3 mt-4" />
            <div className="w-3/4 h-2 bg-zinc-100 mb-2" />
            <div className="w-5/6 h-2 bg-zinc-100 mb-2" />
            <div className="w-full h-2 bg-zinc-100 mb-2" />
            <div className="w-1/2 h-2 bg-zinc-100 mb-6" />

            <div className="w-full h-px bg-zinc-300 mb-4 border-dashed border-b border-zinc-300" />
            
            <div className="w-full flex justify-between mb-2">
              <div className="w-1/3 h-2 bg-zinc-100" />
              <div className="w-1/4 h-2 bg-zinc-200" />
            </div>
            <div className="w-full flex justify-between mb-2">
              <div className="w-1/2 h-2 bg-zinc-100" />
              <div className="w-1/5 h-2 bg-zinc-200" />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
