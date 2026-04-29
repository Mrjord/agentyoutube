'use client';

import { createContext, useContext, useState, useRef, useCallback } from 'react';

interface GuardActions {
  copy: () => void;
  download: () => Promise<void>;
}

interface SaveGuardContextValue {
  register: (actions: GuardActions) => void;
  clear: () => void;
  navigate: (fn: () => void) => void;
}

const SaveGuardContext = createContext<SaveGuardContextValue | null>(null);

export function useSaveGuard() {
  const ctx = useContext(SaveGuardContext);
  if (!ctx) throw new Error('useSaveGuard must be inside SaveGuardProvider');
  return ctx;
}

export function SaveGuardProvider({ children }: { children: React.ReactNode }) {
  const actionsRef = useRef<GuardActions | null>(null);
  const [pendingNav, setPendingNav] = useState<(() => void) | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const register = useCallback((actions: GuardActions) => {
    actionsRef.current = actions;
  }, []);

  const clear = useCallback(() => {
    actionsRef.current = null;
  }, []);

  const navigate = useCallback((fn: () => void) => {
    if (!actionsRef.current) { fn(); return; }
    setPendingNav(() => fn);
  }, []);

  const handleCopyThenGo = () => {
    actionsRef.current?.copy();
    actionsRef.current = null;
    const fn = pendingNav!;
    setPendingNav(null);
    fn();
  };

  const handleDownloadThenGo = async () => {
    setIsDownloading(true);
    try { await actionsRef.current?.download(); } finally { setIsDownloading(false); }
    actionsRef.current = null;
    const fn = pendingNav!;
    setPendingNav(null);
    fn();
  };

  const handleLeave = () => {
    actionsRef.current = null;
    const fn = pendingNav!;
    setPendingNav(null);
    fn();
  };

  const handleCancel = () => setPendingNav(null);

  return (
    <SaveGuardContext.Provider value={{ register, clear, navigate }}>
      {children}
      {pendingNav && (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleCancel} />
          <div className="relative bg-[#0D0D0D] border border-[#1E1E1E] rounded-2xl p-6 w-full max-w-sm mx-4 mb-4 sm:mb-0 space-y-4 shadow-2xl">
            <div className="text-center space-y-2">
              <div className="w-11 h-11 rounded-full bg-[#c4302b]/10 flex items-center justify-center mx-auto">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c4302b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              </div>
              <h2 className="text-[#F5F0E8] font-semibold text-base">Attention</h2>
              <p className="text-[#6B6560] text-sm leading-relaxed">
                Tu vas quitter cette page sans sauvegarder ton script. Il sera perdu.
              </p>
            </div>

            <div className="space-y-2 pt-1">
              <button
                onClick={handleCopyThenGo}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-[#1A1A1A] hover:bg-[#222] border border-[#2E2E2E] text-[#F5F0E8] text-sm font-medium transition-colors text-left"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                </svg>
                Copier le script puis continuer
              </button>
              <button
                onClick={handleDownloadThenGo}
                disabled={isDownloading}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-[#1A1A1A] hover:bg-[#222] border border-[#2E2E2E] text-[#F5F0E8] text-sm font-medium transition-colors text-left disabled:opacity-50"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                {isDownloading ? 'Téléchargement...' : 'Télécharger en Word puis continuer'}
              </button>
              <button
                onClick={handleCancel}
                className="w-full px-4 py-3 rounded-xl bg-[#c4302b]/10 hover:bg-[#c4302b]/15 border border-[#c4302b]/20 text-[#c4302b] text-sm font-medium transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleLeave}
                className="w-full text-xs text-red-500/60 hover:text-red-400 py-1.5 transition-colors"
              >
                Quitter sans sauvegarder
              </button>
            </div>
          </div>
        </div>
      )}
    </SaveGuardContext.Provider>
  );
}
