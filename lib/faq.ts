export interface FAQEntry {
  id: string;
  question: string;
  keywords: string[];
  answer: string;
  related: string[];
}

export interface FAQMatch {
  answer: string;
  suggestions: string[];
}

export const FAQ: FAQEntry[] = [
  {
    id: 'how-it-works',
    question: 'Comment ça marche YUBOT ?',
    keywords: ['fonctionne', 'marche', 'comment utiliser', 'principe', 'c est quoi', 'presentation', 'expliquer', 'keskeske', 'koi', 'quoi'],
    answer: "YUBOT analyse des milliers de vidéos virales pour repérer les patterns qui marchent. Tu donnes un thème, une durée, un ton — il génère un script calqué sur ces patterns. Export Word direct.",
    related: ['scripts-unique', 'patterns-source', 'generating'],
  },
  {
    id: 'scripts-unique',
    question: 'Mes scripts sont-ils uniques ?',
    keywords: ['unique', 'copie', 'plagiat', 'original', 'meme script', 'pareil', 'identique'],
    answer: "Oui. YUBOT s'inspire des PATTERNS viraux (structures, techniques, rythmes), jamais du contenu existant. Chaque script est généré de zéro avec ton thème.",
    related: ['privacy', 'how-it-works', 'ai-style'],
  },
  {
    id: 'scripts-quota',
    question: 'Combien de scripts par mois ?',
    keywords: ['quota', 'limite', 'combien', 'scripts mois', 'plan gratuit', 'nombre scripts'],
    answer: "Plan gratuit : 3 scripts/mois. Plan Créateur : 50/mois. Plan Agence : illimité.",
    related: ['pricing', 'cancel', 'support'],
  },
  {
    id: 'duration-choice',
    question: 'Quelle durée choisir ?',
    keywords: ['duree', 'longueur', 'minutes', 'choisir duree', 'quelle duree', 'combien minutes', 'combien mots', 'duree video'],
    answer: "Sujet émotionnel/storytelling : 10-15 min. Tuto ou méthode : 8-12 min. Opinion/controverse : 5-8 min. Déballage rapide : 3-5 min. Shorts : 30-60 sec.",
    related: ['structure', 'hook-what', 'retention'],
  },
  {
    id: 'ai-style',
    question: "Le script ressemble à de l'IA ?",
    keywords: ['ressemble ia', 'style ia', 'detecter ia', 'robotique', 'naturel', 'humain', 'detection', 'gpt', 'chatgpt', 'intelligence artificielle style'],
    answer: "Non. YUBOT a des règles strictes anti-IA : pas de tournures robotiques, pas de mots de remplissage, pas de faux exemples inventés. Si ça sonne IA quand même, régénère — c'est rare.",
    related: ['how-it-works', 'scripts-unique', 'hook-write'],
  },
  {
    id: 'adapt-text',
    question: "Comment fonctionne 'Adapter mon texte' ?",
    keywords: ['adapter', 'adaptation', 'coller texte', 'mon texte', 'brouillon', 'adapter texte', 'restructurer'],
    answer: "Tu colles ton texte brut, YUBOT le restructure en script viral sans toucher à ton contenu. Si le texte est trop court pour la durée choisie, coche 'Autoriser à compléter' et il ajoute du contenu cohérent.",
    related: ['how-it-works', 'word-export', 'duration-choice'],
  },
  {
    id: 'text-reset',
    question: 'Pourquoi mon texte disparaît entre les onglets ?',
    keywords: ['texte disparait', 'efface', 'reset', 'perdu', 'onglet', 'disparait', 'sauvegarde onglet', 'vide', 'recharge'],
    answer: "Ça ne devrait plus arriver depuis la dernière mise à jour. Les champs sont sauvegardés automatiquement. Si ça persiste, recharge la page une fois.",
    related: ['history', 'privacy', 'support'],
  },
  {
    id: 'cancel',
    question: 'Comment annuler mon abonnement ?',
    keywords: ['annuler', 'resilier', 'annulation', 'supprimer compte', 'desabonner', 'arreter abonnement'],
    answer: "Settings → Abonnement → Annuler. En 1 clic, sans appel. L'accès reste actif jusqu'à la fin de la période payée.",
    related: ['pricing', 'support', 'privacy'],
  },
  {
    id: 'privacy',
    question: 'Mes données sont-elles privées ?',
    keywords: ['donnees', 'prive', 'securite', 'rgpd', 'confidentialite', 'scripts stockes', 'lire mes scripts', 'confidential'],
    answer: "Oui. Tes scripts ne sont jamais lus par des humains et ne servent pas à entraîner des modèles IA. Données chiffrées, RGPD compliant.",
    related: ['scripts-unique', 'cancel', 'history'],
  },
  {
    id: 'word-export',
    question: 'Comment télécharger en Word ?',
    keywords: ['word', 'telecharger', 'exporter', 'docx', 'export', 'telechargement', 'fichier'],
    answer: "Une fois le script généré, clique sur 'Télécharger en Word'. Tu récupères un .docx avec le titre, la miniature et toutes les sections.",
    related: ['how-it-works', 'adapt-text', 'history'],
  },
  {
    id: 'analyze-tab',
    question: "Comment fonctionne l'onglet 'Analyser' ?",
    keywords: ['analyser', 'analyse', 'analyser mon texte', 'score script', 'feedback script', 'diagnostic script', 'evaluer script'],
    answer: "Tu colles ton script, YUBOT l'analyse section par section et le compare aux patterns viraux. Tu obtiens un score global, un verdict, et des axes d'amélioration concrets pour chaque partie.",
    related: ['viral-score', 'hook-what', 'adapt-text'],
  },
  {
    id: 'library',
    question: 'Comment utiliser la bibliothèque ?',
    keywords: ['bibliotheque', 'voir patterns', 'base de donnees', 'explorer patterns', 'consulter patterns'],
    answer: "La bibliothèque liste tous les patterns extraits des vidéos virales analysées. Filtre par type (hook, structure, formule) ou par niche. Clique sur un pattern pour voir le détail et la vidéo source.",
    related: ['patterns-source', 'viral-score', 'hook-what'],
  },
  {
    id: 'history',
    question: 'Mes scripts sont-ils sauvegardés ?',
    keywords: ['historique', 'sauvegarde', 'scripts precedents', 'retrouver scripts', 'archives scripts'],
    answer: "Oui, tes scripts générés sont sauvegardés dans ton compte. Retrouve-les dans l'historique depuis le menu principal.",
    related: ['word-export', 'privacy', 'text-reset'],
  },
  {
    id: 'hook-what',
    question: "Qu'est-ce qu'un hook ?",
    keywords: ['hook', 'accroche', 'debut video', 'premiere seconde', 'qu est ce hook', 'definition hook', 'hook video'],
    answer: "Les 3-15 premières secondes de ta vidéo. Le truc qui fait que le viewer reste au lieu de scroller. Un hook faible = 70% d'audience perdue avant la 10e seconde.",
    related: ['hook-write', 'open-loop', 'structure'],
  },
  {
    id: 'hook-write',
    question: 'Comment écrire un bon hook ?',
    keywords: ['ecrire hook', 'bon hook', 'hook fort', 'hook viral', 'types hook', 'techniques hook', 'ameliorer hook'],
    answer: "Les 3 patterns qui marchent : la promesse choc ('Dans 5 min tu sais exactement comment...'), la question-miroir ('T'as déjà eu l'impression que...'), et la déclaration contre-intuitive. Le secret : le hook doit ouvrir une question dans la tête du viewer.",
    related: ['hook-what', 'open-loop', 'structure'],
  },
  {
    id: 'open-loop',
    question: "Qu'est-ce qu'un open loop ?",
    keywords: ['open loop', 'boucle ouverte', 'tension narrative', 'suspense', 'loop ouvert'],
    answer: "Une question posée au début qu'on ne ferme qu'à la fin. 'Je vais te montrer pourquoi 90% des créateurs font cette erreur...' → le viewer reste pour savoir laquelle. C'est le moteur principal de la rétention YouTube.",
    related: ['hook-what', 'rehook', 'retention'],
  },
  {
    id: 'structure',
    question: 'Comment structurer une vidéo YouTube ?',
    keywords: ['structure', 'structurer', 'plan video', 'organisation video', 'actes', 'plan script', 'plan youtube'],
    answer: "La structure virale de base : Hook (0-15s) → Intro + promesse (15s-1min) → Corps en 2-3 actes avec re-hooks → Conclusion qui ferme le loop. YUBOT adapte cette structure selon les patterns de ta niche.",
    related: ['hook-what', 'rehook', 'open-loop'],
  },
  {
    id: 'rehook',
    question: "C'est quoi un re-hook ?",
    keywords: ['rehook', 're-hook', 'relance attention', 'regagner attention', 'milieu video', 'drop retention', 'mini hook'],
    answer: "Un re-hook est une mini-accroche au milieu de la vidéo avant que l'audience décroche. Typiquement : une révélation partielle, une question nouvelle, ou une stats choc. À placer toutes les 2-3 minutes.",
    related: ['open-loop', 'retention', 'structure'],
  },
  {
    id: 'retention',
    question: 'Comment améliorer ma rétention ?',
    keywords: ['retention', 'retenir audience', 'audience reste', 'watch time', 'pourcentage vue', 'ameliorer retention'],
    answer: "Rétention = loops ouverts + re-hooks réguliers + promesses tenues. Concrètement : ouvre une question toutes les 2 minutes, révèle partiellement, relance. YUBOT structure tes scripts pour maximiser ça automatiquement.",
    related: ['open-loop', 'rehook', 'hook-write'],
  },
  {
    id: 'viral-pattern',
    question: "C'est quoi un pattern viral ?",
    keywords: ['pattern viral', 'pattern', 'formule virale', 'recette virale', 'structure virale', 'technique virale'],
    answer: "Une combinaison de techniques (structure narrative, type de hook, rythme, formulation) qu'on retrouve dans les vidéos qui font 1M+ de vues sur un sujet similaire. YUBOT les extrait automatiquement.",
    related: ['patterns-source', 'library', 'how-it-works'],
  },
  {
    id: 'patterns-source',
    question: "D'où viennent les patterns YUBOT ?",
    keywords: ['source patterns', 'd ou viennent', 'comment extraits', 'analyse videos', 'base donnees patterns', 'combien videos'],
    answer: "YUBOT analyse régulièrement les nouvelles vidéos virales de ta niche (business, IA, mindset, entrepreneuriat). Il extrait les patterns de hooks, de structure narrative et de formules qui se répètent dans les vidéos les plus performantes.",
    related: ['viral-pattern', 'library', 'viral-score'],
  },
  {
    id: 'tone-choice',
    question: 'Quelle différence entre les tons ?',
    keywords: ['ton', 'viral', 'educatif', 'storytelling', 'tutoriel', 'provocateur', 'inspirant', 'analytique', 'choisir ton', 'difference ton', 'quel ton'],
    answer: "Viral = énergie haute + curiosity gap. Éducatif = progression logique + exemples. Storytelling = arc narratif + voix intime. Provocateur = opinion forte + controverse. Analytique = chiffres + breakdown. Choisis selon ton audience habituelle.",
    related: ['duration-choice', 'structure', 'viral-score'],
  },
  {
    id: 'viral-score',
    question: "C'est quoi le score viral ?",
    keywords: ['score', 'score viral', 'note script', 'evaluer script', 'qualite script', 'score analyse'],
    answer: "Le score viral (0-100) estime le potentiel de rétention de ton script selon les patterns viraux de ta niche. Il prend en compte la force du hook, la densité narrative, les re-hooks et le payoff final.",
    related: ['analyze-tab', 'hook-what', 'retention'],
  },
  {
    id: 'no-cta',
    question: 'Pourquoi pas de CTA en conclusion ?',
    keywords: ['cta', 'call to action', 'abonne', 'pas cta', 'fin video', 'conclusion', 'abonnement conclusion'],
    answer: "Les CTAs en fin de vidéo cassent l'élan et signalent au viewer qu'il peut partir. Les vidéos virales finissent sur une observation forte — ça déclenche les commentaires organiquement, sans le demander.",
    related: ['structure', 'open-loop', 'retention'],
  },
  {
    id: 'information-density',
    question: "C'est quoi la densité d'information ?",
    keywords: ['densite', 'densite information', 'trop dense', 'pas assez contenu', 'rythme info', 'information video'],
    answer: "Le ratio idée/mot. Trop dense = les viewers sont perdus. Pas assez = ils s'ennuient. La zone virale : une idée nouvelle toutes les 30-40 secondes, bien expliquée.",
    related: ['retention', 'structure', 'duration-choice'],
  },
  {
    id: 'pricing',
    question: 'Quelle est la différence entre les plans ?',
    keywords: ['prix', 'plan', 'tarif', 'gratuit', 'createur', 'agence', 'abonnement', 'combien coute', 'offre'],
    answer: "Plan Gratuit : 3 scripts/mois, fonctions de base. Plan Créateur : 50 scripts/mois, analyse, export Word, bibliothèque complète. Plan Agence : illimité, multi-comptes, accès prioritaire.",
    related: ['scripts-quota', 'cancel', 'support'],
  },
  {
    id: 'support',
    question: 'Comment contacter le support ?',
    keywords: ['support', 'contact', 'aide humaine', 'email support', 'bug signaler', 'probleme technique', 'ethan'],
    answer: "Pour un bug ou une question urgente : hello@yubot.com. Réponse en général dans les 24h.",
    related: ['cancel', 'pricing', 'error'],
  },
  {
    id: 'english',
    question: 'Je peux générer en anglais ?',
    keywords: ['anglais', 'english', 'langue', 'other language', 'francais seulement', 'other country'],
    answer: "YUBOT est optimisé pour le français — les patterns sont extraits de vidéos francophones. Pour l'anglais, les structures fonctionnent mais les nuances de style sont moins précises.",
    related: ['how-it-works', 'patterns-source', 'support'],
  },
  {
    id: 'generating',
    question: 'Comment générer mon premier script ?',
    keywords: ['generer', 'generation', 'comment generer', 'creer script', 'premier script', 'demarrer', 'commencer'],
    answer: "Onglet 'Générer un script' → écris ton thème → choisis la durée et le ton → clique sur Générer. YUBOT produit un script complet en 20-40 secondes selon la longueur.",
    related: ['how-it-works', 'duration-choice', 'tone-choice'],
  },
  {
    id: 'shorts',
    question: 'Comment faire un bon YouTube Short ?',
    keywords: ['short', 'shorts', 'tiktok', 'reels', 'court', 'vertical', '30 secondes', '60 secondes'],
    answer: "Pour les Shorts : hook dans la 1ère seconde (texte choc), pas d'intro, droit au but, maximum 1 idée par vidéo, conclusion avec twist ou révélation. Sélectionne 30s ou 60s dans YUBOT.",
    related: ['duration-choice', 'hook-write', 'structure'],
  },
  {
    id: 'error',
    question: "Que faire si ça ne fonctionne pas ?",
    keywords: ['erreur', 'bug', 'marche pas', 'bloque', 'probleme', 'ne fonctionne pas', 'erreur api', 'chargement'],
    answer: "Recharge la page d'abord. Si ça persiste, vérifie ta connexion. Toujours bloqué : contacte hello@yubot.com avec une capture d'écran.",
    related: ['support', 'text-reset', 'how-it-works'],
  },
];

export const QUICK_QUESTIONS = [
  "Comment écrire un hook viral ?",
  "Quelle durée choisir ?",
  "Comment ça marche YUBOT ?",
  "Différence entre les plans ?",
  "C'est quoi un pattern viral ?",
];

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[''ʼ`]/g, '')
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function findFAQAnswer(query: string): FAQMatch | null {
  const normQuery = normalize(query);
  const queryWords = normQuery.split(' ').filter(w => w.length >= 3);

  let best: FAQEntry | null = null;
  let bestScore = 0;

  for (const entry of FAQ) {
    let score = 0;
    for (const keyword of entry.keywords) {
      const normKw = normalize(keyword);
      if (normQuery.includes(normKw)) {
        score += normKw.split(' ').filter(w => w.length >= 3).length + 1;
      } else {
        const kwWords = normKw.split(' ').filter(w => w.length >= 3);
        for (const kw of kwWords) {
          if (queryWords.includes(kw)) score += 1;
        }
      }
    }
    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  }

  if (!best || bestScore < 2) return null;

  const suggestions = best.related
    .map(id => FAQ.find(e => e.id === id)?.question)
    .filter((q): q is string => Boolean(q))
    .slice(0, 3);

  return { answer: best.answer, suggestions };
}
