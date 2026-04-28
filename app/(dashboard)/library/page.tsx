export const dynamic = 'force-dynamic';

import { getRecentVideos, getTopPatterns } from '@/lib/db/queries';

export default async function LibraryPage() {
  const [recentVideos, topPatterns] = await Promise.all([
    getRecentVideos(20),
    getTopPatterns(20),
  ]);

  return (
    <div className="space-y-10">
      <div>
        <p className="text-xs font-mono text-[#FFE600] tracking-widest uppercase mb-2">Base de données</p>
        <h1 className="font-heading text-3xl font-bold">Bibliothèque</h1>
      </div>

      <section>
        <h2 className="font-heading text-lg font-semibold mb-4">
          Vidéos analysées
          <span className="ml-2 text-sm font-normal text-[#6B6560]">({recentVideos.length})</span>
        </h2>
        <div className="space-y-2">
          {recentVideos.map(v => (
            <div key={v.id} className="border border-[#1E1E1E] rounded p-4 flex items-start justify-between bg-[#0D0D0D]">
              <div>
                <p className="text-sm font-medium text-[#F5F0E8]">{v.title}</p>
                <p className="text-xs text-[#6B6560] mt-0.5">{v.channel}</p>
              </div>
              <div className="text-right text-xs shrink-0 ml-4">
                <p className="text-[#F5F0E8]">{v.viewCount.toLocaleString()} vues</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded border border-[#2E2E2E] text-[#6B6560]">{v.language}</span>
              </div>
            </div>
          ))}
          {recentVideos.length === 0 && (
            <p className="text-sm text-[#6B6560]">Aucune vidéo analysée — le cron s'exécute toutes les 2h.</p>
          )}
        </div>
      </section>

      <section>
        <h2 className="font-heading text-lg font-semibold mb-4">
          Top patterns
          <span className="ml-2 text-sm font-normal text-[#6B6560]">par score viral</span>
        </h2>
        <div className="space-y-2">
          {topPatterns.map(p => (
            <div key={p.id} className="border border-[#1E1E1E] rounded p-4 bg-[#0D0D0D]">
              <div className="flex items-center gap-2 mb-3">
                {[p.patternType, p.tone, p.durationBucket].map(tag => (
                  <span key={tag} className="px-2 py-0.5 rounded border border-[#2E2E2E] text-xs text-[#6B6560]">{tag}</span>
                ))}
                <span className="ml-auto text-xs text-[#FFE600] font-mono">
                  {p.viralityScore.toFixed(0)}
                </span>
              </div>
              <pre className="text-xs text-[#6B6560] overflow-x-auto bg-[#111111] p-3 rounded font-mono leading-relaxed">
                {JSON.stringify(p.content, null, 2)}
              </pre>
            </div>
          ))}
          {topPatterns.length === 0 && (
            <p className="text-sm text-[#6B6560]">Aucun pattern — le cron s'exécute toutes les 2h.</p>
          )}
        </div>
      </section>
    </div>
  );
}
