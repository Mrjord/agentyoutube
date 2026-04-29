export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "callout"; text: string }

export type Article = {
  slug: string
  title: string
  excerpt: string
  date: string
  read: string
  content: Block[]
}

export const articles: Article[] = [
  {
    slug: "7-hooks-youtube-2026",
    title: "Les 7 hooks qui cartonnent en 2026 sur YouTube",
    excerpt:
      "Un hook n'est pas une phrase d'ouverture. C'est un mécanisme psychologique précis. Voici les 7 structures qui déclenchent l'attention en moins de 6 secondes.",
    date: "12 jan. 2026",
    read: "9 min",
    content: [
      {
        type: "p",
        text: "Un hook n'est pas une phrase d'ouverture. C'est un mécanisme psychologique qui crée un état de tension dans l'esprit du spectateur — une boucle ouverte qu'il ne peut pas fermer tant qu'il n'a pas regardé la suite.",
      },
      {
        type: "p",
        text: "La plupart des créateurs confondent hook et introduction. Ils commencent par se présenter, par remercier leurs abonnés, ou par annoncer ce dont ils vont parler. C'est une erreur de structure. YouTube mesure l'attention seconde par seconde. Dans les 6 premières secondes, le spectateur décide inconsciemment s'il reste ou s'il part.",
      },
      {
        type: "p",
        text: "Voici les 7 structures de hooks qui ont dominé les performances en 2026 dans les niches business, mindset et entrepreneuriat.",
      },
      {
        type: "h2",
        text: "1. Le hook contradiction",
      },
      {
        type: "p",
        text: "Format : \"On t'a dit que [croyance commune]. C'est faux.\" Ce hook fonctionne parce qu'il crée une dissonance cognitive immédiate. Le cerveau veut résoudre les contradictions. Exemple : \"On t'a dit qu'il faut poster tous les jours pour grossir sur YouTube. Les chiffres disent le contraire.\"",
      },
      {
        type: "h2",
        text: "2. Le hook chiffre précis",
      },
      {
        type: "p",
        text: "Format : \"[Chiffre précis] + [résultat contre-intuitif].\" La précision crée de la crédibilité. \"73% des créateurs qui postent moins de 2 fois par semaine grossissent plus vite que ceux qui postent quotidiennement.\" Le chiffre précis — pas \"la plupart\" — déclenche l'intérêt parce qu'il suggère une source réelle.",
      },
      {
        type: "h2",
        text: "3. Le hook promesse temporelle",
      },
      {
        type: "p",
        text: "Format : \"Dans [durée courte], tu vas [résultat concret].\" Exemple : \"Dans les 8 prochaines minutes, tu vas comprendre pourquoi ta chaîne plafonne — et comment corriger ça cette semaine.\" La durée courte plus le résultat concret créent une promesse que le spectateur peut évaluer immédiatement.",
      },
      {
        type: "h2",
        text: "4. Le hook erreur commune",
      },
      {
        type: "p",
        text: "Format : \"Si tu fais [action commune], tu perds [conséquence invisible].\" Exemple : \"Si tu commences tes vidéos par 'Bonjour et bienvenue sur ma chaîne', tu perds en moyenne 34% de ton audience dans les 15 premières secondes.\" La douleur potentielle est plus forte que la promesse de gain.",
      },
      {
        type: "h2",
        text: "5. Le hook conséquence cachée",
      },
      {
        type: "p",
        text: "Format : \"[Pratique connue] a une conséquence que personne ne mentionne.\" Exemple : \"L'algorithme YouTube récompense le watch time. Mais il y a un signal qu'il mesure encore plus fort — et que 95% des créateurs ignorent complètement.\" Ce hook exploite la curiosité sur un angle aveugle.",
      },
      {
        type: "h2",
        text: "6. Le hook identité",
      },
      {
        type: "p",
        text: "Format : \"Si tu es [profil spécifique], cette vidéo est pour toi.\" Exemple : \"Si tu as moins de 10 000 abonnés et que tu publies depuis plus de 6 mois sans voir tes vues décoller — regarde ça jusqu'au bout.\" Ce hook filtre l'audience et augmente la rétention parce que les gens qui se reconnaissent restent.",
      },
      {
        type: "h2",
        text: "7. Le hook rupture de logique",
      },
      {
        type: "p",
        text: "Format : \"[Affirmation absurde mais vraie].\" Exemple : \"J'ai gagné plus d'argent avec 3 vidéos qu'avec 47. Voici pourquoi.\" L'absurdité apparente force le spectateur à rester pour comprendre — son cerveau veut résoudre l'incohérence.",
      },
      {
        type: "h2",
        text: "Comment utiliser ces hooks en pratique",
      },
      {
        type: "p",
        text: "Ces structures ne sont pas des templates à copier mot pour mot. Ce sont des mécanismes psychologiques à comprendre. Pour chaque vidéo, identifie d'abord : quelle est la croyance que tu veux challenger ? Quelle est la douleur que ton audience veut éviter ? Quel résultat contre-intuitif peux-tu démontrer ?",
      },
      {
        type: "p",
        text: "Le hook doit sortir directement de la substance de ta vidéo — pas d'une liste de formules. Le meilleur hook pour une chaîne business n'est pas le même que pour une chaîne carrière. Analyse les 10 vidéos les plus performantes de ta niche et identifie quelle structure de hook chacune utilise.",
      },
      {
        type: "callout",
        text: "Règle absolue : ne promets jamais dans ton hook ce que ta vidéo ne délivre pas. Le spectateur reviendra si tu tiens ta promesse. Il ne reviendra jamais si tu l'as trompé.",
      },
      {
        type: "h2",
        text: "Le test du hook en 10 secondes",
      },
      {
        type: "p",
        text: "Avant de filmer, lis ton hook à voix haute. Si après 10 secondes tu peux répondre à la question \"pourquoi est-ce que je devrais regarder la suite ?\" de façon précise et spécifique — le hook est bon. Si la réponse est vague ou générique, retravaille-le.",
      },
      {
        type: "ul",
        items: [
          "Le hook contradiction : crée une dissonance cognitive immédiate",
          "Le hook chiffre précis : la précision signale la crédibilité",
          "Le hook promesse temporelle : délai court + résultat mesurable",
          "Le hook erreur commune : la douleur bat la promesse",
          "Le hook conséquence cachée : exploite l'angle aveugle",
          "Le hook identité : filtre l'audience, augmente la rétention",
          "Le hook rupture de logique : force la résolution cognitive",
        ],
      },
    ],
  },
  {
    slug: "pourquoi-videos-peu-vues",
    title: "Pourquoi 90% des vidéos n'atteignent jamais 1 000 vues",
    excerpt:
      "Ce n'est pas une question de talent, de niche, ni même de SEO. C'est une question de 5 erreurs structurelles que commettent presque tous les créateurs.",
    date: "3 jan. 2026",
    read: "11 min",
    content: [
      {
        type: "p",
        text: "90% des vidéos YouTube ne dépassent jamais 1 000 vues. Cette statistique vaut pour les chaînes nouvelles comme pour celles qui existent depuis 3 ans. Ce n'est pas une question de talent, de niche, ou de chance. C'est une question de 5 erreurs structurelles que commettent presque tous les créateurs — et qu'on peut corriger.",
      },
      {
        type: "h2",
        text: "Erreur 1 : Le titre sans angle",
      },
      {
        type: "p",
        text: "Un titre descriptif n'est pas un titre optimisé. \"Comment monétiser YouTube\" est descriptif. \"J'ai gagné 3 200€ avec ma première vidéo YouTube — voici exactement comment\" est un angle. La différence : l'angle crée un point de vue unique. Il répond à la question implicite du spectateur : \"Pourquoi cette vidéo plutôt qu'une autre ?\"",
      },
      {
        type: "p",
        text: "Teste tes titres avec cette règle : est-ce que quelqu'un d'autre pourrait avoir fait exactement la même vidéo avec ce titre ? Si oui, ton titre est générique. Trouve l'angle qui te différencie — une expérience personnelle, un chiffre précis, un angle contre-intuitif.",
      },
      {
        type: "h2",
        text: "Erreur 2 : Le hook trop lent",
      },
      {
        type: "p",
        text: "Les premières 30 secondes d'une vidéo perdent en moyenne 40% de l'audience. Ce n'est pas parce que les gens n'aiment pas le contenu — c'est parce que l'intro ne prouve pas encore que la vidéo vaut leur temps.",
      },
      {
        type: "p",
        text: "Un hook efficace fait une seule chose : prouver que rester est dans l'intérêt du spectateur. \"Aujourd'hui on va parler de...\" ne prouve rien. \"J'ai testé 14 stratégies différentes de monétisation YouTube. 12 ne m'ont rien rapporté. Les 2 qui marchent, je te les montre maintenant\" prouve que tu as quelque chose de concret à donner.",
      },
      {
        type: "h2",
        text: "Erreur 3 : L'intro de présentation",
      },
      {
        type: "p",
        text: "\"Bonjour, je m'appelle [prénom], bienvenue sur ma chaîne où je parle de [thème]...\" est la formule qui tue le plus de chaînes. Le spectateur ne te connaît pas encore. Il n'a pas de raison d'être intéressé par qui tu es. Il a une raison d'être intéressé par ce que tu peux lui apporter.",
      },
      {
        type: "callout",
        text: "Commence par la substance. Présente-toi après avoir prouvé ta valeur — dans la vidéo, pas avant. Les grandes chaînes font des introductions courtes parce qu'elles ont déjà prouvé leur valeur. Toi, tu dois la prouver d'abord.",
      },
      {
        type: "h2",
        text: "Erreur 4 : La promesse floue",
      },
      {
        type: "p",
        text: "\"Dans cette vidéo, on va voir comment améliorer ta chaîne YouTube\" n'est pas une promesse. C'est une direction vague. Une promesse précise donne un résultat mesurable : \"À la fin de cette vidéo, tu auras une liste de 3 changements précis à faire sur ta chaîne cette semaine pour doubler ton taux de rétention.\"",
      },
      {
        type: "p",
        text: "La précision de la promesse prédit la rétention. Plus ta promesse est spécifique, plus le spectateur a une raison de rester jusqu'au bout pour vérifier si tu l'as tenue. Et plus la rétention est haute, plus l'algorithme pousse ta vidéo.",
      },
      {
        type: "h2",
        text: "Erreur 5 : La conclusion sans direction",
      },
      {
        type: "p",
        text: "La fin d'une vidéo n'est pas une conclusion — c'est un carrefour. Le spectateur a deux options : continuer à regarder du contenu sur ta chaîne, ou partir vers autre chose. La plupart des créateurs finissent par \"Si cette vidéo vous a plu, n'oubliez pas de liker et vous abonner.\" C'est une demande, pas une direction.",
      },
      {
        type: "p",
        text: "Propose toujours une étape suivante précise : \"Si tu veux aller plus loin, cette vidéo explique comment construire ton premier script en 20 minutes — je te mets le lien maintenant.\" Tu diriges l'audience là où tu veux qu'elle aille.",
      },
      {
        type: "h2",
        text: "Le problème systémique",
      },
      {
        type: "p",
        text: "Ces 5 erreurs ne sont pas des erreurs d'exécution — ce sont des erreurs de structure. La structure se règle au niveau du scripting, avant de tourner. Corriger ces 5 points ne garantit pas le viral. Mais ne pas les corriger garantit de rester sous les 1 000 vues.",
      },
      {
        type: "ul",
        items: [
          "Titre avec angle unique — pas juste descriptif",
          "Hook en 30 secondes — prouve ta valeur immédiatement",
          "Pas d'intro de présentation — commence par la substance",
          "Promesse précise et mesurable — pas une direction vague",
          "Conclusion avec direction claire vers la prochaine vidéo",
        ],
      },
    ],
  },
  {
    slug: "algorithme-youtube-2026",
    title: "L'algorithme YouTube en 2026 : tout ce qui a vraiment changé",
    excerpt:
      "Le watch time n'est plus le seul signal qui compte. En 2026, YouTube mesure des dizaines d'autres indicateurs que la plupart des créateurs ignorent.",
    date: "28 déc. 2025",
    read: "13 min",
    content: [
      {
        type: "p",
        text: "En 2019, la formule était simple : watch time + clics = algorithme heureux. En 2026, YouTube mesure des dizaines de signaux que la plupart des créateurs ignorent encore. Comprendre ces signaux ne te rend pas \"ami avec l'algorithme\" — ça t'aide à comprendre ce que YouTube essaie de faire : garder les spectateurs sur la plateforme le plus longtemps possible.",
      },
      {
        type: "h2",
        text: "1. La satisfaction remplace le watch time brut",
      },
      {
        type: "p",
        text: "Le watch time absolu a perdu de l'importance. Ce qui compte maintenant, c'est le \"satisfaction score\" — une métrique composite que YouTube calcule à partir de plusieurs signaux. Les principaux : le taux de retour (est-ce que le spectateur revient sur ta chaîne dans les 7 jours ?), le comportement post-vidéo (après avoir regardé ta vidéo, continue-t-il sur YouTube ?), et les \"likes tardifs\" donnés plusieurs heures après le visionnage.",
      },
      {
        type: "h2",
        text: "2. La vitesse de rétention initiale",
      },
      {
        type: "p",
        text: "YouTube ne mesure plus seulement le pourcentage global de rétention — il mesure la courbe de rétention dans les 30 premières secondes séparément. Une vidéo qui retient 85% de son audience pendant les 30 premières secondes obtient un boost algorithmique même si la rétention globale est ordinaire.",
      },
      {
        type: "callout",
        text: "C'est pour ça que le hook est devenu aussi critique. Les premières 30 secondes ne sont plus juste \"importantes pour garder l'audience\" — elles sont directement mesurées comme signal de qualité par YouTube.",
      },
      {
        type: "h2",
        text: "3. Les sessions YouTube",
      },
      {
        type: "p",
        text: "YouTube veut des sessions longues, pas des vidéos longues. Une vidéo de 8 minutes qui enchaîne sur 3 autres vidéos de ta chaîne est plus précieuse qu'une vidéo de 45 minutes qui termine la session.",
      },
      {
        type: "ul",
        items: [
          "Les cartes et écrans de fin vers tes autres vidéos ont plus de valeur qu'avant",
          "Les playlists thématiques obtiennent un boost si elles génèrent des sessions longues",
          "Les vidéos courtes en série tendent à mieux performer que les longues vidéos isolées",
        ],
      },
      {
        type: "h2",
        text: "4. Le signal \"Ne plus recommander\"",
      },
      {
        type: "p",
        text: "YouTube mesure activement les clics sur \"Ne plus recommander\" et \"Pas intéressé\". Une vidéo qui génère beaucoup de ces signaux est dépriorisée, même si son watch time est correct. Ce signal est particulièrement sévère dans les premières 24 heures — c'est la fenêtre la plus critique.",
      },
      {
        type: "p",
        text: "Conséquence pratique : si tu as une audience établie et que tu changes brutalement de style, de sujet ou de format, tu risques de générer des \"pas intéressé\" qui pénalisent la vidéo indépendamment de sa qualité.",
      },
      {
        type: "h2",
        text: "5. Le CTR dynamique par phase",
      },
      {
        type: "p",
        text: "Le CTR n'est plus mesuré sur une période fixe. YouTube mesure le CTR sur plusieurs phases : phase 1 (audience abonnée, premières 2h), phase 2 (audience similaire, 2h-48h), phase 3 (audience froide, après 48h).",
      },
      {
        type: "p",
        text: "Un CTR élevé en phase 1 mais bas en phase 3 indique que la thumbnail attire tes abonnés mais pas les nouveaux spectateurs. Ce pattern limite la capacité de la vidéo à être recommandée à des non-abonnés — et donc sa croissance globale.",
      },
      {
        type: "h2",
        text: "Ce que ça change pour ta stratégie",
      },
      {
        type: "p",
        text: "L'algorithme 2026 récompense la cohérence plus que la performance isolée. Une chaîne qui publie 2 vidéos par semaine avec une rétention stable et un CTR correct sur la phase 3 surpasse une chaîne qui publie 1 vidéo virale par mois entourée de contenu ordinaire.",
      },
      {
        type: "p",
        text: "La leçon la plus importante : optimise pour ton audience, pas pour l'algorithme. YouTube est fondamentalement un système de recommandation — il recommande ce que les gens aiment. Si tu produis des vidéos que les gens regardent jusqu'au bout et vers lesquelles ils reviennent, l'algorithme suit.",
      },
      {
        type: "ul",
        items: [
          "Satisfaction score > watch time brut : mesure ton taux de retour à 7 jours",
          "Rétention des 30 premières secondes : signal de qualité direct pour YouTube",
          "Sessions longues > vidéos longues : soigne tes cartes et fin d'écran",
          "\"Pas intéressé\" = signal négatif fort, surtout les premières 24h",
          "CTR phase 3 (audience froide) : indicateur de scalabilité de ta vidéo",
        ],
      },
    ],
  },
  {
    slug: "niche-youtube-rentable",
    title: "Comment choisir une niche YouTube rentable (sans se tromper)",
    excerpt:
      "Passion, marché, monétisation : le bon équilibre entre ces 3 cercles détermine si ta chaîne durera 6 mois ou 6 ans.",
    date: "15 jan. 2026",
    read: "10 min",
    content: [
      {
        type: "p",
        text: "Choisir une niche YouTube, c'est prendre une décision qui va structurer les 12 prochains mois de ton travail. La plupart des créateurs font ce choix sur un coup de passion ou sur une vague intuition de marché. Résultat : ils publient pendant 6 mois dans une niche qui ne convertit pas, ou ils s'ennuient après 3 vidéos.",
      },
      {
        type: "h2",
        text: "Étape 1 : L'intersection des 3 cercles",
      },
      {
        type: "p",
        text: "Une niche viable se trouve à l'intersection de 3 éléments : ce que tu sais faire (expertise), ce que les gens cherchent activement (demande), et ce qui peut générer des revenus (monétisation). Beaucoup de créateurs s'arrêtent au premier cercle — ils choisissent une niche parce qu'ils la maîtrisent, sans vérifier si cette maîtrise répond à une demande réelle.",
      },
      {
        type: "h3",
        text: "Comment évaluer la demande",
      },
      {
        type: "p",
        text: "Utilise YouTube pour chercher les 10 mots-clés les plus évidents de ta niche potentielle. Regarde les vidéos qui apparaissent : quelle est la date de la plus récente ? Quel est le nombre de vues sur les 5 meilleures ? Si les meilleures vidéos ont moins de 50 000 vues et datent de 2021, la niche est probablement saturée ou trop petite.",
      },
      {
        type: "h3",
        text: "Comment évaluer la monétisation",
      },
      {
        type: "p",
        text: "Trois modèles fonctionnent sur YouTube : la publicité (CPM), les produits propres (formations, coaching, SaaS), et les partenariats. Le CPM dépend directement de la niche. Finance, B2B et logiciels ont des CPM entre 8€ et 30€. Gaming et lifestyle sont souvent entre 1€ et 4€. Si tu veux vivre uniquement de la publicité dans une niche à faible CPM, il te faut des millions de vues par mois.",
      },
      {
        type: "h2",
        text: "Étape 2 : Le test de durabilité",
      },
      {
        type: "p",
        text: "Une niche durable remplit deux conditions : elle génère de la demande de façon continue, et tu peux y produire du contenu original pendant au moins 2 ans. Pour tester, liste 50 idées de vidéos pour ta niche. Si tu t'arrêtes à 20 et que les 20 restantes te paraissent creuses, la niche est trop étroite.",
      },
      {
        type: "h2",
        text: "Étape 3 : Le positionnement différencié",
      },
      {
        type: "p",
        text: "Dans une niche, il existe souvent déjà 3 à 10 créateurs qui dominent. La mauvaise question est \"est-ce que je peux les battre ?\" La bonne question est \"quel angle ils ne couvrent pas ?\"",
      },
      {
        type: "ul",
        items: [
          "Finance personnelle : la plupart parlent de portefeuilles → positionnement sur finances pour freelances",
          "Marketing digital : stratégie générale → marketing pour solo-créateurs sans équipe",
          "Entrepreneuriat : montrer le succès → documenter les erreurs et les échecs réels",
          "IA généraliste : outils théoriques → applications concrètes dans un seul métier",
        ],
      },
      {
        type: "h2",
        text: "Les niches qui surperforment en 2026",
      },
      {
        type: "p",
        text: "D'après les données des 12 derniers mois, ces catégories combinent demande forte, CPM élevé, et niveau de saturation encore gérable : IA appliquée aux métiers spécifiques (comptable, avocat, médecin — pas l'IA en général), carrière et reconversion pour les 25-40 ans, business en ligne avec preuves documentées, et santé mentale et performance (burnout, focus, productivité).",
      },
      {
        type: "callout",
        text: "La décision finale : choisis une niche que tu peux tenir pendant 18 mois, dans laquelle tu as un angle différencié, et qui peut générer des revenus via au moins 2 modèles différents. Si tu coches ces 3 cases, lance-toi. Si tu hésites encore, c'est souvent l'exécution qui manque, pas la niche.",
      },
    ],
  },
  {
    slug: "titre-thumbnail-ctr",
    title: "Titres et thumbnails : la formule pour un CTR au-dessus de 5%",
    excerpt:
      "Le CTR moyen est de 2 à 5%. En dessous de 3%, YouTube arrête de pousser ta vidéo après quelques heures. Voici comment passer au-dessus.",
    date: "22 jan. 2026",
    read: "8 min",
    content: [
      {
        type: "p",
        text: "Le CTR moyen sur YouTube est de 2 à 5%. Si tes vidéos sont en dessous de 3%, YouTube arrête de les pousser après les premières heures — il interprète un CTR bas comme un signal que le contenu n'intéresse pas les spectateurs à qui il le montre.",
      },
      {
        type: "p",
        text: "Augmenter son CTR ne nécessite pas un talent de designer ou de copywriter inné. Ça nécessite de comprendre 3 mécanismes précis.",
      },
      {
        type: "h2",
        text: "Mécanisme 1 : La curiosité avec ancrage",
      },
      {
        type: "p",
        text: "Un titre qui génère de la curiosité pure (\"Le secret de YouTube...\") ne convertit pas. Un titre avec curiosité + ancrage convertit. L'ancrage donne un contexte qui rend la curiosité crédible.",
      },
      {
        type: "p",
        text: "\"J'ai analysé 500 vidéos YouTube virales. Voici le seul point commun\" = curiosité (quel point commun ?) + ancrage (500 vidéos, analyse concrète). \"Le secret pour grossir sur YouTube\" = curiosité vague sans ancrage = faible CTR.",
      },
      {
        type: "h2",
        text: "Mécanisme 2 : L'émotion avant l'information",
      },
      {
        type: "p",
        text: "Les thumbnails qui montrent une émotion humaine claire surpassent ceux qui montrent de l'information visuelle. Une photo avec une expression de surprise ou de choc devant un graphique convertit mieux qu'un graphique seul avec un titre dessus.",
      },
      {
        type: "callout",
        text: "Règle pratique : si ta thumbnail peut fonctionner sans visage, teste-la avec un visage et une émotion claire. Dans la plupart des niches, ça améliore le CTR de 15 à 40%.",
      },
      {
        type: "h2",
        text: "Mécanisme 3 : La cohérence titre-thumbnail",
      },
      {
        type: "p",
        text: "L'erreur la plus courante : titre et thumbnail qui racontent deux histoires différentes. La thumbnail devrait amplifier l'émotion du titre, pas le répéter visuellement.",
      },
      {
        type: "p",
        text: "Titre : \"J'ai failli perdre ma chaîne à cause de ça\" — Thumbnail : toi avec une expression de stress, avec un élément visuel qui suggère le danger. Les deux ensemble créent une proposition cohérente qui force le clic.",
      },
      {
        type: "h2",
        text: "Les 5 formats de titres à fort CTR en 2026",
      },
      {
        type: "ul",
        items: [
          "Le chiffre précis + résultat : \"J'ai généré 47 000€ avec 1 seule vidéo YouTube — voici comment\"",
          "L'erreur commune + conséquence : \"Cette erreur tue silencieusement 90% des chaînes YouTube\"",
          "La confession + révélation : \"J'ai menti sur mes résultats YouTube pendant 2 ans\"",
          "Le test + verdict : \"J'ai testé la méthode Shorts pendant 90 jours — résultat honnête\"",
          "La question rhétorique + enjeu : \"Pourquoi ta chaîne ne décolle pas (et c'est de ma faute)\"",
        ],
      },
      {
        type: "h2",
        text: "Les erreurs thumbnail qui plombent le CTR",
      },
      {
        type: "ul",
        items: [
          "Trop de texte : plus de 5 mots visibles = confusion",
          "Couleurs trop proches du fond YouTube : évite le blanc pur et le gris moyen",
          "Expression neutre ou sourire générique sans émotion",
          "Trop d'éléments : 1 sujet principal, 1 émotion, 1 couleur dominante",
        ],
      },
      {
        type: "h2",
        text: "Comment tester sans attendre",
      },
      {
        type: "p",
        text: "YouTube propose des A/B tests de thumbnails dans YouTube Studio. Si tu n'y as pas accès, utilise la méthode manuelle : change la thumbnail à 24h, 48h et 7 jours et compare le CTR dans l'analytics.",
      },
      {
        type: "p",
        text: "Un CTR au-dessus de 5% avec plus de 10 000 impressions est le signal qu'une vidéo peut être boostée. En dessous de 2% après 5 000 impressions, change la thumbnail ou le titre — mais pas les deux en même temps, sinon tu ne sais pas lequel a eu l'effet.",
      },
    ],
  },
  {
    slug: "10k-abonnes-6-mois",
    title: "De 0 à 10 000 abonnés en 6 mois : ce qui marche vraiment",
    excerpt:
      "Pas de miracle, pas de hack. Une stratégie en 3 phases avec les métriques qui prédisent si tu vas atteindre ton objectif dès le mois 2.",
    date: "29 jan. 2026",
    read: "12 min",
    content: [
      {
        type: "p",
        text: "De 0 à 10 000 abonnés en 6 mois est possible. Ce n'est pas garanti, et ce n'est pas réservé aux créateurs qui ont déjà une audience ailleurs. Mais ça demande une stratégie précise, pas \"poster régulièrement et rester cohérent\" — le conseil le plus inutile de l'internet créateur.",
      },
      {
        type: "h2",
        text: "Phase 1 (Mois 1-2) : L'architecture de la chaîne",
      },
      {
        type: "p",
        text: "La première erreur est de publier sans stratégie. Avant de poster, définis ta promesse de chaîne (que va retirer le spectateur type en s'abonnant ?), ton format signature (durée, style, rythme qui te différencie), et tes 3 piliers de contenu (3 types de vidéos que tu alternes).",
      },
      {
        type: "p",
        text: "Le format signature est plus important que la niche pour la fidélisation. Les gens s'abonnent à une expérience prévisible, pas à une liste de sujets. Si chaque vidéo ressemble à la précédente dans sa structure mais couvre des sujets différents, l'audience sait ce qu'elle obtient en s'abonnant.",
      },
      {
        type: "h2",
        text: "Phase 2 (Mois 2-4) : La stratégie d'acquisition",
      },
      {
        type: "p",
        text: "À 0 abonnés, YouTube ne poussera pas ta chaîne — tu n'as pas d'historique de performance. Tu dois générer du trafic externe.",
      },
      {
        type: "h3",
        text: "Les 3 canaux qui fonctionnent",
      },
      {
        type: "ul",
        items: [
          "Forums et communautés (Reddit, Discord) : réponds à des questions réelles, mentionne ta vidéo si directement pertinente — jamais de promotion pure",
          "Collaborations : même à 0 abonnés, propose des collaborations à des chaînes de 500 à 5 000 abonnés avec quelque chose de concret à offrir",
          "Distribution sociale : publie un clip de 60 secondes de chaque vidéo sur LinkedIn ou Twitter — donne de la valeur dans le clip lui-même, ne fais pas juste la promotion",
        ],
      },
      {
        type: "h2",
        text: "Phase 3 (Mois 4-6) : L'effet compoundé",
      },
      {
        type: "p",
        text: "Si les phases 1 et 2 sont correctes, à partir du 4e mois quelque chose change. YouTube a suffisamment de données sur ta chaîne pour commencer à la recommander. Les vidéos que tu as publiées les 3 premiers mois deviennent de l'actif qui continue à générer des vues.",
      },
      {
        type: "p",
        text: "C'est pourquoi la régularité des premières semaines est critique : chaque vidéo publiée devient un actif permanent dans le moteur de recherche YouTube. Une vidéo sur un sujet evergreen peut continuer à générer 50 à 500 vues par mois pendant des années.",
      },
      {
        type: "h2",
        text: "Les métriques qui prédisent ton succès dès le mois 2",
      },
      {
        type: "p",
        text: "À la fin du mois 2, regarde ces 3 signaux. Si tu es en dessous, le problème est de structure — hook, titre ou format. Si tu es au-dessus, tu es sur la bonne trajectoire.",
      },
      {
        type: "ul",
        items: [
          "CTR > 3% (pas encore 5%, mais au-dessus de 3%)",
          "Rétention moyenne > 40% sur toutes les vidéos publiées",
          "Abonnés/vues > 0.5% (pour 200 vues, au moins 1 abonné)",
        ],
      },
      {
        type: "h2",
        text: "Ce qui ne marche pas",
      },
      {
        type: "ul",
        items: [
          "Poster tous les jours : épuisant, réduit la qualité, YouTube ne récompense pas la fréquence brute",
          "Acheter des abonnés : détruit le ratio vues/abonnés, signal négatif pour l'algorithme",
          "Copier le format d'une grande chaîne : leur format est optimisé pour leur audience, pas pour la tienne",
          "Changer de niche après 4 semaines sans résultat : 4 semaines sont insuffisantes pour évaluer quoi que ce soit",
        ],
      },
      {
        type: "callout",
        text: "Le chemin de 0 à 10 000 est répétable. Ce qui le rend difficile n'est pas la stratégie — c'est l'exécution constante sur 6 mois quand les résultats semblent lents. La plupart des créateurs abandonnent au mois 3, exactement avant que l'effet compoundé se déclenche.",
      },
    ],
  },
  {
    slug: "scripting-retention-70",
    title: "Scripting pour la rétention : comment maintenir 70% d'audience jusqu'à la fin",
    excerpt:
      "La médiane YouTube est à 38-45% de rétention. Atteindre 70% change radicalement comment l'algorithme traite ta vidéo — et ça se joue au scripting, pas au montage.",
    date: "5 fév. 2026",
    read: "10 min",
    content: [
      {
        type: "p",
        text: "70% de rétention moyenne sur une vidéo de 10 minutes est un objectif ambitieux mais atteignable. La médiane sur YouTube est autour de 38-45%. Atteindre 70% change radicalement la façon dont l'algorithme traite ta vidéo.",
      },
      {
        type: "p",
        text: "La rétention ne se joue pas au montage. Elle se joue au scripting — avant de tourner. Voici les techniques de structure narrative qui maintiennent l'attention sur toute la durée d'une vidéo.",
      },
      {
        type: "h2",
        text: "Principe de base : la promesse incrémentale",
      },
      {
        type: "p",
        text: "Chaque minute de ta vidéo doit créer une micro-promesse que tu tiens dans la minute suivante. C'est la structure narrative par excellence : tu crées constamment de petites boucles ouvertes. \"Dans 2 minutes, je vais te montrer le graphique qui a tout changé pour moi\" dit à 2 minutes du graphique. Le spectateur reste pour voir ce graphique.",
      },
      {
        type: "h2",
        text: "Technique 1 : Le sommaire avec enjeu",
      },
      {
        type: "p",
        text: "Dans les premières 30 secondes, annonce non pas CE que tu vas couvrir mais POURQUOI c'est important. \"Je vais te montrer 5 erreurs\" est un sommaire. \"Dans 8 minutes, tu vas comprendre pourquoi 4 des 5 vidéos que tu as publiées ce mois ont moins de 500 vues — et comment ça se corrige\" est un sommaire avec enjeu.",
      },
      {
        type: "p",
        text: "La différence : le spectateur comprend ce qu'il perd s'il ne regarde pas jusqu'au bout. Ce n'est plus une question de curiosité — c'est une question d'intérêt direct.",
      },
      {
        type: "h2",
        text: "Technique 2 : Les re-hooks",
      },
      {
        type: "p",
        text: "À chaque changement de section dans ta vidéo (environ toutes les 2-3 minutes), ajoute un re-hook — une phrase qui justifie de continuer à regarder.",
      },
      {
        type: "ul",
        items: [
          "\"Mais ce n'est pas encore la partie la plus importante — ça vient dans la prochaine section\"",
          "\"L'erreur numéro 4 est celle que personne ne mentionne — je l'ai gardée pour la fin parce qu'elle va te surprendre\"",
          "\"Maintenant qu'on a vu le problème, je vais te montrer exactement comment je l'ai corrigé\"",
        ],
      },
      {
        type: "callout",
        text: "Ces re-hooks ne sont pas du teasing — ils doivent toujours tenir leur promesse. Si tu dis \"la partie la plus importante vient\", ce qui suit doit réellement l'être.",
      },
      {
        type: "h2",
        text: "Technique 3 : La structure en entonnoir inversé",
      },
      {
        type: "p",
        text: "La structure classique : introduction → développement → conclusion. Le problème : le meilleur contenu est souvent enterré au milieu. La structure en entonnoir inversé : donne le meilleur insight dès le début, puis démontre et justifie.",
      },
      {
        type: "p",
        text: "\"Le seul pattern que toutes les vidéos virales ont en commun est [résultat]. Voici pourquoi — et comment l'appliquer.\" Cette structure combat la courbe de rétention naturelle qui descend progressivement.",
      },
      {
        type: "h2",
        text: "Technique 4 : La preuve progressive",
      },
      {
        type: "p",
        text: "Ne présente pas toutes tes preuves d'un coup. Distribue-les tout au long de la vidéo. \"C'est ce que j'ai vu sur ma chaîne — je te montre les chiffres dans 2 minutes\" crée une promesse de preuve. La promesse maintient l'attention en suspension.",
      },
      {
        type: "h2",
        text: "Technique 5 : La conclusion qui ouvre",
      },
      {
        type: "p",
        text: "La conclusion classique (\"Voilà, c'est tout ce que j'avais à partager\") ferme la boucle complètement — le spectateur peut partir. Une conclusion qui ouvre sur la vidéo suivante retient l'audience sur ta chaîne.",
      },
      {
        type: "p",
        text: "\"On a couvert les 5 erreurs de structure. Mais ces erreurs ont une cause racine commune — et si tu ne comprends pas cette cause, tu vas reproduire les mêmes erreurs. J'en parle dans cette vidéo.\" Tu diriges, tu ne demandes pas.",
      },
      {
        type: "h2",
        text: "Les métriques à surveiller",
      },
      {
        type: "p",
        text: "Regarde ta courbe de rétention par section, pas la moyenne globale. Les pics de baisse brusque indiquent un problème de transition. Les trois moments où l'audience chute le plus : secondes 30-60 (hook non convaincant), changement de section entre la 2e et 3e minute, et dans les 30 dernières secondes.",
      },
    ],
  },
  {
    slug: "monetiser-sous-1000-abonnes",
    title: "Monétiser avant 1 000 abonnés : les méthodes qui fonctionnent en 2026",
    excerpt:
      "Attendre 1 000 abonnés pour commencer à gagner de l'argent avec YouTube est une erreur de stratégie. 4 modèles fonctionnent dès les premières centaines de vues.",
    date: "12 fév. 2026",
    read: "9 min",
    content: [
      {
        type: "p",
        text: "La monétisation YouTube directe (publicité) demande 1 000 abonnés et 4 000 heures de visionnage. Mais attendre ce seuil avant de gagner de l'argent avec YouTube est une erreur de stratégie. Voici 4 modèles de monétisation qui fonctionnent dès 0 abonnés — à condition d'avoir une audience engagée, même petite.",
      },
      {
        type: "h2",
        text: "Modèle 1 : Le service direct (0-500 abonnés)",
      },
      {
        type: "p",
        text: "Si tu crées du contenu dans un domaine d'expertise — marketing, développement, design, finance, rédaction — tes vidéos sont une démonstration de compétence. Un créateur avec 200 abonnés qui publie des vidéos de qualité sur le marketing B2B peut décrocher des clients freelance mieux payés qu'un profil LinkedIn sans contenu.",
      },
      {
        type: "p",
        text: "La stratégie : utilise chaque vidéo comme étude de cas ou démonstration d'expertise. Ajoute dans la description \"Tu cherches quelqu'un pour [service] ? Contact : [email].\" La conversion est faible en volume mais le ticket moyen est élevé.",
      },
      {
        type: "h2",
        text: "Modèle 2 : La newsletter payante (à partir de 300 abonnés)",
      },
      {
        type: "p",
        text: "Si tu génères 100 vues par vidéo avec une audience engagée, tu peux convertir 2 à 5% de tes spectateurs vers une newsletter payante. 300 abonnés × 2% = 6 abonnés à 10€/mois = 60€/mois récurrent. Ce n'est pas encore un revenu principal, mais c'est un indicateur précoce que ton audience est prête à payer.",
      },
      {
        type: "h2",
        text: "Modèle 3 : Les partenariats avec des marques (100-1 000 abonnés)",
      },
      {
        type: "p",
        text: "Contre-intuitivement, les petites chaînes très engagées attirent des marques de niche mieux que les grandes chaînes généralistes. Un créateur avec 500 abonnés dans la niche \"logiciels SaaS pour indépendants\" a une audience plus précieuse pour un éditeur de logiciel que 50 000 abonnés généralistes.",
      },
      {
        type: "ul",
        items: [
          "Identifie 10 marques dont tu utilises déjà les produits dans ta niche",
          "Calcule ton taux d'engagement (likes + commentaires ÷ vues) — il doit être > 5%",
          "Propose un partenariat de test (vidéo gratuite contre accès produit) pour construire ton portfolio",
          "Premier partenariat payant : souvent 50€ à 300€ par vidéo sur une petite chaîne",
        ],
      },
      {
        type: "h2",
        text: "Modèle 4 : Le produit numérique (à partir de 500 abonnés)",
      },
      {
        type: "p",
        text: "Un produit numérique (guide PDF, template, mini-formation) peut être vendu pour 15€ à 97€ à une audience de quelques centaines d'abonnés engagés. Marge à 100%, pas de dépendance à YouTube, et le produit continue à se vendre après la création.",
      },
      {
        type: "ul",
        items: [
          "Templates ou outils directement utilisables (Notion, Airtable, calculateurs)",
          "Guides PDF d'application pratique — des étapes concrètes, pas de la théorie",
          "Accès à une communauté Discord ou un groupe de travail avec toi",
        ],
      },
      {
        type: "h2",
        text: "Ce qui ne fonctionne pas avant 1 000 abonnés",
      },
      {
        type: "ul",
        items: [
          "Les formations complètes à prix élevé : manque de confiance et de preuve sociale",
          "Le coaching à plein tarif sans audience établie : trop difficile à remplir",
          "L'affiliation sur des produits génériques : taux de conversion trop bas à faible volume",
        ],
      },
      {
        type: "callout",
        text: "La règle pour monétiser avant 1 000 abonnés : vends quelque chose de spécifique à une audience de niche, pas quelque chose de général à tout le monde. La spécificité compense le volume.",
      },
    ],
  },
  {
    slug: "shorts-vs-longues-2026",
    title: "Shorts vs longues vidéos en 2026 : quelle stratégie choisir ?",
    excerpt:
      "Les Shorts construisent des abonnés. Les longues vidéos construisent un business. Comprendre cette différence change tout à ta stratégie de contenu.",
    date: "19 fév. 2026",
    read: "8 min",
    content: [
      {
        type: "p",
        text: "La question \"Shorts ou longues vidéos ?\" est mal posée. La vraie question est \"quel objectif est-ce que je poursuis ?\" Les Shorts et les longues vidéos ne font pas la même chose, ne touchent pas la même audience, et ne construisent pas la même chaîne.",
      },
      {
        type: "h2",
        text: "Ce que les Shorts font réellement",
      },
      {
        type: "p",
        text: "Les Shorts génèrent des impressions et des abonnés rapidement. Un Short qui performe peut apporter 5 000 à 50 000 abonnés en une semaine. Ce résultat impressionne. Ce qu'il cache est plus important.",
      },
      {
        type: "p",
        text: "Les abonnés provenant des Shorts ont un comportement différent : taux d'engagement sur les longues vidéos 3 à 5 fois inférieur, taux de conversion vers un produit quasi-nul, taux de rétention très bas. En d'autres termes, les Shorts construisent une chaîne avec beaucoup d'abonnés qui ne regardent que des Shorts.",
      },
      {
        type: "callout",
        text: "Si ton business model repose sur les longues vidéos (publicité, produits, formations), une croissance rapide par Shorts peut être contre-productive. Beaucoup d'abonnés, mais un ratio vues/abonnés qui s'effondre.",
      },
      {
        type: "h2",
        text: "Ce que les longues vidéos construisent",
      },
      {
        type: "p",
        text: "Les longues vidéos construisent une audience plus petite mais plus engagée. Un spectateur qui regarde une vidéo de 15 minutes jusqu'au bout a une relation différente avec le créateur qu'un spectateur qui swipe des Shorts pendant 2 minutes.",
      },
      {
        type: "p",
        text: "Cette différence se traduit en euros : le CPM sur les longues vidéos est 4 à 8 fois supérieur aux Shorts. Les spectateurs de longues vidéos convertissent 10 à 15 fois plus sur des produits et formations.",
      },
      {
        type: "h2",
        text: "La stratégie hybride recommandée pour 2026",
      },
      {
        type: "p",
        text: "La stratégie qui génère le meilleur ratio résultat/effort en 2026 est hybride, mais avec une asymétrie claire :",
      },
      {
        type: "ul",
        items: [
          "Longues vidéos : 1 par semaine — contenu principal, profondeur, monétisation",
          "Shorts : 2 à 3 par semaine — extraits ou reformulations de tes longues vidéos",
        ],
      },
      {
        type: "p",
        text: "La clé de la stratégie hybride : les Shorts doivent pointer vers les longues vidéos. Pas avec un CTA forcé, mais en créant de la frustration positive — donner suffisamment pour créer l'envie d'en voir plus. \"Voici la version 60 secondes. La version complète avec les exemples réels et les chiffres est ici.\"",
      },
      {
        type: "h2",
        text: "Les niches où les Shorts dominent",
      },
      {
        type: "p",
        text: "Certaines niches ont une dynamique différente où les Shorts constituent la majeure partie de la valeur créée : tutoriels ultra-courts (tech, code), contenu inspirationnel, tendances et actualités. Dans ces niches, la stratégie inverse s'applique : Shorts en principal, longues vidéos ponctuelles pour approfondir.",
      },
      {
        type: "h2",
        text: "Comment choisir",
      },
      {
        type: "p",
        text: "Réponds à ces 3 questions : Mon modèle de monétisation repose-t-il sur la durée d'attention (publicité, formations) ou sur le volume ? Mon contenu est-il mieux transmis en profondeur ou en densité ? Dans ma niche, les grandes chaînes font-elles principalement des Shorts ou des longues vidéos ?",
      },
      {
        type: "p",
        text: "Si tu réponds \"attention / profondeur / longues\" : mise principalement sur les longues vidéos. La stratégie mixte convient à la majorité des niches business, entrepreneuriat et éducation. Elle maximise la portée sans sacrifier l'engagement et la monétisation.",
      },
    ],
  },
]

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug)
}

export function getAllArticles(): Article[] {
  return articles
}
