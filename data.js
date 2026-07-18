/* ============================================================
   P.Scalium ggg — data.js
   Toutes les données de contenu de l'application :
   dictionnaire, auteurs, questions de quiz, objets de la
   boutique, paires du jeu de mémoire, roue de la fortune.
   ============================================================ */

// ---------------------------------------------------------------
// DICTIONNAIRE — histoire / science / philosophie
// ---------------------------------------------------------------
const DICTIONNAIRE = [
  // Histoire
  { terme: "Renaissance", categorie: "histoire", definition: "Mouvement culturel et artistique né en Italie au XVe siècle, marqué par le retour aux modèles antiques et l'essor des sciences et des arts." },
  { terme: "Antiquité", categorie: "histoire", definition: "Période qui s'étend des premières civilisations écrites jusqu'à la chute de l'Empire romain d'Occident, vers 476 après J.-C." },
  { terme: "Féodalité", categorie: "histoire", definition: "Système d'organisation sociale et politique du Moyen Âge fondé sur des liens personnels entre seigneurs et vassaux, échangeant protection contre fidélité." },
  { terme: "Révolution industrielle", categorie: "histoire", definition: "Transformation économique et sociale débutée en Angleterre au XVIIIe siècle, marquée par la mécanisation et l'essor de l'industrie." },
  { terme: "Empire romain", categorie: "histoire", definition: "Vaste État antique centré sur Rome, qui domina le bassin méditerranéen pendant plusieurs siècles avant sa scission en deux parties." },
  { terme: "Hiéroglyphes", categorie: "histoire", definition: "Système d'écriture de l'Égypte antique combinant signes figuratifs et symboliques, gravés sur les monuments et les papyrus." },
  { terme: "Les Lumières", categorie: "histoire", definition: "Mouvement intellectuel du XVIIIe siècle prônant la raison, la science et la remise en question de l'autorité traditionnelle." },
  { terme: "Colonisation", categorie: "histoire", definition: "Processus par lequel une puissance étend sa domination politique, économique et culturelle sur des territoires extérieurs." },
  { terme: "Guerre froide", categorie: "histoire", definition: "Période de tensions géopolitiques entre les États-Unis et l'URSS après 1945, sans affrontement militaire direct entre les deux blocs." },
  { terme: "Traité", categorie: "histoire", definition: "Accord formel conclu entre deux ou plusieurs États, souvent pour mettre fin à un conflit ou fixer des règles communes." },
  { terme: "Dynastie", categorie: "histoire", definition: "Succession de souverains issus d'une même famille se transmettant le pouvoir de génération en génération." },
  { terme: "Manuscrit", categorie: "histoire", definition: "Document écrit à la main, souvent ancien, qui constitue une source précieuse pour l'étude du passé." },

  // Science
  { terme: "Photosynthèse", categorie: "science", definition: "Processus par lequel les plantes transforment la lumière du soleil, l'eau et le dioxyde de carbone en énergie chimique et en oxygène." },
  { terme: "Gravitation", categorie: "science", definition: "Force d'attraction mutuelle entre deux masses, responsable notamment de la chute des corps et des orbites des planètes." },
  { terme: "ADN", categorie: "science", definition: "Molécule présente dans les cellules qui porte l'information génétique nécessaire au développement et au fonctionnement des organismes." },
  { terme: "Atome", categorie: "science", definition: "Plus petite unité de matière conservant les propriétés chimiques d'un élément, composée d'un noyau et d'électrons." },
  { terme: "Théorie de la relativité", categorie: "science", definition: "Ensemble de théories formulées par Albert Einstein décrivant les liens entre espace, temps, matière et gravitation." },
  { terme: "Évolution", categorie: "science", definition: "Processus par lequel les espèces vivantes se transforment au fil des générations sous l'effet de la sélection naturelle." },
  { terme: "Big Bang", categorie: "science", definition: "Modèle scientifique décrivant l'expansion de l'univers depuis un état extrêmement dense et chaud, il y a environ 13,8 milliards d'années." },
  { terme: "Cellule", categorie: "science", definition: "Unité de base structurelle et fonctionnelle de tout être vivant, capable de se reproduire de manière autonome." },
  { terme: "Électromagnétisme", categorie: "science", definition: "Branche de la physique qui étudie les interactions entre les phénomènes électriques et magnétiques." },
  { terme: "Vaccin", categorie: "science", definition: "Préparation qui stimule le système immunitaire pour protéger l'organisme contre une maladie infectieuse spécifique." },
  { terme: "Tectonique des plaques", categorie: "science", definition: "Théorie géologique expliquant les mouvements des grandes plaques rigides qui composent la croûte terrestre." },
  { terme: "Thermodynamique", categorie: "science", definition: "Branche de la physique qui étudie les échanges d'énergie, notamment sous forme de chaleur et de travail." },

  // Philosophie
  { terme: "Métaphysique", categorie: "philosophie", definition: "Branche de la philosophie qui interroge la nature ultime de la réalité, de l'être et de l'existence." },
  { terme: "Épistémologie", categorie: "philosophie", definition: "Étude philosophique des fondements, de la validité et des limites de la connaissance scientifique." },
  { terme: "Éthique", categorie: "philosophie", definition: "Branche de la philosophie qui examine les valeurs, le bien et le mal, et les principes guidant l'action humaine." },
  { terme: "Existentialisme", categorie: "philosophie", definition: "Courant philosophique du XXe siècle centré sur la liberté, l'angoisse et la responsabilité de l'existence humaine." },
  { terme: "Stoïcisme", categorie: "philosophie", definition: "École philosophique antique prônant la maîtrise de soi et l'acceptation sereine de ce qui ne dépend pas de nous." },
  { terme: "Dialectique", categorie: "philosophie", definition: "Méthode de raisonnement fondée sur la confrontation d'idées opposées en vue d'atteindre une vérité plus complète." },
  { terme: "Utilitarisme", categorie: "philosophie", definition: "Doctrine morale selon laquelle une action est bonne si elle maximise le bien-être du plus grand nombre." },
  { terme: "Rationalisme", categorie: "philosophie", definition: "Courant philosophique affirmant que la raison est la source principale et le critère de la connaissance." },
  { terme: "Empirisme", categorie: "philosophie", definition: "Doctrine selon laquelle toute connaissance provient essentiellement de l'expérience sensible." },
  { terme: "Libre arbitre", categorie: "philosophie", definition: "Capacité supposée d'un individu à choisir et à agir librement, indépendamment de toute détermination extérieure." },
  { terme: "Nihilisme", categorie: "philosophie", definition: "Position philosophique qui nie l'existence de valeurs, de sens ou de vérités absolues." },
  { terme: "Phénoménologie", categorie: "philosophie", definition: "Courant philosophique qui étudie les structures de la conscience et la manière dont les choses apparaissent à l'esprit." },
];

