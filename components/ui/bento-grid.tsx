"use client";

import { cn } from "@/lib/utils";

export interface BentoItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  status?: string;
  tags?: string[];
  meta?: string;
  cta?: string;
  colSpan?: number;
  hasPersistentHover?: boolean;
}

interface BentoGridProps {
  items: BentoItem[];
}

function BentoGrid({ items }: BentoGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-6xl mx-auto">
      {items.map((item, index) => (
        <div
          key={index}
          className={cn(
            "group relative p-5 rounded-xl overflow-hidden transition-all duration-300",
            "border border-[#1F1F25] bg-[#050507]/60",
            "hover:-translate-y-0.5 will-change-transform",
            "hover:border-[#c4302b]/30 hover:shadow-[0_4px_24px_rgba(196,48,43,0.08)]",
            item.colSpan === 2 ? "md:col-span-2" : "col-span-1",
            item.hasPersistentHover && "-translate-y-0.5 border-[#c4302b]/20 shadow-[0_4px_24px_rgba(196,48,43,0.06)]"
          )}
        >
          {/* dot pattern on hover */}
          <div className={cn(
            "absolute inset-0 transition-opacity duration-300",
            item.hasPersistentHover ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          )}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(196,48,43,0.04)_1px,transparent_1px)] bg-[length:4px_4px]" />
          </div>

          <div className="relative flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#1F1F25] group-hover:bg-[#c4302b]/10 transition-all duration-300">
                {item.icon}
              </div>
              {item.status && (
                <span className="text-xs font-mono px-2 py-1 rounded-lg bg-[#1F1F25] text-[#888] group-hover:bg-[#c4302b]/10 group-hover:text-[#c4302b] transition-colors duration-300">
                  {item.status}
                </span>
              )}
            </div>

            <div className="space-y-1.5">
              <h3 className="font-heading font-semibold text-[#F5F0E8] tracking-tight text-[15px]">
                {item.title}
                {item.meta && (
                  <span className="ml-2 text-xs text-[#3A3A44] font-normal font-mono">{item.meta}</span>
                )}
              </h3>
              <p className="text-sm text-[#888] leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="flex items-center justify-between mt-1">
              <div className="flex items-center flex-wrap gap-1.5">
                {item.tags?.map((tag, i) => (
                  <span
                    key={i}
                    className="text-xs px-2 py-0.5 rounded-md bg-[#1F1F25] text-[#3A3A44] font-mono transition-all duration-200 group-hover:text-[#888]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              <span className="text-xs text-[#c4302b] opacity-0 group-hover:opacity-100 transition-opacity font-mono shrink-0">
                {item.cta || "Explorer →"}
              </span>
            </div>
          </div>

          {/* gradient border on hover */}
          <div className={cn(
            "absolute inset-0 -z-10 rounded-xl p-px bg-gradient-to-br from-transparent via-[#c4302b]/10 to-transparent",
            item.hasPersistentHover ? "opacity-100" : "opacity-0 group-hover:opacity-100",
            "transition-opacity duration-300"
          )} />
        </div>
      ))}
    </div>
  );
}

export { BentoGrid };
