'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MenuIcon } from 'lucide-react';
import { Sheet, SheetContent, SheetFooter } from '@/components/ui/sheet';
import { Button, buttonVariants } from '@/components/ui/button';
import { TextScramble } from '@/components/ui/text-scramble';
import { cn } from '@/lib/utils';

const EASE = [0.65, 0, 0.35, 1] as const;

const NAV_LINKS = [
  { label: 'Fonctionnalités', href: '#features' },
  { label: 'Tarifs', href: '#pricing' },
  { label: 'Blog', href: '/blog' },
  { label: 'FAQ', href: '#faq' },
];

export function FloatingHeader() {
  const [open, setOpen] = React.useState(false);

  return (
    <motion.div
      className="sticky top-4 z-50 px-4"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: EASE }}
    >
      <header className={cn(
        'mx-auto w-full max-w-3xl rounded-full border border-[#1F1F25] overflow-hidden',
        'bg-[#050507]/90 backdrop-blur-lg shadow-2xl shadow-black/50',
      )}>
        <nav className="flex items-center justify-between p-1.5">
          {/* logo */}
          <Link href="/" className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-[#1F1F25] transition-colors">
            <motion.span
              className="w-6 h-6 rounded bg-[#c4302b] flex items-center justify-center text-[#050507] font-heading font-bold text-xs"
              whileHover={{ scale: 1.12, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              Y
            </motion.span>
            <span className="font-heading font-semibold tracking-tight text-[#F5F0E8] text-sm">YUBOT</span>
          </Link>

          {/* desktop links */}
          <div className="hidden md:flex items-center gap-0.5">
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                className={buttonVariants({ variant: 'ghost', size: 'sm', className: 'hover:bg-[#1F1F25]' })}
              >
                <TextScramble
                  text={label}
                  textClassName="text-sm tracking-normal normal-case font-sans"
                  restCharClassName="text-[#888]"
                  scrambleCharClassName="text-[#c4302b] scale-110"
                />
              </a>
            ))}
          </div>

          {/* right side */}
          <div className="flex items-center gap-2">
            <Link
              href="/generate"
              className="hidden md:inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#c4302b] text-[#050507] text-sm font-semibold rounded-full hover:bg-[#c4302b]/90 transition-colors"
            >
              Essayer gratuitement
            </Link>

            {/* mobile sheet */}
            <Sheet open={open} onOpenChange={setOpen}>
              <Button
                size="icon"
                variant="outline"
                onClick={() => setOpen(!open)}
                className="md:hidden border-[#1F1F25] bg-transparent text-[#888] hover:text-[#F5F0E8] hover:bg-[#1F1F25] size-8"
              >
                <MenuIcon className="size-4" />
              </Button>
              <SheetContent
                className="bg-[#050507] border-[#1F1F25]"
                showCloseButton={false}
                side="left"
              >
                <div className="grid gap-y-1 overflow-y-auto px-4 pt-12 pb-5">
                  {NAV_LINKS.map(({ label, href }) => (
                    <a
                      key={href}
                      href={href}
                      onClick={() => setOpen(false)}
                      className={buttonVariants({ variant: 'ghost', className: 'justify-start text-[#888] hover:text-[#F5F0E8] hover:bg-[#1F1F25]' })}
                    >
                      {label}
                    </a>
                  ))}
                </div>
                <SheetFooter className="px-4">
                  <Link
                    href="/generate"
                    onClick={() => setOpen(false)}
                    className="w-full flex items-center justify-center px-4 py-2.5 bg-[#c4302b] text-[#050507] text-sm font-semibold rounded-full hover:bg-[#c4302b]/90 transition-colors"
                  >
                    Essayer gratuitement
                  </Link>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </header>
    </motion.div>
  );
}