// ---------------------------------------------------------------
// AUTEURS CÉLÈBRES — biographies courtes
// ---------------------------------------------------------------
const AUTEURS = [
  { nom: "Aristote", periode: "384 – 322 av. J.-C.", domaine: "Philosophie", icone: "🏛️",
    bio: "Philosophe grec, élève de Platon et précepteur d'Alexandre le Grand. Il a posé les bases de la logique, de la biologie et de la métaphysique occidentales." },
  { nom: "Platon", periode: "428 – 348 av. J.-C.", domaine: "Philosophie", icone: "📜",
    bio: "Philosophe grec fondateur de l'Académie d'Athènes, connu pour sa théorie des Idées et ses dialogues mettant en scène Socrate." },
  { nom: "Hypatie d'Alexandrie", periode: "vers 360 – 415", domaine: "Science", icone: "🔭",
    bio: "Mathématicienne, astronome et philosophe d'Alexandrie, elle enseigna et commenta des textes scientifiques majeurs de l'Antiquité." },
  { nom: "Ibn Khaldoun", periode: "1332 – 1406", domaine: "Histoire", icone: "🕌",
    bio: "Historien et penseur né à Tunis, considéré comme un précurseur de la sociologie grâce à son étude des cycles des civilisations." },
  { nom: "Galilée", periode: "1564 – 1642", domaine: "Science", icone: "🔭",
    bio: "Astronome et physicien italien, il perfectionna la lunette astronomique et défendit le modèle héliocentrique de l'univers." },
  { nom: "René Descartes", periode: "1596 – 1650", domaine: "Philosophie", icone: "✒️",
    bio: "Philosophe et mathématicien français, auteur du « Discours de la méthode » et de la formule célèbre « je pense, donc je suis »." },
  { nom: "Isaac Newton", periode: "1643 – 1727", domaine: "Science", icone: "🍎",
    bio: "Physicien et mathématicien anglais, il formula les lois du mouvement et la loi de la gravitation universelle." },
  { nom: "Voltaire", periode: "1694 – 1778", domaine: "Philosophie", icone: "🖋️",
    bio: "Écrivain et philosophe français des Lumières, défenseur de la tolérance et de la liberté d'expression à travers de nombreux essais et contes." },
  { nom: "Charles Darwin", periode: "1809 – 1882", domaine: "Science", icone: "🐢",
    bio: "Naturaliste britannique, auteur de « L'Origine des espèces », qui posa les bases scientifiques de la théorie de l'évolution." },
  { nom: "Victor Hugo", periode: "1802 – 1885", domaine: "Littérature", icone: "📖",
    bio: "Écrivain et poète français majeur du romantisme, auteur des « Misérables » et de « Notre-Dame de Paris »." },
  { nom: "Marie Curie", periode: "1867 – 1934", domaine: "Science", icone: "⚗️",
    bio: "Physicienne et chimiste polonaise naturalisée française, pionnière de la radioactivité, double lauréate du prix Nobel." },
  { nom: "Friedrich Nietzsche", periode: "1844 – 1900", domaine: "Philosophie", icone: "🌄",
    bio: "Philosophe allemand connu pour sa critique de la morale traditionnelle et ses concepts de volonté de puissance et d'éternel retour." },
  { nom: "Albert Einstein", periode: "1879 – 1955", domaine: "Science", icone: "🧠",
    bio: "Physicien théoricien allemand, auteur de la théorie de la relativité, dont les travaux ont transformé la physique moderne." },
  { nom: "Simone de Beauvoir", periode: "1908 – 1986", domaine: "Philosophie", icone: "🕊️",
    bio: "Philosophe et écrivaine française, autrice du « Deuxième Sexe », figure majeure de l'existentialisme et du féminisme." },
  { nom: "Confucius", periode: "551 – 479 av. J.-C.", domaine: "Philosophie", icone: "🎋",
    bio: "Penseur chinois dont l'enseignement moral et politique, fondé sur le respect et l'harmonie sociale, a profondément marqué l'Asie de l'Est." },
];

