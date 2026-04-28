export const dynamic = 'force-dynamic';

import { getStats, getRecentVideos, getRecentScripts } from '@/lib/db/queries';
import { V1_USER_ID } from '@/lib/constants';
import Link from 'next/link';

export default async function DashboardPage() {
  const [stats, recentVideos, recentScripts] = await Promise.all([
    getStats(),
    getRecentVideos(5),
    getRecentScripts(V1_USER_ID, 5),
  ]);

  return (
    <div className="space-y-10">
      <div>
        <p className="text-xs font-mono text-[#FFE600] tracking-widest uppercase mb-2">Vue d'ensemble</p>
        <h1 className="font-heading text-3xl font-bold">Dashboard</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Vidéos analysées', value: stats.videos },
          { label: 'Patterns extraits', value: stats.patterns },
          { label: 'Scripts générés', value: stats.scripts },
        ].map(({ label, value }) => (
          <div key={label} className="border border-[#1E1E1E] rounded-lg p-5 bg-[#0D0D0D]">
            <p className="text-xs text-[#6B6560] mb-2">{label}</p>
            <p className="font-heading text-4xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-8">
        {/* Recent videos */}
        <div>
          <h2 className="font-heading text-lg font-semibold mb-4">Vidéos récentes</h2>
          {recentVideos.length === 0 ? (
            <p className="text-sm text-[#6B6560]">
              Aucune vidéo. Le cron s'exécute automatiquement toutes les 2h.
            </p>
          ) : (
            <div className="space-y-2">
              {recentVideos.map(v => (
                <div key={v.id} className="border border-[#1E1E1E] rounded p-3.5 bg-[#0D0D0D]">
                  <p className="text-sm font-medium line-clamp-1 text-[#F5F0E8]">{v.title}</p>
                  <p className="text-xs text-[#6B6560] mt-0.5">
                    {v.channel} — {v.viewCount.toLocaleString()} vues
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent scripts */}
        <div>
          <h2 className="font-heading text-lg font-semibold mb-4">Scripts récents</h2>
          {recentScripts.length === 0 ? (
            <p className="text-sm text-[#6B6560]">
              Aucun script.{' '}
              <Link href="/generate" className="text-[#FFE600] hover:underline">
                Générer maintenant →
              </Link>
            </p>
          ) : (
            <div className="space-y-2">
              {recentScripts.map(s => (
                <Link
                  key={s.id}
                  href={`/scripts/${s.id}`}
                  className="block border border-[#1E1E1E] rounded p-3.5 bg-[#0D0D0D] hover:border-[#2E2E2E] hover:bg-[#111111] transition-colors"
                >
                  <p className="text-sm font-medium line-clamp-1 text-[#F5F0E8]">{s.theme}</p>
                  <p className="text-xs text-[#6B6560] mt-0.5">
                    {s.tone} — {Math.round(s.durationSeconds / 60)} min
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="pt-4 border-t border-[#1E1E1E]">
        <Link
          href="/generate"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FFE600] text-[#0A0A0A] text-sm font-semibold rounded hover:bg-[#FFE600]/90 transition-colors"
        >
          Générer un script
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </div>
    </div>
  );
}
