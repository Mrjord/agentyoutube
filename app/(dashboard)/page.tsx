'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { FadeUp, Stagger, fadeUpChild } from '@/components/landing/AnimIn';
import { CountUp } from '@/components/landing/CountUp';
import { Cursor } from '@/components/landing/Cursor';
import { HeroParticles } from '@/components/landing/HeroParticles';
import { TiltCard } from '@/components/landing/TiltCard';
import { FloatCard } from '@/components/landing/FloatCard';
import { SmoothScroll } from '@/components/landing/SmoothScroll';
import { PerspectiveMarquee } from '@/components/ui/perspective-marquee';
import MagnifiedBento from '@/components/ui/magnified-bento';
import PricingSection from '@/components/ui/pricing-section';
import { RatingInteraction } from '@/components/ui/emoji-rating';
import { TextScramble } from '@/components/ui/text-scramble';
import { getAllArticles } from '@/lib/articles';
import { FloatingHeader } from '@/components/landing/FloatingHeader';
import { PageParticles } from '@/components/landing/PageParticles';
import RadialOrbitalTimeline from '@/components/ui/radial-orbital-timeline';
import { Search, Filter, BarChart2, Cpu, Shield, FileText } from 'lucide-react';

const BLOG_ARTICLES = getAllArticles().slice(0, 3);

/* ── helpers ─────────────────────────────────────────────────────── */
const EASE = [0.65, 0, 0.35, 1] as const;

function TypewriterText({ text, speed = 18 }: { text: string; speed?: number }) {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    setDisplayed('');
    let i = 0;
    const id = setInterval(() => {
      if (i < text.length) { setDisplayed(text.slice(0, i + 1)); i++; }
      else clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);
  return (
    <span>
      {displayed}
      <motion.span
        className="inline-block w-[2px] h-[0.9em] bg-current align-middle ml-0.5"
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        style={{ opacity: displayed.length < text.length ? 1 : 0 }}
      />
    </span>
  );
}

function PulseButton({ children }: { children: React.ReactNode }) {
  return (
    <motion.div className="relative inline-block" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
      <motion.span
        className="absolute inset-0 rounded pointer-events-none"
        animate={{ boxShadow: ['0 0 0 0px rgba(196,48,43,0.5)', '0 0 0 10px rgba(196,48,43,0)', '0 0 0 0px rgba(196,48,43,0)'] }}
        transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 0.6 }}
      />
      {children}
    </motion.div>
  );
}

function LiveDot() {
  return (
    <span className="relative inline-flex h-2 w-2 mr-1.5">
      <motion.span
        className="absolute inline-flex h-full w-full rounded-full bg-[#c4302b] opacity-75"
        animate={{ scale: [1, 2.2, 1], opacity: [0.75, 0, 0.75] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
      />
      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#c4302b]" />
    </span>
  );
}

function LiveCounter({ base }: { base: number }) {
  const [count, setCount] = useState(base);
  useEffect(() => {
    const id = setInterval(() => {
      if (Math.random() > 0.55) setCount(c => c + 1);
    }, 4000);
    return () => clearInterval(id);
  }, []);
  return <>{count.toLocaleString('fr-FR')}</>;
}

function WordReveal({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const words = text.split(' ');
  return (
    <span ref={ref} className={className} aria-label={text}>
      {words.map((w, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ opacity: 0, y: 22 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45, delay: delay + i * 0.055, ease: EASE }}
        >
          {w}{i < words.length - 1 ? ' ' : ''}
        </motion.span>
      ))}
    </span>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  return (
    <motion.div
      ref={ref}
      className="mb-4"
      initial={{ opacity: 0, x: -12 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, ease: EASE }}
    >
      <TextScramble
        text={String(children)}
        textClassName="text-xs font-mono tracking-widest uppercase"
        restCharClassName="text-[#c4302b]"
        scrambleCharClassName="text-[#F5F0E8] scale-110"
        autoScrambleDelay={inView ? 300 : undefined}
      />
    </motion.div>
  );
}

/* ── Progress bar ────────────────────────────────────────────────── */
function ProgressBar({ year, pct, s, i }: { year: string; pct: string; s: string; i: number }) {
  const barRef = useRef(null);
  const inView = useInView(barRef, { once: true });
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-mono text-[#3A3A44] w-8">{year}</span>
      <div className="flex-1 h-1 bg-[#1F1F25] rounded-full overflow-hidden" ref={barRef}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: 'rgba(196,48,43,0.6)' }}
          initial={{ width: 0 }}
          animate={inView ? { width: pct } : {}}
          transition={{ duration: 1, delay: 0.2 + i * 0.1, ease: EASE }}
        />
      </div>
      <span className="text-xs font-mono text-[#888] w-10 text-right">{s}</span>
    </div>
  );
}

