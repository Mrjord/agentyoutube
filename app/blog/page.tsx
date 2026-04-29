import Link from "next/link"
import { getAllArticles } from "@/lib/articles"

export const metadata = {
  title: "Blog — YUBOT",
  description:
    "Stratégies YouTube, algorithme, scripting et monétisation. Tout ce que YUBOT sait sur les créateurs qui dominent leur niche.",
}

export default function BlogPage() {
  const articles = getAllArticles()

  return (
    <div className="min-h-screen bg-[#050507] text-[#F5F0E8]">
      <div className="max-w-4xl mx-auto px-6 py-20">
        {/* header */}
        <div className="mb-16">
          <Link
            href="/"
            className="text-xs text-[#c4302b] font-mono tracking-widest uppercase mb-8 inline-block hover:opacity-70 transition-opacity"
          >
            ← Retour
          </Link>
          <p className="text-xs font-mono text-[#c4302b] tracking-widest uppercase mb-4">
            Blog
          </p>
          <h1 className="font-heading text-4xl font-bold mb-4">
            Apprends ce que YUBOT sait.
          </h1>
          <p className="text-[#888] max-w-xl">
            Les créateurs qui dominent leur niche ne font pas de la chance. Ils maîtrisent des
            principes précis. On les documente.
          </p>
        </div>

        {/* article grid */}
        <div className="grid grid-cols-1 gap-5">
          {articles.map(({ slug, title, excerpt, date, read }) => (
            <Link
              key={slug}
              href={`/blog/${slug}`}
              className="border border-[#1F1F25] rounded-xl p-7 bg-[#0A0A0C] hover:border-[#2E2E38] hover:bg-[#0D0D10] transition-all group"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs text-[#3A3A44]">{date}</span>
                <span className="text-xs text-[#3A3A44]">·</span>
                <span className="text-xs text-[#3A3A44]">{read} de lecture</span>
              </div>
              <h2 className="font-heading text-lg font-semibold leading-snug group-hover:text-[#c4302b] transition-colors mb-2">
                {title}
              </h2>
              <p className="text-sm text-[#888] leading-relaxed">{excerpt}</p>
              <p className="text-xs text-[#c4302b] mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                Lire l&apos;article →
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
