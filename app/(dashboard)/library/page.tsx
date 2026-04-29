export const dynamic = 'force-dynamic';

import { getRecentVideos, getTopPatterns } from '@/lib/db/queries';
import { PatternLibrary } from '@/components/PatternLibrary';

export default async function LibraryPage() {
  const [recentVideos, topPatterns] = await Promise.all([
    getRecentVideos(200),
    getTopPatterns(200),
  ]);

  return (
    <div className="space-y-12">
      <div>
        <p className="text-xs font-mono text-[#FFE600] tracking-widest uppercase mb-2">Base de données</p>
        <h1 className="font-heading text-3xl font-bold">Bibliothèque</h1>
      </div>

      {/* videos */}
      <section>
        <h2 className="font-heading text-lg font-semibold mb-4">
          Vidéos analysées
          <span className="ml-2 text-sm font-normal text-[#6B6560]">({recentVideos.length})</span>
        </h2>
        <div className="space-y-2">
          {recentVideos.map(v => (
            <div key={v.id} className="border border-[#1E1E1E] rounded p-4 flex items-start justify-between bg-[#0D0D0D] hover:border-[#2E2E2E] transition-colors">
              <div className="min-w-0">
                <p className="text-sm font-medium text-[#F5F0E8] truncate">{v.title}</p>
                <p className="text-xs text-[#6B6560] mt-0.5">{v.channel}</p>
              </div>
              <div className="text-right text-xs shrink-0 ml-4 space-y-1">
                <p className="text-[#F5F0E8]">{v.viewCount.toLocaleString('fr-FR')} vues</p>
                <div className="flex items-center justify-end gap-2">
                  <span className="px-2 py-0.5 rounded border border-[#2E2E2E] text-[#6B6560]">{v.language}</span>
                  <a href={v.url} target="_blank" rel="noopener noreferrer" className="text-[#3A3A3A] hover:text-[#6B6560] transition-colors">
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                      <path d="M6.5 3.5h-3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-3M9 2h5v5M9 7l5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          ))}
          {recentVideos.length === 0 && (
            <p className="text-sm text-[#6B6560]">Aucune vidéo analysée — le cron s&apos;exécute toutes les 2h.</p>
          )}
        </div>
      </section>

      {/* patterns */}
      <section>
        <h2 className="font-heading text-lg font-semibold mb-4">
          Patterns viraux
          <span className="ml-2 text-sm font-normal text-[#6B6560]">({topPatterns.length})</span>
        </h2>
        <PatternLibrary patterns={topPatterns} />
      </section>
    </div>
  );
}
