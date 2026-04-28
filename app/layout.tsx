import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'YUBOT — Agent YouTube IA',
  description: 'Génère des scripts YouTube viraux optimisés pour la rétention',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <nav className="border-b px-6 py-3 flex items-center gap-6 bg-background">
          <span className="font-bold text-lg tracking-tight">YUBOT <span className="text-muted-foreground font-normal text-sm">— Agent YouTube IA</span></span>
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            Dashboard
          </Link>
          <Link href="/generate" className="text-sm text-muted-foreground hover:text-foreground">
            Générer
          </Link>
          <Link href="/library" className="text-sm text-muted-foreground hover:text-foreground">
            Bibliothèque
          </Link>
        </nav>
        <main className="container mx-auto px-6 py-8 max-w-6xl">{children}</main>
      </body>
    </html>
  );
}
