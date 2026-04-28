import { ScriptStream } from '@/components/ScriptStream';

export default function GeneratePage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Générer un script</h1>
        <p className="text-muted-foreground mt-1">
          Remplis les 3 champs — le script s'affiche en temps réel, minute par minute.
        </p>
      </div>
      <ScriptStream />
    </div>
  );
}