// ---------------------------------------------------------------
// QUESTIONS DE QUIZ — histoire / science / philosophie
// ---------------------------------------------------------------
const QUIZ = [
  { categorie: "histoire", question: "En quel siècle débute la Renaissance en Italie ?", choix: ["Le XIIe siècle", "Le XVe siècle", "Le XVIIIe siècle", "Le XXe siècle"], bonne: 1 },
  { categorie: "histoire", question: "Quel empire dominait le bassin méditerranéen dans l'Antiquité ?", choix: ["L'Empire romain", "L'Empire ottoman", "L'Empire russe", "L'Empire inca"], bonne: 0 },
  { categorie: "histoire", question: "La Révolution industrielle a débuté principalement dans quel pays ?", choix: ["La France", "L'Angleterre", "L'Allemagne", "Le Japon"], bonne: 1 },
  { categorie: "histoire", question: "Qu'est-ce que la féodalité ?", choix: ["Un système bancaire moderne", "Un lien seigneur-vassal médiéval", "Une religion antique", "Un traité de paix"], bonne: 1 },
  { categorie: "histoire", question: "La Guerre froide opposait principalement quels deux blocs ?", choix: ["France et Angleterre", "Chine et Japon", "États-Unis et URSS", "Rome et Carthage"], bonne: 2 },
  { categorie: "histoire", question: "Les hiéroglyphes sont un système d'écriture de quelle civilisation ?", choix: ["La Grèce antique", "L'Égypte antique", "La Mésopotamie", "La Chine antique"], bonne: 1 },
  { categorie: "science", question: "Que produit la photosynthèse en plus de l'énergie chimique ?", choix: ["Du dioxyde de carbone", "De l'oxygène", "De l'azote", "Du méthane"], bonne: 1 },
  { categorie: "science", question: "Qui a formulé la loi de la gravitation universelle ?", choix: ["Albert Einstein", "Galilée", "Isaac Newton", "Charles Darwin"], bonne: 2 },
  { categorie: "science", question: "Que signifie l'acronyme ADN ?", choix: ["Acide DésoxyriboNucléique", "Analyse Numérique Détaillée", "Atome Distinct Naturel", "Aucune de ces réponses"], bonne: 0 },
  { categorie: "science", question: "Le Big Bang décrit surtout quoi ?", choix: ["La fin des dinosaures", "L'expansion de l'univers", "La formation des volcans", "La dérive des continents"], bonne: 1 },
  { categorie: "science", question: "Quelle est l'unité de base structurelle de tout être vivant ?", choix: ["L'atome", "La molécule", "La cellule", "Le tissu"], bonne: 2 },
  { categorie: "science", question: "Qui a proposé la théorie de l'évolution par sélection naturelle ?", choix: ["Charles Darwin", "Louis Pasteur", "Marie Curie", "Aristote"], bonne: 0 },
  { categorie: "philosophie", question: "Quelle branche de la philosophie étudie le bien et le mal ?", choix: ["L'épistémologie", "L'éthique", "La métaphysique", "La logique"], bonne: 1 },
  { categorie: "philosophie", question: "Qui a écrit « je pense, donc je suis » ?", choix: ["Platon", "René Descartes", "Nietzsche", "Voltaire"], bonne: 1 },
  { categorie: "philosophie", question: "L'existentialisme met surtout l'accent sur quoi ?", choix: ["La liberté et la responsabilité", "Les lois de la physique", "Les dynasties royales", "La chimie des atomes"], bonne: 0 },
  { categorie: "philosophie", question: "Le stoïcisme prône avant tout :", choix: ["La recherche du plaisir immédiat", "L'acceptation sereine de ce qu'on ne contrôle pas", "Le rejet total de la raison", "La domination par la force"], bonne: 1 },
  { categorie: "philosophie", question: "L'empirisme affirme que la connaissance vient principalement de :", choix: ["L'expérience sensible", "La révélation divine", "Les rêves", "Les mathématiques pures uniquement"], bonne: 0 },
  { categorie: "philosophie", question: "Qui est l'autrice du « Deuxième Sexe » ?", choix: ["Hypatie d'Alexandrie", "Simone de Beauvoir", "Marie Curie", "Hannah Arendt"], bonne: 1 },
];

