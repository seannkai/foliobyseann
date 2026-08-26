import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

const App = lazy(() => import('./App.tsx'))
const AdminPanel = lazy(() => import('./pages/AdminPanel.tsx'))

const Loader = () => (
  <div className="fixed inset-0 bg-black text-white flex flex-col items-center justify-center font-mono z-[99999]">
    <div className="text-2xl md:text-4xl font-bold tracking-widest uppercase mb-8 animate-pulse text-center">
      INITIALIZING_SYSTEM<span className="animate-ping">_</span>
    </div>
    <div className="w-64 h-4 bg-zinc-900 border-2 border-zinc-700 relative overflow-hidden flex items-center justify-center">
       <div className="w-full h-full bg-white animate-pulse" style={{ animationDuration: '0.5s' }} />
    </div>
  </div>
)

const isPanelRoute = typeof window !== 'undefined' && window.location.pathname.startsWith('/seannkaipanel')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={<Loader />}>
      {isPanelRoute ? <AdminPanel /> : <App />}
    </Suspense>
  </StrictMode>,
)
