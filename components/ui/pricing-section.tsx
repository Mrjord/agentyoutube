"use client";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Sparkles } from "@/components/ui/sparkles";
import { TimelineContent } from "@/components/ui/timeline-animation";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";
import { cn } from "@/lib/utils";
import NumberFlow from "@number-flow/react";
import { motion } from "framer-motion";
import { useRef, useState } from "react";

const plans = [
  {
    name: "Starter",
    description: "Pour démarrer et tester les patterns viraux sur YouTube.",
    price: 19,
    yearlyPrice: 190,
    href: "/generate",
    buttonText: "Commencer gratuitement",
    buttonVariant: "outline" as const,
    includes: [
      "Inclus :",
      "10 scripts / mois",
      "Tous les patterns viraux actifs",
      "Adaptation de texte (5/mois)",
      "Export Word sur tous les scripts",
      "Support email sous 48h",
    ],
  },
  {
    name: "Pro",
    description: "Pour les créateurs qui publient régulièrement.",
    price: 49,
    yearlyPrice: 490,
    href: "/generate",
    buttonText: "Commencer gratuitement",
    buttonVariant: "default" as const,
    popular: true,
    includes: [
      "Tout Starter, plus :",
      "50 scripts / mois",
      "Patterns viraux + analyses avancées",
      "Adaptation de texte illimitée",
      "Bibliothèque de patterns personnelle",
      "Tendances hebdomadaires",
      "Support prioritaire sous 12h",
    ],
  },
  {
    name: "Studio",
    description: "Pour les agences et équipes créatives.",
    price: 149,
    yearlyPrice: 1490,
    href: "/contact",
    buttonText: "Contacter l'équipe",
    buttonVariant: "outline" as const,
    includes: [
      "Tout Pro, plus :",
      "Scripts illimités",
      "Analyses personnalisées par niche",
      "Accès API",
      "Multi-utilisateurs (5 sièges)",
      "Support dédié + gestionnaire",
      "Onboarding personnalisé (60 min)",
    ],
  },
];

