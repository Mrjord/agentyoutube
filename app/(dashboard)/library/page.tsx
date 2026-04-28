import { getRecentVideos } from '@/lib/db/queries';
import { db } from '@/lib/db';
import { patterns } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import { Badge } from '@/components/ui/badge';

export default async function LibraryPage() {
  const [recentVideos, topPatterns] = await Promise.all([
    getRecentVideos(20),
    db.select().from(patterns).orderBy(desc(patterns.viralityScore)).limit(20),
  ]);

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold">Bibliothèque</h1>

      <section>
        <h2 className="text-xl font-semibold mb-4">
          Vidéos analysées ({recentVideos.length})
        </h2>
        <div className="grid gap-3">
          {recentVideos.map(v => (
            <div key={v.id} className="border rounded p-4 flex items-start justify-between">
              <div>
                <p className="font-medium">{v.title}</p>
                <p className="text-sm text-muted-foreground">{v.channel}</p>
              </div>
              <div className="text-right text-sm shrink-0 ml-4">
                <p>{v.viewCount.toLocaleString()} vues</p>
                <Badge variant="outline" className="mt-1">{v.language}</Badge>
              </div>
            </div>
          ))}
          {recentVideos.length === 0 && (
            <p className="text-muted-foreground text-sm">
              Aucune vidéo analysée — le cron s'exécute à 03h00 UTC.
            </p>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Top patterns (par score viral)</h2>
        <div className="grid gap-3">
          {topPatterns.map(p => (
            <div key={p.id} className="border rounded p-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge>{p.patternType}</Badge>
                <Badge variant="outline">{p.tone}</Badge>
                <Badge variant="outline">{p.durationBucket}</Badge>
                <span className="ml-auto text-xs text-muted-foreground">
                  Score: {p.viralityScore.toFixed(0)}
                </span>
              </div>
              <pre className="text-xs text-muted-foreground overflow-x-auto bg-muted p-2 rounded">
                {JSON.stringify(p.content, null, 2)}
              </pre>
            </div>
          ))}
          {topPatterns.length === 0 && (
            <p className="text-muted-foreground text-sm">Aucun pattern — lancez le cron.</p>
          )}
        </div>
      </section>
    </div>
  );
}