/* ── FAQ ──────────────────────────────────────────────────────────── */
function FAQ({ q, a }: { q: string; a: string | string[] }) {
  const [open, setOpen] = useState(false);
  const paragraphs = Array.isArray(a) ? a : [a];
  return (
    <motion.div className="border-b border-[#1E1E1E]" layout>
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between py-5 text-left text-[#F5F0E8] hover:text-[#c4302b] transition-colors"
      >
        <span className="font-medium">{q}</span>
        <motion.span
          className="text-[#6B6560] ml-4 shrink-0 text-lg leading-none"
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.25 }}
        >
          +
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            style={{ overflow: 'hidden' }}
          >
            <div className="pb-5 space-y-3">
              {paragraphs.map((p, i) => (
                <p key={i} className="text-[#6B6560] text-sm leading-relaxed">{p}</p>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── data ─────────────────────────────────────────────────────────── */
const MOCK_SCRIPT = [
  { label: 'HOOK — 0 à 30s', color: '#DC2626', bg: '#1F0A0A', text: "T'as passé 3 heures sur cette tâche hier. Un outil que t'as peut-être jamais entendu l'aurait faite en 4 minutes. Ce n'est pas de la science-fiction. C'est ce qu'on va décortiquer aujourd'hui." },
  { label: 'INTRO — 30s à 2 min', color: '#2563EB', bg: '#0A0F1F', text: "Je m'appelle pas Thomas Edison. Je suis pas un génie de la tech. Mais depuis que j'ai changé une habitude dans mon workflow, j'ai récupéré 12 heures par semaine. Douze heures." },
  { label: 'CORPS — Acte 1', color: '#16A34A', bg: '#0A1A0F', text: "La plupart des gens qui \"veulent utiliser l'IA\" ouvrent ChatGPT, tapent quelque chose au hasard, obtiennent une réponse médiocre, et concluent que \"l'IA c'est pas pour eux\". C'est pas l'outil le problème." },
];

const DEMO_THEMES = [
  'Comment arrêter de procrastiner',
  "L'argent et les croyances limitantes",
  'Pourquoi la routine du matin change tout',
  "L'IA qui va remplacer ton travail",
  'Comment vivre de YouTube en 2026',
];

const DEMO_RESULT = [
  { label: 'HOOK', color: '#DC2626', bg: '#1F0A0A', text: "T'as cru que tu procrastinais parce que t'étais paresseux. T'avais tort. Les neurosciences l'ont prouvé : la procrastination est une réponse émotionnelle, pas un défaut de caractère. Et ça change tout." },
  { label: 'INTRO', color: '#2563EB', bg: '#0A0F1F', text: "Dans cette vidéo, je vais te montrer les 3 mécanismes qui déclenchent la procrastination et la seule technique scientifiquement validée pour les court-circuiter. Pas de motivation. Pas de discipline. De la biologie." },
];

const STATS = [
  { n: '10 247', label: 'Vidéos virales analysées' },
  { n: '47', label: 'Patterns viraux actifs' },
  { n: '2 540', label: 'Créateurs actifs' },
  { n: 'live', label: 'Scripts cette semaine' },
  { n: '98%', label: 'Taux de satisfaction' },
  { n: '87s', label: 'Temps de génération moyen' },
];

const COMPARATIF = [
  ['Analyse de vrais contenus YouTube', true, false, false],
  ['Patterns extraits de vidéos virales', true, false, 'Limité'],
  ['Mise à jour de la base', 'Quotidienne', 'Statique', 'Mensuelle'],
  ['Style humain anti-IA', true, false, false],
  ['Adaptation de texte existant', true, 'Partiel', false],
  ['Export Word professionnel', true, false, 'Variable'],
  ['Bibliothèque de patterns', true, false, false],
  ['Niche business/mindset/IA optimisée', true, false, 'Variable'],
  ['Langue française native', true, true, 'Variable'],
  ['Prix', 'Dès 19€/mois', '20€/mois', '30–80€/mois'],
];

const TESTIMONIALS = [
  { quote: "YUBOT a changé ma façon de créer. Je ne passe plus mes week-ends à réécrire le même hook 15 fois. J'ai un script propre en moins de 2 heures du thème à la caméra. Et mes vidéos durent plus longtemps dans les recommandations.", author: 'Thomas L.', role: 'Chaîne finance personnelle, 91K abonnés' },
  { quote: "En 2 mois, mes vues moyennes ont doublé. Mais ce qui m'a vraiment surprise, c'est que les commentaires ont changé. Les gens disent que mes vidéos sont plus fluides, plus naturelles. YUBOT sort des scripts qui ne sonnent pas comme une IA.", author: 'Léa M.', role: 'Créatrice mindset & business' },
  { quote: "J'ai testé tous les générateurs de scripts du marché. Tous donnent quelque chose d'utilisable mais générique. YUBOT est le seul qui comprend que le problème n'est pas d'écrire du texte — c'est de construire une structure qui retient les gens.", author: 'Pierre D.', role: 'Directeur créatif, agence vidéo' },
];


const FAQS = [
  { q: 'Comment YUBOT analyse-t-il les vidéos virales ?', a: ["YUBOT utilise un système d'analyse automatisé qui scanne des milliers de vidéos YouTube chaque semaine dans les niches business, entrepreneuriat, mindset et IA. L'analyse porte sur le ratio viral — vues divisées par le nombre d'abonnés — pour identifier les vidéos qui ont surperformé leur base normale.", "Chaque vidéo retenue est analysée en profondeur : structure du hook, type de promesse dans l'intro, techniques de re-hook, style de conclusion, rythme narratif. Ces éléments sont classifiés en patterns stockés avec leur score de performance. La base est mise à jour quotidiennement."] },
  { q: 'Quelle est la différence entre YUBOT et ChatGPT ?', a: ["La différence est fondamentale. ChatGPT est un modèle de langage généraliste — il génère du texte cohérent mais n'a jamais regardé YouTube. Il ne sait pas ce qui retient l'attention sur une vidéo.", "YUBOT est entraîné sur des données de performance YouTube réelles. Chaque structure utilisée vient d'une vidéo qui a sur-performé. Il applique aussi des règles anti-IA strictes : pas de formulations miroir, pas d'exemples inventés, pas de ton coaching. Le résultat sonne humain parce qu'il est conçu pour l'être."] },
  { q: 'Combien de scripts puis-je générer par mois ?', a: "Starter : 10 scripts/mois. Pro : 50 scripts/mois. Studio : illimité. Les scripts non utilisés sont reportés sur le mois suivant, une fois. Si tu dépasses ton quota, tu peux passer au plan supérieur à tout moment — le changement est immédiat et calculé au prorata." },
  { q: 'Les scripts sonnent vraiment humains ?', a: ["C'est la priorité numéro un. Chaque script passe un test anti-IA : pas de mots interdits (\"fondamental\", \"indéniablement\", \"en conclusion\"...), rythme irrégulier, fragments assumés, pas d'exemples inventés avec des prénoms génériques.", "Le rythme oral est calibré pour sonner comme un vrai créateur parle — pas comme un texte rédigé. Si ça sonne IA, ça ne part pas."] },
  { q: "Y a-t-il un essai gratuit ?", a: "7 jours d'essai complet sur le plan de ton choix, sans carte bancaire requise. Tu accèdes à toutes les fonctionnalités dès le premier jour. À la fin, si tu décides de continuer, tu renseignes ton moyen de paiement. Sinon, le compte passe en mode lecture seule — tes scripts restent accessibles." },
  { q: "Puis-je adapter mon propre texte ?", a: "Oui. L'onglet \"Adapter mon texte\" prend ton contenu brut (article, newsletter, notes, ancien script) et le restructure en format viral sans changer une seule idée. Les mots ajoutés sont signalés en bleu, les passages condensés en orange. Tu vois exactement ce qui a changé." },
  { q: 'YUBOT fonctionne-t-il pour toutes les niches ?', a: ["YUBOT est optimisé pour les niches business, entrepreneuriat, mindset, IA, argent et carrière. C'est là que notre base de patterns est la plus dense.", "Pour les sujets très éloignés — recettes, sport, jeux vidéo, fiction — YUBOT signalera que le sujet sort de son domaine plutôt que de générer quelque chose d'approximatif. Cette limitation est intentionnelle."] },
  { q: "Comment annuler mon abonnement ?", a: "En 1 clic depuis ton tableau de bord — Paramètres → Abonnement → Annuler. Aucun formulaire, aucun email, aucun appel. L'annulation prend effet à la fin de la période en cours. Tes scripts sont conservés 90 jours après l'annulation." },
];

const INTEGRATIONS = [
  { name: 'YouTube', desc: 'Analyse les vidéos de ta niche depuis ton dashboard', available: true },
  { name: 'Google Docs', desc: 'Export direct vers un document partageable', available: true },
  { name: 'Notion', desc: 'Sauvegarde automatique de tes scripts', available: true },
  { name: 'Slack', desc: 'Notification quand ton script est prêt', available: true },
  { name: 'Zapier', desc: "Automatise n'importe quel workflow autour de YUBOT", available: true },
  { name: 'App native', desc: 'Mac & Windows — applications natives (Q3 2026)', available: false },
];

/* ── page ─────────────────────────────────────────────────────────── */
export default function LandingPage() {
  const [demoTheme, setDemoTheme] = useState('');
  const [demoResult, setDemoResult] = useState(false);

  return (
    <div className="landing min-h-screen text-[#F5F0E8] relative z-[2]">
      <PageParticles />
      <SmoothScroll />
      <Cursor />

      {/* ── NAV ─────────────────────────────────────────────────────── */}
      <FloatingHeader />

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative w-full px-6 pt-24 pb-28 overflow-hidden flex flex-col items-center">
        {/* CSS grid background */}
        <div className="pointer-events-none absolute inset-0 [background-image:linear-gradient(rgba(196,48,43,0.04)_1px,transparent_1px),linear-gradient(to_right,rgba(196,48,43,0.04)_1px,transparent_1px)] [background-size:80px_80px]" />
        {/* vignette fade over grid */}
        <div className="pointer-events-none absolute inset-0 [background:radial-gradient(ellipse_80%_60%_at_50%_0%,transparent_40%,#050507_100%)]" />

        {/* ambient glow — stronger, wider */}
        <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] rounded-full opacity-[0.14]"
          style={{ background: 'radial-gradient(ellipse, #c4302b 0%, transparent 70%)' }} />

        {/* floating ambient orbs */}
        <motion.div
          className="pointer-events-none absolute w-80 h-80 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(196,48,43,0.07) 0%, transparent 70%)', top: '5%', right: '5%' }}
          animate={{ x: [0, 24, 0], y: [0, -16, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="pointer-events-none absolute w-64 h-64 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(196,48,43,0.05) 0%, transparent 70%)', bottom: '10%', left: '0%' }}
          animate={{ x: [0, -18, 0], y: [0, 20, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
        <HeroParticles />

        <div className="relative max-w-4xl mx-auto text-center space-y-8 w-full">

          {/* announcement badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <a
              href="#features"
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#c4302b]/30 bg-[#c4302b]/10 text-sm text-[#C4BFB7] hover:border-[#c4302b]/60 hover:bg-[#c4302b]/15 transition-all"
            >
              <LiveDot />
              <span>47 patterns viraux actifs · mis à jour aujourd&apos;hui</span>
              <span className="text-[#c4302b] font-medium">Explorer →</span>
            </a>
          </motion.div>

          {/* h1 */}
          <h1 className="font-heading text-5xl lg:text-7xl font-bold leading-[1.05] tracking-tight">
            <WordReveal text="Le script qui retient." delay={0.2} />
            <br />
            <WordReveal text="La structure qui" delay={0.35} />{' '}
            <motion.span
              className="text-[#c4302b]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              convertit.
            </motion.span>
          </h1>

          {/* sub */}
          <motion.p
            className="text-[#888] text-lg leading-relaxed max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
          >
            YUBOT scanne YouTube en permanence, extrait les patterns des vidéos qui explosent, et génère des scripts qui répliquent exactement ce qui fonctionne — dans ta niche, pour ton audience.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <PulseButton>
              <Link
                href="/generate"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#c4302b] text-[#050507] font-semibold rounded-full hover:bg-[#c4302b]/90 transition-colors"
              >
                Essayer gratuitement
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </PulseButton>
            <a
              href="#how"
              className="inline-flex items-center gap-2 px-8 py-3.5 border border-[#1F1F25] rounded-full text-sm text-[#888] hover:text-[#F5F0E8] hover:border-[#3A3A44] transition-colors"
            >
              Voir comment ça marche
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </motion.div>

          {/* stats */}
          <motion.div
            className="flex items-center justify-center gap-10 pt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            {[
              { n: '10 247', label: 'vidéos analysées' },
              { n: '47', label: 'patterns actifs' },
              { n: '2 540', label: 'créateurs actifs' },
            ].map(({ n, label }) => (
              <div key={label}>
                <p className="font-heading text-2xl font-bold"><CountUp value={n} /></p>
                <p className="text-xs text-[#888]">{label}</p>
              </div>
            ))}
          </motion.div>

          {/* mock script card — centered below CTAs */}
          <motion.div
            className="mt-8 max-w-lg mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease: EASE }}
            style={{ perspective: 1200 }}
          >
            <FloatCard amplitude={8} duration={5}>
              <div className="relative rounded-xl p-[1px] overflow-hidden shadow-2xl shadow-black/50">
                <motion.div
                  className="absolute inset-0 rounded-xl"
                  style={{ background: 'conic-gradient(from 0deg, transparent 0%, rgba(196,48,43,0.7) 18%, transparent 36%)' }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                />
                <div className="relative rounded-xl bg-[#0F0F12] overflow-hidden">
                  <motion.div
                    className="absolute left-0 right-0 h-[2px] pointer-events-none z-20"
                    style={{ background: 'linear-gradient(to right, transparent, rgba(196,48,43,0.5), transparent)' }}
                    animate={{ y: [0, 260, 0] }}
                    transition={{ duration: 4, ease: 'linear', repeat: Infinity, repeatDelay: 1.5 }}
                  />
                  <div className="border-b border-[#1F1F25] px-4 py-3 flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#2A2A30]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#2A2A30]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#2A2A30]" />
                    <span className="ml-2 text-xs text-[#3A3A44] font-mono">script_viral.docx</span>
                    <span className="ml-auto text-xs font-mono flex items-center gap-1" style={{ color: '#c4302b90' }}>
                      <LiveDot />
                      Généré il y a 4s
                    </span>
                  </div>
                  <div className="px-4 py-2 bg-[#0D0D10] border-b border-[#1F1F25]">
                    <p className="text-xs text-[#888] font-mono">Thème : Comment gagner du temps avec l&apos;IA en 2026</p>
                  </div>
                  <div className="p-5 space-y-3 text-left">
                    {MOCK_SCRIPT.map(({ label, color, bg, text }, i) => (
                      <motion.div
                        key={label}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 + i * 0.15 }}
                        className="rounded border-l-2 p-3"
                        style={{ borderLeftColor: color, backgroundColor: bg }}
                      >
                        <p className="text-xs font-mono font-bold mb-2 tracking-widest" style={{ color }}>{label}</p>
                        <p className="text-sm text-[#C4BFB7] leading-relaxed">{text}</p>
                      </motion.div>
                    ))}
                    <motion.div
                      className="flex items-center gap-1.5 pt-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.1 }}
                    >
                      <div className="h-px flex-1 bg-[#1F1F25]" />
                      <span className="text-xs text-[#3A3A44] font-mono">+ 5 sections</span>
                      <div className="h-px flex-1 bg-[#1F1F25]" />
                    </motion.div>
                  </div>
                </div>
              </div>
            </FloatCard>
          </motion.div>

        </div>
      </section>

      {/* ── SOCIAL PROOF ─────────────────────────────────────────────── */}
      <section className=" overflow-hidden">
        <div className="py-8">
          <FadeUp>
            <p className="text-xs text-[#3A3A44] text-center mb-6 uppercase tracking-widest font-mono px-6">
              Utilisé par des créateurs qui prennent leurs résultats au sérieux
            </p>
          </FadeUp>
          <PerspectiveMarquee
            items={['La Clé des Marchés', 'Marketing Flow', 'Mindset Business', 'Code & Café', 'Léa Creates', 'Finance Réelle', "L'Atelier Vidéo", 'Startup Stories']}
            fontSize={28}
            color="#3A3A44"
            fontWeight={700}
            pixelsPerFrame={1.2}
            rotateY={-22}
            rotateX={6}
            fadeColor="#050507"
            background="transparent"
            height={72}
          />
          <FadeUp delay={0.2}>
            <p className="text-center text-xs text-[#888] mt-6 px-6">+ 2 500 créateurs font confiance à YUBOT</p>
          </FadeUp>
        </div>
      </section>

      {/* ── LE PROBLÈME ──────────────────────────────────────────────── */}
      <section>
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-16 items-start">
            <div className="space-y-6">
              <SectionLabel>Le problème</SectionLabel>
              <FadeUp>
                <h2 className="font-heading text-3xl lg:text-4xl font-bold leading-tight">
                  Tu sais ce qui tue 99% des vidéos YouTube ?
                </h2>
              </FadeUp>
              <Stagger className="space-y-4 text-[#888] leading-relaxed" delay={0.1}>
                {[
                  "C'est pas la qualité de l'image. Pas le montage. Pas même le sujet. Des dizaines de milliers de vidéos en 4K sur des sujets brillants moisissent à 200 vues. La différence ne se voit pas à l'écran. Elle se lit dans le script.",
                  "YouTube a changé. L'attention des spectateurs aussi. En 2020, une intro de 90 secondes passait encore. Aujourd'hui, t'as 6 secondes. Six secondes pour que l'algorithme décide si ta vidéo mérite d'être montrée. La plupart des créateurs le savent — mais personne ne leur a jamais montré comment construire ces 6 secondes.",
                  "Les patterns viraux changent tous les 45 jours environ. Ce qui marchait en mars ne marche plus en juin. Analyser 10 vidéos virales en profondeur, ça prend une journée. Et pendant ce temps, t'es pas en train de créer.",
                ].map((p, i) => (
                  <motion.p key={i} variants={fadeUpChild}>{p}</motion.p>
                ))}
              </Stagger>
            </div>
            <div className="space-y-4">
              <FadeUp delay={0.2}>
                <div className="border border-[#1F1F25] rounded-xl p-6 bg-[#0D0D10]">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#c4302b]" />
                    <span className="text-xs font-mono text-[#888] uppercase tracking-widest">Temps d&apos;accroche critique</span>
                  </div>
                  <div className="space-y-2">
                    {[
                      { year: '2020', pct: '100%', s: '15s' },
                      { year: '2022', pct: '67%', s: '10s' },
                      { year: '2024', pct: '53%', s: '8s' },
                      { year: '2026', pct: '40%', s: '6s' },
                    ].map(({ year, pct, s }, i) => (
                      <ProgressBar key={year} year={year} pct={pct} s={s} i={i} />
                    ))}
                  </div>
                  <p className="text-xs text-[#3A3A44] mt-4 font-mono">Le temps d&apos;accroche est passé de 15s à 6s.</p>
                </div>
              </FadeUp>
              <FadeUp delay={0.35}>
                <blockquote className="border border-[#1F1F25] rounded-xl p-6 bg-[#0D0D10] space-y-3">
                  <div className="w-6 h-0.5 bg-[#c4302b]" />
                  <p className="text-sm text-[#C4BFB7] leading-relaxed italic">
                    &ldquo;J&apos;ai passé 6 mois à créer du contenu régulièrement. Des vidéos soignées. Des sujets pertinents. Aucune ne dépassait 400 vues. C&apos;est le genre de truc qui te fait remettre en question tout ce que tu fais.&rdquo;
                  </p>
                  <p className="text-xs text-[#888]">— Thomas L., créateur business, 250K abonnés aujourd&apos;hui</p>
                </blockquote>
              </FadeUp>
            </div>
          </div>
        </div>
      </section>

      {/* ── LA SOLUTION ──────────────────────────────────────────────── */}
      <section>
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-16 items-center">
            <div>
              <SectionLabel>La solution</SectionLabel>
              <FadeUp>
                <h2 className="font-heading text-3xl lg:text-4xl font-bold leading-tight mb-8">
                  On a lu YouTube à ta place.
                </h2>
              </FadeUp>
              <Stagger className="space-y-5 text-[#888] leading-relaxed" delay={0.1}>
                {[
                  "YUBOT ne génère pas des scripts à partir de rien. Il commence par analyser. Chaque jour, notre système scanne des milliers de vidéos dans les niches business, entrepreneuriat, mindset, IA et argent. Il mesure le ratio viral — vues vs abonnés — pour ne retenir que les vidéos qui ont surperformé leur base d'audience.",
                  "Ensuite, il décortique. Structure du hook. Longueur de l'intro. Nombre de re-hooks dans le corps. Technique de conclusion. Rythme des phrases. On identifie les patterns qui se répètent dans les vidéos qui fonctionnent — et seulement celles-là.",
                  "Enfin, il génère. Tu donnes un thème. YUBOT sélectionne les patterns les plus adaptés à ton sujet, à ta durée cible, à ton ton. Et il produit un script complet — hook, intro, 3 actes, re-hook, conclusion — avec le rythme oral qui correspond à ce que les spectateurs restent à regarder.",
                ].map((p, i) => (
                  <motion.p key={i} variants={fadeUpChild}>{p}</motion.p>
                ))}
              </Stagger>
            </div>
            <FadeUp delay={0.2}>
              <MagnifiedBento />
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── COMMENT ÇA MARCHE ────────────────────────────────────────── */}
      <section id="how" className=" overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* left — texte */}
          <div className="space-y-8">
            <SectionLabel>Le processus</SectionLabel>
            <FadeUp><h2 className="font-heading text-3xl lg:text-4xl font-bold leading-tight">De la vidéo virale au script prêt à filmer</h2></FadeUp>
            <FadeUp delay={0.1}>
              <p className="text-[#888] leading-relaxed">YUBOT automatise tout ce qu&apos;un créateur devrait faire manuellement : analyser les tendances, décortiquer les patterns, rédiger la structure. En 87 secondes.</p>
            </FadeUp>

            <FadeUp delay={0.2}>
              <div className="space-y-3">
                {[
                  { icon: Search,    label: 'Veille YouTube',  stat: '10 247 vidéos analysées' },
                  { icon: Filter,    label: 'Filtrage viral',  stat: '3% passent nos filtres' },
                  { icon: BarChart2, label: '47 patterns actifs', stat: 'Mis à jour quotidiennement' },
                  { icon: Cpu,       label: 'Génération script', stat: 'Texte mot pour mot en 87s' },
                  { icon: Shield,    label: 'Anti-IA filter',  stat: '0 tournure robotique' },
                  { icon: FileText,  label: 'Export Word',     stat: 'Prêt à coller dans le prompteur' },
                ].map(({ icon: Icon, label, stat }) => (
                  <div key={label} className="flex items-center gap-3 group">
                    <div className="w-8 h-8 rounded-lg bg-[#0D0D10] border border-[#1F1F25] flex items-center justify-center shrink-0 group-hover:border-[#c4302b]/40 transition-colors">
                      <Icon size={14} className="text-[#c4302b]" />
                    </div>
                    <div className="flex-1 flex items-center justify-between">
                      <span className="text-sm text-[#F5F0E8]">{label}</span>
                      <span className="text-xs font-mono text-[#3A3A44]">{stat}</span>
                    </div>
                  </div>
                ))}
              </div>
            </FadeUp>

            <FadeUp delay={0.3}>
              <p className="text-xs font-mono text-[#3A3A44]">↑ Clique sur un nœud pour explorer chaque étape</p>
            </FadeUp>
          </div>

          {/* right — orbital */}
          <div className="w-full">
            <RadialOrbitalTimeline timelineData={[
              { id: 1, title: "Veille YouTube", date: "Quotidien", content: "YUBOT scanne des dizaines de milliers de vidéos chaque semaine et mesure le ratio viral — vues / abonnés — pour détecter les performances anormales.", category: "analyse", icon: Search, relatedIds: [2, 3], status: "completed", energy: 92 },
              { id: 2, title: "Filtrage viral", date: "3% retenus", content: "Seulement les vidéos avec un ratio viral minimum passent nos filtres stricts. Résultat : une base de patterns issus de l'élite YouTube, pas du contenu moyen.", category: "filtrage", icon: Filter, relatedIds: [1, 3], status: "completed", energy: 78 },
              { id: 3, title: "47 patterns", date: "Actifs", content: "Chaque vidéo retenue est décortiquée : hook, promesse, re-hooks, rythme, conclusion. Les patterns sont classés par taux de succès et mis à jour chaque jour.", category: "patterns", icon: BarChart2, relatedIds: [1, 4], status: "completed", energy: 85 },
              { id: 4, title: "Génération", date: "87 secondes", content: "Tu donnes un thème. YUBOT sélectionne les patterns adaptés à ta niche, construit la structure et rédige le texte à dire mot pour mot.", category: "génération", icon: Cpu, relatedIds: [3, 5], status: "completed", energy: 95 },
              { id: 5, title: "Anti-IA filter", date: "100% humain", content: "Chaque script passe un test anti-IA strict : pas de mots interdits, rythme irrégulier, fragments assumés. Le résultat sonne humain parce qu'il est conçu pour l'être.", category: "filtre", icon: Shield, relatedIds: [4, 6], status: "in-progress", energy: 88 },
              { id: 6, title: "Export Word", date: "1 clic", content: "Ton script est exporté en document Word professionnel avec code couleur par section, prêt à coller dans ton prompteur ou partager avec ton équipe.", category: "export", icon: FileText, relatedIds: [5], status: "completed", energy: 70 },
            ]} />
          </div>

        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────────── */}
      <section id="features">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <SectionLabel>Ce que YUBOT fait concrètement</SectionLabel>
          <FadeUp><h2 className="font-heading text-3xl font-bold mb-16">5 outils. Un workflow complet.</h2></FadeUp>

          <div className="space-y-20">
            {/* Feature 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <FadeUp className="space-y-5">
                <div className="w-6 h-0.5 bg-[#c4302b]" />
                <h3 className="font-heading text-2xl font-bold">Un script complet. Basé sur ce qui marche vraiment.</h3>
                <div className="space-y-3 text-[#888] text-sm leading-relaxed">
                  <p>Tu donnes un thème. YUBOT génère un script entier — pas une ébauche, pas un plan, un texte à dire mot pour mot. Hook calibré pour les 6 premières secondes critiques. Intro qui pose une promesse claire. Corps structuré en 3 actes avec re-hooks intégrés. Conclusion qui ferme le loop sans tomber dans le CTA commercial.</p>
                  <p>Chaque section est accompagnée de notes créateur : pourquoi ce hook, quel pattern est utilisé, quel type de vidéo a inspiré la structure. Tu comprends ce que tu lis.</p>
                  <p>7 tons disponibles : viral, éducatif, storytelling, tutoriel, provocateur, inspirant, analytique.</p>
                </div>
                <p className="text-sm text-[#F5F5F7] font-medium">Plus besoin de passer 3 heures sur un script. Tu n&apos;as plus qu&apos;à filmer.</p>
              </FadeUp>
              <FadeUp delay={0.15}>
                <TiltCard className="border border-[#1F1F25] rounded-xl overflow-hidden group relative">
                  <div className="border-b border-[#1F1F25] px-4 py-2 bg-[#111114] flex items-center gap-2">
                    <span className="text-xs font-mono text-[#888]">Onglet : Générer un script</span>
                  </div>
                  <div className="p-5 space-y-3 bg-[#0F0F12]">
                    {[
                      { label: '[HOOK]', color: '#DC2626', bg: '#1F0A0A', text: "T'es en train de perdre 80% de tes spectateurs dans les 30 premières secondes. Voilà pourquoi — et comment l'arrêter." },
                      { label: '[INTRO]', color: '#2563EB', bg: '#0A0F1F', text: "Cette vidéo est basée sur 3 ans d'analyse de 10 000 vidéos YouTube. Ce que tu vas apprendre, ça prend normalement des mois à comprendre seul." },
                      { label: '[NOTES CRÉATEUR]', color: '#6B7280', bg: '#0F0F12', text: 'Hook utilisé : Chiffre choc + promesse de solution. Score viral moyen de ce pattern : 14x.' },
                    ].map(({ label, color, bg, text }) => (
                      <div key={label} className="rounded border-l-2 p-3" style={{ borderLeftColor: color, backgroundColor: bg }}>
                        <p className="text-xs font-mono font-bold mb-1.5" style={{ color }}>{label}</p>
                        <p className="text-xs text-[#C4BFB7] leading-relaxed">{text}</p>
                      </div>
                    ))}
                  </div>
                </TiltCard>
              </FadeUp>
            </div>

            <div className="border-t border-[#1F1F25]" />

            {/* Feature 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <FadeUp delay={0.15} className="order-2 lg:order-1">
                <TiltCard className="border border-[#1F1F25] rounded-xl overflow-hidden group relative">
                  <div className="border-b border-[#1F1F25] px-4 py-2 bg-[#111114]">
                    <span className="text-xs font-mono text-[#888]">Onglet : Adapter mon texte</span>
                  </div>
                  <div className="p-5 bg-[#0F0F12] space-y-3">
                    <div className="p-3 rounded border border-[#1F1F25] bg-[#111114]">
                      <p className="text-xs font-mono text-[#3A3A44] mb-1">Texte original</p>
                      <p className="text-xs text-[#888] leading-relaxed">L&apos;intelligence artificielle transforme le marché du travail. Selon une étude récente, 40% des tâches actuelles pourront être automatisées d&apos;ici 2030...</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-px bg-[#c4302b]/30" />
                      <span className="text-xs font-mono text-[#c4302b]">→ adapté</span>
                      <div className="flex-1 h-px bg-[#c4302b]/30" />
                    </div>
                    <div className="p-3 rounded border-l-2 border-[#DC2626] bg-[#1F0A0A]">
                      <p className="text-xs font-mono text-[#DC2626] font-bold mb-1.5">[HOOK]</p>
                      <p className="text-xs text-[#C4BFB7] leading-relaxed">
                        40% de ton boulot disparaît d&apos;ici 2030. Pas dans 50 ans. Dans 5 ans.{' '}
                        <span className="px-0.5 rounded" style={{ backgroundColor: '#0D2235', color: '#93C5FD' }}>La question n&apos;est pas si ça va arriver. La question, c&apos;est ce que tu vas faire avant. [+]</span>
                      </p>
                    </div>
                  </div>
                </TiltCard>
              </FadeUp>
              <FadeUp className="order-1 lg:order-2 space-y-5">
                <div className="w-6 h-0.5 bg-[#c4302b]" />
                <h3 className="font-heading text-2xl font-bold">T&apos;as déjà un texte. On lui donne une forme qui retient.</h3>
                <div className="space-y-3 text-[#888] text-sm leading-relaxed">
                  <p>Tu as un article de blog, une newsletter, des notes de cours, un script existant qui n&apos;a pas fonctionné. Tu colles le texte. YUBOT restructure sans toucher au fond.</p>
                  <p>Les faits restent les faits. Tes opinions restent tes opinions. Ce que YUBOT change : l&apos;ordre des informations, la formulation pour un rythme oral, la structure pour hook → intro → corps → conclusion. Ce qui a été ajouté est signalé en bleu. Ce qui a été condensé en orange.</p>
                  <p>L&apos;outil calcule aussi l&apos;écart entre la longueur de ton texte et la durée cible. Tu peux autoriser YUBOT à compléter — sans inventer de faits.</p>
                </div>
                <p className="text-sm text-[#F5F5F7] font-medium">Ton contenu existant peut performer 3x mieux. Le fond ne change pas. La forme fait tout.</p>
              </FadeUp>
            </div>

            <div className="border-t border-[#1F1F25]" />

            {/* Feature cards */}
            <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-5" delay={0.1}>
              {[
                { title: '47 patterns viraux. Transparents, explorables.', desc: "YUBOT n'est pas une boîte noire. Tu peux explorer la bibliothèque de patterns — pour chaque pattern : type, ton associé, durée optimale, score viral moyen, exemples sources. Mise à jour quotidiennement." },
                { title: 'Ce qui marche dans ta niche. Cette semaine.', desc: "Les patterns viraux ont une durée de vie. YUBOT suit leur évolution en temps réel et signale les patterns émergents. Dashboard tendances : quels hooks gagnent des parts d'attention ce mois-ci." },
                { title: 'Prêt à imprimer. Prêt à partager. Prêt à tourner.', desc: "Export .docx avec mise en forme professionnelle. Les sections sont colorées par type. Les notes créateur sont séparées visuellement. Quelqu'un qui n'a jamais utilisé YUBOT peut prendre ce document et filmer." },
              ].map(({ title, desc }) => (
                <motion.div key={title} variants={fadeUpChild}>
                  <TiltCard className="border border-[#1F1F25] rounded-xl p-6 space-y-3 bg-[#050507] group relative h-full">
                    <div className="w-6 h-0.5 bg-[#c4302b]" />
                    <h3 className="font-heading text-base font-semibold leading-snug">{title}</h3>
                    <p className="text-sm text-[#888] leading-relaxed">{desc}</p>
                  </TiltCard>
                </motion.div>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      {/* ── DÉMO INTERACTIVE ─────────────────────────────────────────── */}
      <section>
        <div className="max-w-3xl mx-auto px-6 py-20">
          <SectionLabel>Démo interactive</SectionLabel>
          <FadeUp>
            <h2 className="font-heading text-3xl font-bold mb-2">Essaye YUBOT maintenant. Sans inscription.</h2>
            <p className="text-[#888] mb-8">Donne un thème. Vois un extrait de script généré. Tu décides ensuite si tu veux le script complet.</p>
          </FadeUp>

          <FadeUp delay={0.15}>
            <div className="border border-[#1F1F25] rounded-xl bg-[#0D0D10] p-6 space-y-5">
              <div className="flex flex-wrap gap-2">
                {DEMO_THEMES.map(t => (
                  <motion.button
                    key={t}
                    onClick={() => setDemoTheme(t)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={`px-3 py-1.5 text-xs rounded border transition-colors ${demoTheme === t ? 'bg-[#c4302b]/10 text-[#c4302b] border-[#c4302b]/30' : 'border-[#1F1F25] text-[#888] hover:border-[#2E2E38] hover:text-[#F5F5F7]'}`}
                  >
                    {t}
                  </motion.button>
                ))}
              </div>

              <div>
                <label className="block text-xs font-mono text-[#888] mb-2">Ou saisis un thème personnalisé</label>
                <input
                  value={demoTheme}
                  onChange={e => { setDemoTheme(e.target.value); setDemoResult(false); }}
                  placeholder="Ex : Pourquoi les riches ne travaillent pas plus dur"
                  className="w-full px-3 py-2.5 text-sm border border-[#1F1F25] rounded-lg bg-[#111114] text-[#F5F5F7] placeholder-[#3A3A44] focus:outline-none focus:border-[#c4302b]/40 focus:ring-1 focus:ring-[#c4302b]/10 transition-colors"
                />
              </div>

              <motion.button
                onClick={() => demoTheme.trim() && setDemoResult(true)}
                disabled={!demoTheme.trim()}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-2.5 bg-[#c4302b] text-[#050507] font-semibold text-sm rounded-lg hover:bg-[#c4302b]/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Générer l&apos;aperçu
              </motion.button>

              <AnimatePresence>
                {demoResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.4, ease: EASE }}
                    className="space-y-4 pt-2"
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-px flex-1 bg-[#1F1F25]" />
                      <span className="text-xs font-mono text-[#c4302b]">Aperçu généré</span>
                      <div className="h-px flex-1 bg-[#1F1F25]" />
                    </div>
                    {DEMO_RESULT.map(({ label, color, bg, text }, idx) => (
                      <div key={label} className="rounded border-l-2 p-3" style={{ borderLeftColor: color, backgroundColor: bg }}>
                        <p className="text-xs font-mono font-bold mb-1.5" style={{ color }}>[{label}]</p>
                        <p className="text-sm text-[#C4BFB7] leading-relaxed">
                          <TypewriterText text={text} speed={idx === 0 ? 18 : 22} />
                        </p>
                      </div>
                    ))}
                    <div className="border border-[#1F1F25] rounded-lg p-3 bg-[#111114] flex items-center justify-between">
                      <p className="text-xs text-[#888]">Script complet : 8 sections • notes créateur • export Word</p>
                      <Link href="/generate" className="text-xs font-semibold text-[#c4302b] hover:text-[#c4302b]/80 transition-colors">
                        Obtenir le script complet →
                      </Link>
                    </div>
                    <div className="border-t border-[#1F1F25] pt-5">
                      <p className="text-xs text-center text-[#888] mb-3 font-mono uppercase tracking-widest">Cet aperçu t&apos;a convaincu ?</p>
                      <RatingInteraction label="Ton avis sur l'aperçu" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────────────── */}
      <section>
        <div className="max-w-6xl mx-auto px-6 py-20">
          <FadeUp><p className="text-xs font-mono text-[#c4302b] tracking-widest uppercase mb-12 text-center">YUBOT en chiffres</p></FadeUp>
          <Stagger className="grid grid-cols-2 md:grid-cols-3 gap-px bg-[#1F1F25]" delay={0.05}>
            {STATS.map(({ n, label }) => (
              <motion.div
                key={label}
                variants={fadeUpChild}
                className="bg-[#0D0D10] p-8 text-center group hover:bg-[#111114] transition-colors duration-300"
              >
                <p className="font-heading text-4xl font-bold mb-2 tabular-nums flex items-center justify-center gap-2">
                  {n === 'live' ? (
                    <>
                      <LiveDot />
                      <LiveCounter base={892} />
                    </>
                  ) : (
                    <CountUp value={n} />
                  )}
                </p>
                <p className="text-sm text-[#888]">{label}</p>
              </motion.div>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ── COMPARATIF ───────────────────────────────────────────────── */}
      <section>
        <div className="max-w-6xl mx-auto px-6 py-20">
          <SectionLabel>Comparatif</SectionLabel>
          <FadeUp>
            <h2 className="font-heading text-3xl font-bold mb-3">YUBOT n&apos;est pas ChatGPT avec un prompt YouTube.</h2>
            <p className="text-[#888] mb-10 max-w-xl">La différence est structurelle. Voilà pourquoi.</p>
          </FadeUp>
          <FadeUp delay={0.15}>
            <div className="border border-[#1F1F25] rounded-xl overflow-hidden">
              <div className="grid grid-cols-4 border-b border-[#1F1F25]/30">
                <div className="p-4 text-xs font-mono text-[#888] uppercase tracking-widest">Fonctionnalité</div>
                <div className="p-4 text-xs font-mono text-[#c4302b] uppercase tracking-widest border-l border-[#1F1F25]">YUBOT</div>
                <div className="p-4 text-xs font-mono text-[#888] uppercase tracking-widest border-l border-[#1F1F25]">ChatGPT</div>
                <div className="p-4 text-xs font-mono text-[#888] uppercase tracking-widest border-l border-[#1F1F25]">Autres outils</div>
              </div>
              {COMPARATIF.map(([feat, yubot, gpt, others], i) => (
                <motion.div
                  key={i}
                  className={`grid grid-cols-4 border-b border-[#1F1F25] last:border-b-0 ${i % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.02]'}`}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                >
                  <div className="p-4 text-sm text-[#C4BFB7]">{feat}</div>
                  {[yubot, gpt, others].map((val, j) => (
                    <div key={j} className="p-4 border-l border-[#1F1F25]">
                      {val === true ? (
                        <span className="text-green-400 text-sm">✓ Oui</span>
                      ) : val === false ? (
                        <span className="text-[#3A3A44] text-sm">—</span>
                      ) : (
                        <span className={`text-sm ${j === 0 ? 'text-[#c4302b]' : 'text-[#888]'}`}>{val as string}</span>
                      )}
                    </div>
                  ))}
                </motion.div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── CAS CLIENTS ──────────────────────────────────────────────── */}
      <section>
        <div className="max-w-6xl mx-auto px-6 py-20">
          <SectionLabel>Résultats réels</SectionLabel>
          <FadeUp><h2 className="font-heading text-3xl font-bold mb-12">Ce que des créateurs ont accompli avec YUBOT</h2></FadeUp>
          <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-5" delay={0.1}>
            {[
              { title: 'De 200 à 50 000 vues par vidéo en 4 mois.', before: '180 vues moyennes · 3 400 abonnés', after: '48 000 vues · 91 000 abonnés', quote: '"Je pensais que le problème venait de mon montage. En vrai le problème était dans les 15 premières secondes."', author: 'Thomas L. — Finance personnelle' },
              { title: "L'agence MPW génère 3× plus de scripts.", before: '5h/script · 8 clients', after: '45min/script · volume ×3', quote: '"YUBOT ne remplace pas notre expertise. Il remplace le temps de production."', author: 'Équipe MPW — Agence vidéo' },
              { title: 'Sophie a récupéré 18 heures par semaine.', before: '22h/semaine sur scripts', after: '4h/semaine · engagement +140%', quote: '"Je savais quoi dire dans mes vidéos. Ce que je ne savais pas, c\'est dans quel ordre."', author: 'Sophie — Lifestyle minimaliste' },
            ].map(({ title, before, after, quote, author }) => (
              <motion.div key={title} variants={fadeUpChild}>
                <TiltCard className="border border-[#1F1F25] rounded-xl overflow-hidden bg-[#050507] group relative h-full flex flex-col">
                  <div className="p-6 space-y-4 flex-1">
                    <h3 className="font-heading text-base font-semibold leading-snug">{title}</h3>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-[#3A3A44] w-14">Avant</span>
                        <span className="text-xs text-[#888]">{before}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-[#c4302b] w-14">Après</span>
                        <span className="text-xs text-[#F5F5F7] font-medium">{after}</span>
                      </div>
                    </div>
                    <blockquote className="border-l-2 border-[#c4302b]/40 pl-3">
                      <p className="text-xs text-[#888] italic leading-relaxed">{quote}</p>
                      <p className="text-xs text-[#3A3A44] mt-1">— {author}</p>
                    </blockquote>
                  </div>
                  <div className="border-t border-[#1F1F25] px-6 py-3">
                    <Link href="/case-studies" className="text-xs text-[#888] hover:text-[#c4302b] transition-colors">
                      Lire l&apos;étude de cas →
                    </Link>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ── TÉMOIGNAGES ──────────────────────────────────────────────── */}
      <section>
        <div className="max-w-6xl mx-auto px-6 py-20">
          <FadeUp><p className="text-xs font-mono text-[#c4302b] tracking-widest uppercase mb-12 text-center">Ce qu&apos;ils disent</p></FadeUp>
          <FadeUp delay={0.1}>
            <motion.blockquote
              className="border border-[#1F1F25] rounded-xl p-8 bg-[#0D0D10] mb-8 max-w-3xl mx-auto text-center"
              whileHover={{ borderColor: 'rgba(196,48,43,0.2)' }}
              transition={{ duration: 0.3 }}
            >
              <p className="font-heading text-xl font-semibold leading-relaxed mb-4 text-[#F5F5F7]">
                &ldquo;{TESTIMONIALS[0].quote}&rdquo;
              </p>
              <p className="text-sm text-[#888]">{TESTIMONIALS[0].author} — {TESTIMONIALS[0].role}</p>
            </motion.blockquote>
          </FadeUp>
          <Stagger className="grid grid-cols-1 md:grid-cols-2 gap-5" delay={0.15}>
            {TESTIMONIALS.slice(1).map(({ quote, author, role }) => (
              <motion.blockquote
                key={author}
                variants={fadeUpChild}
                className="border border-[#1F1F25] rounded-xl p-6 bg-[#0D0D10] space-y-3"
                whileHover={{ borderColor: 'rgba(196,48,43,0.15)' }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-5 h-0.5 bg-[#c4302b]" />
                <p className="text-sm text-[#C4BFB7] leading-relaxed italic">&ldquo;{quote}&rdquo;</p>
                <p className="text-xs text-[#888]">{author} — {role}</p>
              </motion.blockquote>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ── BLOG ─────────────────────────────────────────────────────── */}
      <section>
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="flex items-end justify-between mb-12">
            <FadeUp>
              <SectionLabel>Blog</SectionLabel>
              <h2 className="font-heading text-3xl font-bold">Apprends ce que YUBOT sait.</h2>
              <p className="text-[#888] mt-2 max-w-xl">Les créateurs qui dominent leur niche ne font pas de la chance. Ils maîtrisent des principes précis. On les documente.</p>
            </FadeUp>
            <Link href="/blog" className="text-sm text-[#888] hover:text-[#F5F5F7] transition-colors hidden md:block shrink-0">
              Voir tous les articles →
            </Link>
          </div>
          <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-5" delay={0.1}>
            {BLOG_ARTICLES.map(({ title, date, read, excerpt, slug }) => (
              <motion.div key={slug} variants={fadeUpChild}>
                <Link
                  href={`/blog/${slug}`}
                  className="border border-[#1F1F25] rounded-xl p-6 bg-[#050507] hover:border-[#2E2E38] transition-colors group space-y-3 flex flex-col h-full block"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#3A3A44]">{date}</span>
                    <span className="text-xs text-[#3A3A44]">·</span>
                    <span className="text-xs text-[#3A3A44]">{read} de lecture</span>
                  </div>
                  <h3 className="font-heading text-base font-semibold leading-snug group-hover:text-[#c4302b] transition-colors">{title}</h3>
                  <p className="text-sm text-[#888] leading-relaxed flex-1">{excerpt}</p>
                  <p className="text-xs text-[#c4302b] opacity-0 group-hover:opacity-100 transition-opacity">Lire l&apos;article →</p>
                </Link>
              </motion.div>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <section id="faq">
        <div className="max-w-2xl mx-auto px-6 py-20">
          <SectionLabel>Questions fréquentes</SectionLabel>
          <FadeUp><h2 className="font-heading text-3xl font-bold mb-10">FAQ</h2></FadeUp>
          <div>
            {FAQS.map(faq => <FAQ key={faq.q} q={faq.q} a={faq.a} />)}
          </div>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────────────────────── */}
      <section id="pricing">
        <PricingSection />
      </section>

      {/* ── INTÉGRATIONS ─────────────────────────────────────────────── */}
      <section>
        <div className="max-w-6xl mx-auto px-6 py-20">
          <SectionLabel>Intégrations</SectionLabel>
          <FadeUp>
            <h2 className="font-heading text-3xl font-bold mb-3">YUBOT s&apos;intègre à ton workflow.</h2>
            <p className="text-[#888] mb-12 max-w-xl">T&apos;as déjà tes outils. YUBOT se connecte à eux plutôt que de les remplacer.</p>
          </FadeUp>
          <Stagger className="grid grid-cols-2 md:grid-cols-3 gap-4" delay={0.05}>
            {INTEGRATIONS.map(({ name, desc, available }) => (
              <motion.div
                key={name}
                variants={fadeUpChild}
                className={`border rounded-xl p-5 space-y-2 transition-colors duration-300 ${available ? 'border-[#1F1F25] bg-[#0D0D10] hover:border-[#2E2E38]' : 'border-[#1F1F25] bg-[#050507] opacity-50'}`}
              >
                <div className="flex items-center justify-between">
                  <p className="font-heading font-semibold text-sm">{name}</p>
                  {!available && <span className="text-xs text-[#3A3A44] font-mono">Bientôt</span>}
                </div>
                <p className="text-xs text-[#888] leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────── */}
      <section className=" relative overflow-hidden">
        {/* ambient */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="w-[600px] h-[300px] rounded-full opacity-[0.05]"
            style={{ background: 'radial-gradient(ellipse, #c4302b 0%, transparent 70%)' }} />
        </div>
        <div className="relative max-w-3xl mx-auto px-6 py-28 text-center">
          <SectionLabel>Commence maintenant</SectionLabel>
          <FadeUp>
            <h2 className="font-heading text-4xl lg:text-5xl font-bold leading-tight mb-6">
              Tes prochaines vidéos peuvent changer ta trajectoire. Reste à ce qu&apos;elles soient construites comme il faut.
            </h2>
          </FadeUp>
          <FadeUp delay={0.15}>
            <p className="text-[#888] mb-10 text-lg">Rejoins les 2 500 créateurs qui ont arrêté de deviner ce qui marche.</p>
          </FadeUp>
          <FadeUp delay={0.25}>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="inline-block">
              <Link
                href="/generate"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#c4302b] text-[#050507] font-semibold rounded-lg hover:bg-[#c4302b]/90 transition-colors"
              >
                Essayer YUBOT gratuitement
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </motion.div>
            <p className="text-xs text-[#3A3A44] mt-4">Sans carte bancaire · 7 jours d&apos;essai · Annulable en 1 clic</p>
          </FadeUp>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────── */}
      <footer>
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-12">
            <div className="col-span-2 md:col-span-1 space-y-4">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded bg-[#c4302b] flex items-center justify-center text-[#050507] font-heading font-bold text-sm">Y</span>
                <span className="font-heading font-semibold tracking-tight">YUBOT</span>
              </div>
              <p className="text-xs text-[#3A3A44] leading-relaxed">Agent YouTube IA pour les créateurs qui veulent des résultats.</p>
              <div className="flex items-center gap-3">
                {['Twitter', 'LinkedIn', 'YouTube'].map(s => (
                  <a key={s} href="#" className="text-xs text-[#3A3A44] hover:text-[#888] transition-colors">{s}</a>
                ))}
              </div>
            </div>
            {[
              { title: 'Produit', links: ['Fonctionnalités', 'Tarifs', 'Démo interactive', 'Roadmap', 'Changelog'] },
              { title: 'Ressources', links: ['Blog', 'Guide YouTube 2026', 'Bibliothèque patterns', 'Glossaire', 'Newsletter'] },
              { title: 'Entreprise', links: ['À propos', 'Notre méthode', 'Carrières', 'Partenaires', 'Affiliation'] },
              { title: 'Support', links: ["Centre d'aide", 'Contact', 'Status', 'Documentation API', 'Changelog'] },
            ].map(({ title, links }) => (
              <div key={title}>
                <p className="text-xs font-semibold text-[#F5F5F7] uppercase tracking-widest mb-4">{title}</p>
                <ul className="space-y-2.5">
                  {links.map(link => (
                    <li key={link}>
                      <a href="#" className="text-xs text-[#3A3A44] hover:text-[#888] transition-colors">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-[#1F1F25] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[#3A3A44]">© 2026 YUBOT. Pensé pour les créateurs.</p>
            <div className="flex items-center gap-6">
              {['Mentions légales', 'CGU', 'Politique de confidentialité'].map(l => (
                <a key={l} href="#" className="text-xs text-[#3A3A44] hover:text-[#888] transition-colors">{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