// ---------------------------------------------------------------
// BOUTIQUE — objets historiques & collections à acheter avec des pièces
// ---------------------------------------------------------------
const BOUTIQUE = [
  { id: "astrolabe", nom: "Astrolabe ancien", icone: "🧭", rarete: "commun", prix: 60, desc: "Instrument utilisé par les astronomes et navigateurs pour mesurer la position des étoiles." },
  { id: "plume", nom: "Plume d'écrivain des Lumières", icone: "🖋️", rarete: "commun", prix: 70, desc: "Une plume comme celles utilisées par les grands essayistes du XVIIIe siècle." },
  { id: "fossile", nom: "Fossile de trilobite", icone: "🦴", rarete: "commun", prix: 90, desc: "Reste fossilisé d'un arthropode marin ayant vécu il y a plusieurs centaines de millions d'années." },
  { id: "boussole", nom: "Boussole du navigateur", icone: "🧭", rarete: "commun", prix: 80, desc: "Instrument de navigation indiquant le nord magnétique, essentiel aux grandes explorations." },
  { id: "sablier", nom: "Sablier du temps", icone: "⏳", rarete: "commun", prix: 50, desc: "Instrument de mesure du temps par écoulement de sable, symbole du calcul des jours." },
  { id: "masque", nom: "Masque de théâtre grec", icone: "🎭", rarete: "rare", prix: 220, desc: "Masque porté lors des représentations théâtrales de la Grèce antique." },
  { id: "globe", nom: "Globe céleste", icone: "🌌", rarete: "rare", prix: 260, desc: "Sphère représentant les constellations, utilisée par les astronomes pour cartographier le ciel." },
  { id: "manuscrit", nom: "Manuscrit alchimique", icone: "📜", rarete: "rare", prix: 240, desc: "Texte ancien mêlant chimie naissante et symbolisme, précurseur de la science moderne." },
  { id: "microscope", nom: "Microscope de laboratoire", icone: "🔬", rarete: "rare", prix: 300, desc: "Instrument ayant permis les grandes découvertes en biologie et en médecine." },
  { id: "tablette", nom: "Tablette cunéiforme", icone: "🪨", rarete: "rare", prix: 280, desc: "Tablette d'argile gravée en écriture cunéiforme, l'un des plus anciens systèmes d'écriture connus." },
  { id: "horloge", nom: "Horloge astronomique", icone: "🕰️", rarete: "legendaire", prix: 650, desc: "Mécanisme complexe indiquant à la fois l'heure et la position des astres, chef-d'œuvre d'horlogerie." },
  { id: "comete", nom: "Fragment de comète (réplique)", icone: "☄️", rarete: "legendaire", prix: 800, desc: "Réplique commémorative d'un passage célèbre de comète observé à travers l'histoire." },
  { id: "statuette", nom: "Statuette égyptienne", icone: "𓁷", rarete: "legendaire", prix: 700, desc: "Petite statuette représentant une divinité protectrice de l'Égypte antique." },
  { id: "parchemin", nom: "Parchemin d'une grande charte", icone: "🗞️", rarete: "legendaire", prix: 900, desc: "Fragment d'un texte fondateur ayant contribué à l'histoire des libertés et des institutions." },
];

// ---------------------------------------------------------------
// JEU DE MÉMOIRE — paires de symboles
// ---------------------------------------------------------------
const MEMO_SYMBOLES = ["🏛️", "🔭", "🖋️", "⚗️", "🌍", "📜", "⏳", "♟️", "🗿", "🎭", "🧭", "💡"];

// ---------------------------------------------------------------
// ROUE DE LA FORTUNE — segments de gains (en pièces)
// ---------------------------------------------------------------
const ROUE_SEGMENTS = [20, 50, 10, 100, 30, 5, 70, 200];
