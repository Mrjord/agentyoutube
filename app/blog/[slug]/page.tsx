import { notFound } from "next/navigation"
import Link from "next/link"
import { getAllArticles, getArticleBySlug, type Block } from "@/lib/articles"

export async function generateStaticParams() {
  return getAllArticles().map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  if (!article) return {}
  return {
    title: `${article.title} — YUBOT Blog`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.date,
    },
  }
}

function renderBlock(block: Block, i: number) {
  switch (block.type) {
    case "h2":
      return (
        <h2
          key={i}
          className="font-heading text-xl font-bold mt-10 mb-3 text-[#F5F0E8]"
        >
          {block.text}
        </h2>
      )
    case "h3":
      return (
        <h3
          key={i}
          className="font-heading text-base font-semibold mt-6 mb-2 text-[#D8D3CB]"
        >
          {block.text}
        </h3>
      )
    case "p":
      return (
        <p key={i} className="text-[#C4BFB7] leading-relaxed mb-4">
          {block.text}
        </p>
      )
    case "ul":
      return (
        <ul key={i} className="space-y-2 mb-4 pl-0">
          {block.items.map((item, j) => (
            <li key={j} className="flex items-start gap-3 text-[#C4BFB7] text-sm leading-relaxed">
              <span className="mt-2 h-1.5 w-1.5 bg-[#c4302b] rounded-full shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )
    case "callout":
      return (
        <div
          key={i}
          className="border-l-2 border-[#c4302b] pl-5 py-1 my-6 bg-[#0D0D10] rounded-r-lg"
        >
          <p className="text-sm text-[#C4BFB7] leading-relaxed italic">{block.text}</p>
        </div>
      )
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  if (!article) notFound()

  return (
    <div className="min-h-screen bg-[#050507] text-[#F5F0E8]">
      <div className="max-w-2xl mx-auto px-6 py-20">
        {/* breadcrumb */}
        <div className="flex items-center gap-2 mb-10 text-xs text-[#3A3A44]">
          <Link href="/" className="hover:text-[#F5F0E8] transition-colors">
            Accueil
          </Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-[#F5F0E8] transition-colors">
            Blog
          </Link>
          <span>/</span>
          <span className="text-[#888] truncate">{article.title}</span>
        </div>

        {/* meta */}
        <div className="flex items-center gap-2 mb-5">
          <span className="text-xs text-[#3A3A44]">{article.date}</span>
          <span className="text-xs text-[#3A3A44]">·</span>
          <span className="text-xs text-[#3A3A44]">{article.read} de lecture</span>
        </div>

        {/* title */}
        <h1 className="font-heading text-3xl font-bold leading-snug mb-5">{article.title}</h1>

        {/* excerpt */}
        <p className="text-[#888] text-base leading-relaxed mb-10 pb-10 border-b border-[#1F1F25]">
          {article.excerpt}
        </p>

        {/* content */}
        <div>{article.content.map((block, i) => renderBlock(block, i))}</div>

        {/* footer nav */}
        <div className="mt-16 pt-10 border-t border-[#1F1F25] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Link
            href="/blog"
            className="text-sm text-[#888] hover:text-[#F5F0E8] transition-colors"
          >
            ← Tous les articles
          </Link>
          <Link
            href="/generate"
            className="px-5 py-2.5 bg-gradient-to-t from-[#a02020] to-[#c4302b] border border-[#c4302b] text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity"
          >
            Essayer YUBOT gratuitement →
          </Link>
        </div>
      </div>
    </div>
  )
}