const PricingSwitch = ({ onSwitch }: { onSwitch: (value: string) => void }) => {
  const [selected, setSelected] = useState("0");

  const handleSwitch = (value: string) => {
    setSelected(value);
    onSwitch(value);
  };

  return (
    <div className="flex justify-center">
      <div className="relative z-10 mx-auto flex w-fit rounded-full bg-neutral-900 border border-[#c4302b]/30 p-1">
        {["Mensuel", "Annuel"].map((label, idx) => {
          const val = String(idx);
          return (
            <button
              key={val}
              onClick={() => handleSwitch(val)}
              className={cn(
                "relative z-10 w-fit h-10 rounded-full sm:px-6 px-3 sm:py-2 py-1 font-medium transition-colors",
                selected === val ? "text-white" : "text-gray-400",
              )}
            >
              {selected === val && (
                <motion.span
                  layoutId="switch"
                  className="absolute top-0 left-0 h-10 w-full rounded-full border-2 shadow-sm shadow-[#c4302b] border-[#c4302b] bg-gradient-to-t from-[#a02020] to-[#c4302b]"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <span className="relative">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default function PricingSection() {
  const [isYearly, setIsYearly] = useState(false);
  const pricingRef = useRef<HTMLDivElement>(null);

  const revealVariants: import("framer-motion").Variants = {
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: { delay: i * 0.15, duration: 0.5 },
    }),
    hidden: { filter: "blur(10px)", y: -20, opacity: 0 },
  };

  return (
    <div
      className="min-h-screen mx-auto relative bg-[#050507] overflow-x-hidden"
      ref={pricingRef}
    >
      {/* background sparkles */}
      <TimelineContent
        animationNum={4}
        timelineRef={pricingRef}
        customVariants={revealVariants}
        className="absolute top-0 h-96 w-full overflow-hidden [mask-image:radial-gradient(50%_50%,white,transparent)]"
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:70px_80px]" />
        <Sparkles
          density={1200}
          direction="bottom"
          speed={0.8}
          color="#c4302b"
          className="absolute inset-x-0 bottom-0 h-full w-full [mask-image:radial-gradient(50%_50%,white,transparent_85%)]"
        />
      </TimelineContent>

      {/* red glow ellipse */}
      <TimelineContent
        animationNum={5}
        timelineRef={pricingRef}
        customVariants={revealVariants}
        className="absolute left-0 top-[-114px] w-full h-[70vh] pointer-events-none z-0"
      >
        <div
          className="absolute left-[-30%] right-[-30%] top-0 h-[600px] flex-none rounded-full"
          style={{
            border: "150px solid #c4302b",
            filter: "blur(92px)",
            WebkitFilter: "blur(92px)",
            opacity: 0.12,
          }}
        />
      </TimelineContent>

      {/* header */}
      <article className="text-center mb-6 pt-32 max-w-3xl mx-auto space-y-4 relative z-50 px-4">
        <p className="text-xs font-mono text-[#c4302b] tracking-widest uppercase">Tarifs</p>
        <h2 className="text-4xl font-medium text-white">
          <VerticalCutReveal
            splitBy="words"
            staggerDuration={0.12}
            staggerFrom="first"
            reverse={true}
            containerClassName="justify-center"
            transition={{ type: "spring", stiffness: 250, damping: 40, delay: 0 }}
          >
            Simple. Transparent. Sans piège.
          </VerticalCutReveal>
        </h2>

        <TimelineContent
          as="p"
          animationNum={0}
          timelineRef={pricingRef}
          customVariants={revealVariants}
          className="text-gray-400"
        >
          7 jours d&apos;essai gratuit sur tous les plans · Sans carte bancaire · Résiliation en 1 clic
        </TimelineContent>

        <TimelineContent
          as="div"
          animationNum={1}
          timelineRef={pricingRef}
          customVariants={revealVariants}
        >
          <PricingSwitch onSwitch={(v) => setIsYearly(Number(v) === 1)} />
        </TimelineContent>
      </article>

      {/* radial glow behind cards */}
      <div
        className="absolute top-0 left-[10%] right-[10%] w-[80%] h-full z-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle at center, #c4302b 0%, transparent 70%)",
          opacity: 0.05,
        }}
      />

      {/* cards */}
      <div className="grid md:grid-cols-3 max-w-5xl gap-4 py-6 mx-auto px-4 relative z-10">
        {plans.map((plan, index) => (
          <TimelineContent
            key={plan.name}
            animationNum={2 + index}
            timelineRef={pricingRef}
            customVariants={revealVariants}
          >
            <Card
              className={cn(
                "relative text-white border-neutral-800 h-full",
                plan.popular
                  ? "bg-gradient-to-b from-neutral-900 via-neutral-800 to-neutral-900 shadow-[0px_-13px_200px_0px_#c4302b40] z-20"
                  : "bg-gradient-to-b from-neutral-900 via-neutral-800 to-neutral-900 z-10"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <span className="px-3 py-1 bg-[#c4302b] text-white text-xs font-semibold rounded-full">
                    Le plus populaire
                  </span>
                </div>
              )}
              <CardHeader className="text-left">
                <h3 className="text-2xl font-semibold mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">
                    <NumberFlow
                      value={isYearly ? plan.yearlyPrice : plan.price}
                      className="text-4xl font-bold"
                    />
                    €
                  </span>
                  <span className="text-gray-400 text-sm">
                    /{isYearly ? "an" : "mois"}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mt-1">{plan.description}</p>
              </CardHeader>

              <CardContent className="pt-0">
                <Link
                  href={plan.href}
                  className={cn(
                    "flex items-center justify-center w-full mb-6 p-4 text-base font-semibold rounded-xl transition-all",
                    plan.popular
                      ? "bg-gradient-to-t from-[#a02020] to-[#c4302b] shadow-lg shadow-[#c4302b40] border border-[#c4302b] text-white hover:opacity-90"
                      : "bg-gradient-to-t from-neutral-950 to-neutral-700 shadow-lg shadow-neutral-900 border border-neutral-700 text-white hover:border-[#c4302b]/40 hover:text-[#c4302b] transition-colors"
                  )}
                >
                  {plan.buttonText}
                </Link>

                <div className="space-y-3 pt-4 border-t border-neutral-700">
                  <h4 className="font-medium text-sm text-[#c4302b]">
                    {plan.includes[0]}
                  </h4>
                  <ul className="space-y-2">
                    {plan.includes.slice(1).map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 bg-[#c4302b] rounded-full shrink-0" />
                        <span className="text-sm text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TimelineContent>
        ))}
      </div>

      <p className="text-center text-xs text-neutral-600 pb-12 relative z-10">
        Toutes les offres incluent 7 jours d&apos;essai gratuit · Aucune carte bancaire · Résiliation en 1 clic
      </p>
    </div>
  );
}
