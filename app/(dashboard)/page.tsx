import { getStats, getRecentVideos, getUserScripts } from '@/lib/db/queries';
import { V1_USER_ID } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default async function DashboardPage() {
  const [stats, recentVideos, allScripts] = await Promise.all([
    getStats(),
    getRecentVideos(5),
    getUserScripts(V1_USER_ID),
  ]);
  const recentScripts = allScripts.slice(0, 5);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-sm font-medium">Vidéos analysées</CardTitle></CardHeader>
          <CardContent><p className="text-4xl font-bold">{stats.videos}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm font-medium">Patterns extraits</CardTitle></CardHeader>
          <CardContent><p className="text-4xl font-bold">{stats.patterns}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm font-medium">Scripts générés</CardTitle></CardHeader>
          <CardContent><p className="text-4xl font-bold">{stats.scripts}</p></CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Vidéos récentes</h2>
          {recentVideos.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              Aucune vidéo. Le cron s'exécute à 03h00 UTC.
            </p>
          ) : (
            <div className="space-y-2">
              {recentVideos.map(v => (
                <div key={v.id} className="border rounded p-3 text-sm">
                  <p className="font-medium line-clamp-1">{v.title}</p>
                  <p className="text-muted-foreground">
                    {v.channel} — {v.viewCount.toLocaleString()} vues
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Scripts récents</h2>
          {recentScripts.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              Aucun script.{' '}
              <Link href="/generate" className="underline">Générer maintenant</Link>
            </p>
          ) : (
            <div className="space-y-2">
              {recentScripts.map(s => (
                <Link
                  key={s.id}
                  href={`/scripts/${s.id}`}
                  className="block border rounded p-3 text-sm hover:bg-muted transition-colors"
                >
                  <p className="font-medium line-clamp-1">{s.theme}</p>
                  <p className="text-muted-foreground">
                    {s.tone} — {Math.round(s.durationSeconds / 60)} min
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
