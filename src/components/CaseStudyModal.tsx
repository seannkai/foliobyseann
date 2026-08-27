import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CaseStudyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CaseStudyModal({ isOpen, onClose }: CaseStudyModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 md:p-8 pointer-events-auto select-auto">
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
                  DOSSIER [01]
                </span>
                <span className="font-bold text-sm md:text-lg tracking-tight uppercase">
                  FLATWORLD × FLINN SCIENTIFIC
                </span>
              </div>
              <button
                onClick={onClose}
                className="hover:rotate-90 transition-transform p-1 text-white hover:text-zinc-300"
                aria-label="Close Case Study"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Scrollable Content Body */}
            <div className="p-6 md:p-10 overflow-y-auto space-y-8 text-left font-sans">
              
              {/* Title & Quick Stats Bar */}
              <div>
                <div className="font-mono text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">
                  CASE STUDY BREAKDOWN
                </div>
                <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tighter leading-none mb-6">
                  Processing 8,000 SKUs 4 Months Ahead of Schedule
                </h2>

                {/* Metric Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 font-mono">
                  <div className="border-2 border-black p-3 bg-zinc-100 shadow-[4px_4px_0px_black]">
                    <div className="text-[10px] uppercase text-zinc-600 font-bold">Catalog Size</div>
                    <div className="text-xl md:text-2xl font-bold">8,000+ SKUs</div>
                  </div>
                  <div className="border-2 border-black p-3 bg-zinc-100 shadow-[4px_4px_0px_black]">
                    <div className="text-[10px] uppercase text-zinc-600 font-bold">Velocity Jump</div>
                    <div className="text-xl md:text-2xl font-bold">12 → 100+/day</div>
                  </div>
                  <div className="border-2 border-black p-3 bg-black text-white shadow-[4px_4px_0px_rgba(0,0,0,0.3)]">
                    <div className="text-[10px] uppercase text-zinc-400 font-bold">Timeline Delivered</div>
                    <div className="text-xl md:text-2xl font-bold text-white">4 Mos Early</div>
                  </div>
                </div>
              </div>

              {/* Section 1: The Bottleneck */}
              <div className="border-l-4 border-black pl-4 md:pl-6 space-y-2">
                <div className="font-mono text-xs font-bold uppercase tracking-widest text-red-600">
                  [ 01 // THE BOTTLENECK & FAILURE MATH ]
                </div>
                <h3 className="text-xl md:text-2xl font-bold uppercase tracking-tight">
                  The Snail Bus: Why the 12-Month Project Was Failing
                </h3>
                <p className="text-sm md:text-base text-zinc-700 leading-relaxed font-medium">
                  The mandate was to pull items from the company catalog, locate exact matches across competitor websites, cross-verify pricing, and log records with strict QA validation over an 8,000-SKU catalog.
                </p>
                <div className="bg-zinc-100 border-2 border-black p-4 font-mono text-xs md:text-sm text-zinc-800">
                  <strong className="text-black uppercase block mb-1">The Failure Calculation:</strong>
                  Two months prior to joining, the existing team of 3 had completed only ~700 items (~12 items/day total across 3 people). At that rate, the team would finish less than half the catalog before the 12-month contract expired.
                </div>
              </div>

              {/* Section 2: The Automation Stack */}
              <div className="border-l-4 border-black pl-4 md:pl-6 space-y-3">
                <div className="font-mono text-xs font-bold uppercase tracking-widest text-blue-600">
                  [ 02 // THE AUTOMATION STACK ]
                </div>
                <h3 className="text-xl md:text-2xl font-bold uppercase tracking-tight">
                  Replacing Manual Grunt Work With Code & AI
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border-2 border-black p-4 bg-zinc-50">
                    <div className="font-mono text-xs font-bold uppercase text-black mb-1">
                      1. Claude Projects + MCP Web Scraper
                    </div>
                    <p className="text-xs md:text-sm text-zinc-600 leading-relaxed">
                      Secured Claude Team subscription, loaded project context into Claude Cowork to eliminate memory loss, and prompt-engineered live web MCP scraping to automate competitor cross-matching—cutting ~4 hours off every shift.
                    </p>
                  </div>
                  <div className="border-2 border-black p-4 bg-zinc-50">
                    <div className="font-mono text-xs font-bold uppercase text-black mb-1">
                      2. Office Scripts (TS) & VBA Macros
                    </div>
                    <p className="text-xs md:text-sm text-zinc-600 leading-relaxed">
                      Wrote custom TypeScript Office Scripts and VBA automations for batch data validation, duplicate checking, and error formatting across the core master sheet.
                    </p>
                  </div>
                  <div className="border-2 border-black p-4 bg-zinc-50">
                    <div className="font-mono text-xs font-bold uppercase text-black mb-1">
                      3. PowerApps & IT Collaboration
                    </div>
                    <p className="text-xs md:text-sm text-zinc-600 leading-relaxed">
                      Self-taught PowerApps and partnered directly with the enterprise IT department to deploy custom workflow tools and automated ingestion interfaces.
                    </p>
                  </div>
                  <div className="border-2 border-black p-4 bg-zinc-50">
                    <div className="font-mono text-xs font-bold uppercase text-black mb-1">
                      4. Live Velocity & KPI Trackers
                    </div>
                    <p className="text-xs md:text-sm text-zinc-600 leading-relaxed">
                      Designed automated progress trackers showing real-time SKU completion and individual team contributions, providing executive management with complete operational clarity.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 3: The Outcome */}
              <div className="border-l-4 border-black pl-4 md:pl-6 space-y-2">
                <div className="font-mono text-xs font-bold uppercase tracking-widest text-emerald-600">
                  [ 03 // THE OUTCOME & LEADERSHIP ]
                </div>
                <h3 className="text-xl md:text-2xl font-bold uppercase tracking-tight">
                  Appointed Project Lead & Delivered in Month 6
                </h3>
                <p className="text-sm md:text-base text-zinc-700 leading-relaxed font-medium">
                  Because the trackers immediately highlighted the velocity bottlenecks and automation gains, executive management promoted Seann to <strong>Project Lead</strong> to oversee the initiative through completion.
                </p>
                <div className="bg-black text-white p-4 font-mono text-xs md:text-sm border-2 border-black">
                  <span className="text-emerald-400 font-bold">&gt; FINAL RESULT:</span> The full 8,000-SKU catalog was delivered with zero QA backlog during Month 6—<strong>4 months ahead of the 12-month deadline</strong>.
                </div>
              </div>

            </div>

            {/* Modal Footer Actions */}
            <div className="border-t-4 border-black p-4 md:p-6 bg-zinc-100 flex flex-col sm:flex-row justify-between items-center gap-3 flex-shrink-0">
              <a
                href="https://docs.google.com/spreadsheets/d/1IKf3vmdh52uL-qnp_LxbFvr_8n_m6QFr6bTpyASTTeI/edit?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-black hover:bg-zinc-800 text-white px-5 py-3 font-mono font-bold text-xs md:text-sm uppercase tracking-widest transition-colors shadow-[4px_4px_0px_black] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
              >
                <span>Open Live Test Sheet</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>

              <button
                onClick={onClose}
                className="w-full sm:w-auto border-2 border-black bg-white hover:bg-black text-black hover:text-white px-5 py-3 font-mono font-bold text-xs md:text-sm uppercase tracking-widest transition-colors shadow-[4px_4px_0px_black] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
              >
                Close Dossier [Esc]
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
