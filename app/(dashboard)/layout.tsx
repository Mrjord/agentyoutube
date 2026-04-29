'use client';

import { usePathname, useRouter } from 'next/navigation';
import { ChatBot } from '@/components/ChatBot';
import { SaveGuardProvider, useSaveGuard } from '@/components/SaveGuardProvider';

const NAV = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/generate', label: 'Générer' },
  { href: '/library', label: 'Bibliothèque' },
];

function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { navigate } = useSaveGuard();

  return (
    <aside className="w-[220px] shrink-0 h-screen sticky top-0 flex flex-col border-r border-[#1E1E1E] bg-[#0A0A0A]">
      <div className="px-5 py-5 border-b border-[#1E1E1E]">
        <button onClick={() => navigate(() => router.push('/'))} className="flex items-center gap-2.5">
          <span className="w-7 h-7 rounded bg-[#FFE600] flex items-center justify-center text-[#0A0A0A] font-heading font-bold text-sm">Y</span>
          <span className="font-heading font-semibold text-[#F5F0E8] tracking-tight">YUBOT</span>
        </button>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV.map(({ href, label }) => {
          const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
          return (
            <button
              key={href}
              onClick={() => navigate(() => router.push(href))}
              className={`flex items-center w-full px-3 py-2 rounded text-sm transition-colors ${
                active
                  ? 'bg-[#FFE600]/10 text-[#FFE600] font-medium'
                  : 'text-[#6B6560] hover:text-[#F5F0E8] hover:bg-[#161616]'
              }`}
            >
              {label}
            </button>
          );
        })}
      </nav>

      <div className="px-5 py-4 border-t border-[#1E1E1E]">
        <p className="text-xs text-[#3A3A3A]">YUBOT v1.0</p>
      </div>
    </aside>
  );
}

function DashboardContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === '/') {
    return <>{children}<ChatBot /></>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#0A0A0A]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="px-8 py-8 max-w-5xl">{children}</div>
      </main>
      <ChatBot />
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SaveGuardProvider>
      <DashboardContent>{children}</DashboardContent>
    </SaveGuardProvider>
  );
}
