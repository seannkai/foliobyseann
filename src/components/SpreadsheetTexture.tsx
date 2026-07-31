import { motion } from 'framer-motion';
import flatworldData from '../data/flatworld.json';

export default function SpreadsheetTexture() {
  // Extract rows ignoring the first 3 metadata rows. 
  // Take ~40 rows for texture without overloading the DOM.
  const rows = flatworldData.slice(3, 43);
  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-white pointer-events-none">
      <motion.div 
        animate={{ y: ["0%", "-50%"] }} 
        transition={{ ease: "linear", duration: 40, repeat: Infinity }}
        className="w-[200%] opacity-80"
      >
        <table className="table-fixed w-full border-collapse text-[10px] md:text-xs font-mono text-zinc-600 uppercase">
          <tbody>
            {/* Duplicate for infinite vertical scroll loop */}
            {[...rows, ...rows].map((row: any, i: number) => ( 
              <tr key={i} className="border-b border-zinc-200">
                {/* Grab the raw values from the parsed JSON object and limit columns */}
                {Object.values(row).slice(0, 8).map((cell: any, j: number) => ( 
                  <td key={j} className="border-r border-zinc-200 px-3 py-2 truncate max-w-[150px]">
                    {cell || "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
      
      {/* Vignette overlay to fade out the top and bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-white" />
    </div>
  );
}
