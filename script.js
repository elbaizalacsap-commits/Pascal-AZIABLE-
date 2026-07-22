// ==================== FORMULE DE BASE ====================
function calculerJourSemaine(jour, mois, anneeComplete) {
  let estBiss = (anneeComplete % 4 == 0 && (anneeComplete % 100 != 0 || anneeComplete % 400 == 0));
  let siecle = Math.floor(anneeComplete / 100);
  let tableX = [2, 4, 6, 1];
  let x = tableX[siecle % 4];
  let an = anneeComplete % 100;
  let codesMois = [null, 1, 4, 4, 0, 2, 5, 0, 3, 6, 1, 4, 6];
  let codeMois = codesMois[mois];
  let resultat = jour + codeMois + Math.floor(an/4) + an - x;
  if (estBiss && (mois == 1 || mois == 2)) resultat -= 1;
  return ((resultat % 7) + 7) % 7;
}
const NOMS_JOURS = ["dimanche","lundi","mardi","mercredi","jeudi","vendredi","samedi"];
const NOMS_JOURS_COURTS = ["Dim","Lun","Mar","Mer","Jeu","Ven","Sam"];
const NOMS_MOIS = ["","janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"];
function estBissextileAnnee(a) { return (a % 4 == 0 && (a % 100 != 0 || a % 400 == 0)); }
function joursDansLeMois(m, a) {
  const jpm = [null,31,28,31,30,31,30,31,31,30,31,30,31];
  if (m == 2 && estBissextileAnnee(a)) return 29;
  return jpm[m];
}
function melanger(tableau) {
  const t = [...tableau];
  for (let i = t.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [t[i], t[j]] = [t[j], t[i]];
  }
  return t;
}

// ==================== MODE SOMBRE ====================
const modeBtn = document.getElementById("modeBtn");
function appliquerMode(sombre) {
  document.body.classList.toggle("dark", sombre);
  modeBtn.textContent = sombre ? "☀️" : "🌙";
  localStorage.setItem("modeScalium", sombre ? "sombre" : "clair");
}
appliquerMode(localStorage.getItem("modeScalium") === "sombre");
modeBtn.onclick = () => appliquerMode(!document.body.classList.contains("dark"));

// ==================== NAVIGATION PRINCIPALE ====================
document.querySelectorAll(".onglet").forEach(btn => {
  btn.onclick = function() {
    document.querySelectorAll(".onglet").forEach(b => b.classList.remove("actif"));
    document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
    btn.classList.add("actif");
    document.getElementById(btn.dataset.cible).classList.add("active");
    if (btn.dataset.cible === "sectionClassement") afficherClassement();
  };
});
function activerSousOnglets(conteneurId, attribut, callback) {
  document.querySelectorAll(`#${conteneurId} .sous-onglet`).forEach(btn => {
    btn.onclick = function() {
      document.querySelectorAll(`#${conteneurId} .sous-onglet`).forEach(b => b.classList.remove("actif"));
      btn.classList.add("actif");
      callback(btn.dataset[attribut]);
    };
  });
}

// ==================== PROFIL / PIECES / STATS ====================
let profilActuel = null;
function cleProfil(pseudo) { return "scalium_profil_" + pseudo.toLowerCase(); }
function nouveauProfil(pseudo) {
  return { pseudo, pieces: 0, piecesTotalGagnees: 0, collection: [], badges: [], bonnesReponses: 0, totalReponses: 0, meilleureSerie: 0, serieActuelle: 0 };
}
function chargerProfil(pseudo) {
  const brut = localStorage.getItem(cleProfil(pseudo));
  if (brut) {
    const p = JSON.parse(brut);
    return Object.assign(nouveauProfil(pseudo), p);
  }
  return nouveauProfil(pseudo);
}
function sauverProfil() {
  localStorage.setItem(cleProfil(profilActuel.pseudo), JSON.stringify(profilActuel));
  localStorage.setItem("scalium_dernier_pseudo", profilActuel.pseudo);
}
function afficherPointsFlottants(montant) {
  const el = document.createElement("div");
  el.className = "points-flottants";
  el.textContent = "+" + montant + " 🪙";
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1000);
}
function ajouterPieces(montant) {
  if (!profilActuel) return;
  profilActuel.pieces += montant;
  profilActuel.piecesTotalGagnees += montant;
  sauverProfil();
  document.getElementById("profilPieces").textContent = profilActuel.pieces;
  afficherPointsFlottants(montant);
  verifierBadges();
}
function enregistrerReponse(correcte) {
  if (!profilActuel) return;
  profilActuel.totalReponses++;
  if (correcte) {
    profilActuel.bonnesReponses++;
    profilActuel.serieActuelle++;
    if (profilActuel.serieActuelle > profilActuel.meilleureSerie) profilActuel.meilleureSerie = profilActuel.serieActuelle;
  } else {
    profilActuel.serieActuelle = 0;
  }
  sauverProfil();
  verifierBadges();
}
function afficherProfilConnecte() {
  document.getElementById("profilConnexion").style.display = "none";
  document.getElementById("profilInfos").style.display = "flex";
  document.getElementById("profilPseudo").textContent = "👤 " + profilActuel.pseudo;
  document.getElementById("profilPieces").textContent = profilActuel.pieces;
  rafraichirBoutique();
}
document.getElementById("connexionBtn").onclick = function() {
  const pseudo = document.getElementById("pseudoInput").value.trim();
  if (pseudo === "") return;
  profilActuel = chargerProfil(pseudo);
  sauverProfil();
  afficherProfilConnecte();
};
document.getElementById("deconnexionBtn").onclick = function() {
  profilActuel = null;
  document.getElementById("profilConnexion").style.display = "block";
  document.getElementById("profilInfos").style.display = "none";
  document.getElementById("pseudoInput").value = "";
};
(function chargerDernierProfil() {
  const dernier = localStorage.getItem("scalium_dernier_pseudo");
  if (dernier) { profilActuel = chargerProfil(dernier); afficherProfilConnecte(); }
})();

// ==================== BOUTON "AUJOURD'HUI" ====================
document.getElementById("aujourdhuiBtn").onclick = function() {
  const t = new Date();
  document.getElementById("jourInput").value = t.getDate();
  document.getElementById("moisInput").value = t.getMonth() + 1;
  document.getElementById("anneeInput").value = t.getFullYear();
};

// ==================== SIGNE / AGE ====================
function calculerSigne(jour, mois) {
  const v = mois * 100 + jour;
  if (v >= 1222 || v <= 119) return { nom: "Capricorne", symbole: "♑" };
  if (v <= 218) return { nom: "Verseau", symbole: "♒" };
  if (v <= 320) return { nom: "Poissons", symbole: "♓" };
  if (v <= 419) return { nom: "Bélier", symbole: "♈" };
  if (v <= 520) return { nom: "Taureau", symbole: "♉" };
  if (v <= 620) return { nom: "Gémeaux", symbole: "♊" };
  if (v <= 722) return { nom: "Cancer", symbole: "♋" };
  if (v <= 822) return { nom: "Lion", symbole: "♌" };
  if (v <= 922) return { nom: "Vierge", symbole: "♍" };
  if (v <= 1022) return { nom: "Balance", symbole: "♎" };
  if (v <= 1121) return { nom: "Scorpion", symbole: "♏" };
  return { nom: "Sagittaire", symbole: "♐" };
}
function calculerAge(jour, mois, annee) {
  const t = new Date();
  let age = t.getFullYear() - annee;
  if ((t.getMonth()+1) < mois || ((t.getMonth()+1) === mois && t.getDate() < jour)) age -= 1;
  return age;
}
const DATES_CLES = [
  { jour: 1, mois: 1, label: "Nouvel An" }, { jour: 27, mois: 4, label: "Indépendance du Togo" },
  { jour: 1, mois: 5, label: "Fête du Travail" }, { jour: 15, mois: 8, label: "Assomption" },
  { jour: 1, mois: 11, label: "Toussaint" }, { jour: 25, mois: 12, label: "Noël" }
];
function afficherDatesCles(annee) {
  document.getElementById("anneeDatesCles").textContent = annee;
  document.getElementById("listeDatesCles").innerHTML = DATES_CLES.map(d => {
    const idx = calculerJourSemaine(d.jour, d.mois, annee);
    return `<div class="date-cle"><span>${d.label} (${d.jour}/${d.mois})</span><span class="jour-nom">${NOMS_JOURS[idx]}</span></div>`;
  }).join("");
  document.getElementById("blocDatesCles").style.display = "block";
}
function afficherCalendrier(jour, mois, annee) {
  document.getElementById("calendrierEntetes").innerHTML = NOMS_JOURS_COURTS.map(j => `<span>${j}</span>`).join("");
  const premier = calculerJourSemaine(1, mois, annee);
  const total = joursDansLeMois(mois, annee);
  let html = "";
  for (let i=0;i<premier;i++) html += `<div class="jour-case vide"></div>`;
  for (let j=1;j<=total;j++) html += `<div class="jour-case ${j===jour?"actif":""}">${j}</div>`;
  document.getElementById("calendrierGrille").innerHTML = html;
  document.getElementById("blocCalendrier").style.display = "block";
}
let dernierTexteResultat = "";
document.getElementById("copierBtn").onclick = function() {
  navigator.clipboard.writeText(dernierTexteResultat).then(() => {
    const btn = document.getElementById("copierBtn"); const orig = btn.textContent;
    btn.textContent = "✅ Copié !"; setTimeout(() => btn.textContent = orig, 1500);
  });
};
if (navigator.share) {
  document.getElementById("partagerBtn").style.display = "inline-block";
  document.getElementById("partagerBtn").onclick = () => navigator.share({ text: dernierTexteResultat }).catch(()=>{});
}
document.getElementById("calculerBtn").onclick = function() {
  document.getElementById("extraZone").classList.remove("visible");
  ["carteAge","carteSigne","blocCalendrier","blocDatesCles"].forEach(id => document.getElementById(id).style.display = "none");
  document.getElementById("partageBoutons").style.display = "none";
  const resAffiche = document.getElementById("resultatAffiche");
  resAffiche.classList.remove("apparait");
  function erreur(msg) { resAffiche.textContent = msg; void resAffiche.offsetWidth; resAffiche.classList.add("apparait"); }
  if (document.getElementById("jourInput").value === "" || document.getElementById("moisInput").value === "" || document.getElementById("anneeInput").value === "") return erreur("Merci de remplir les 3 champs.");
  let jour = Number(document.getElementById("jourInput").value);
  let moisTape = Number(document.getElementById("moisInput").value);
  let anneeComplete = Number(document.getElementById("anneeInput").value);
  if (anneeComplete < 1) return erreur("Année invalide.");
  if (moisTape < 1 || moisTape > 12) return erreur("Mois invalide.");
  const maxJour = joursDansLeMois(moisTape, anneeComplete);
  if (jour < 1 || jour > maxJour) return erreur("Date invalide.");
  const jourSemaine = calculerJourSemaine(jour, moisTape, anneeComplete);
  const resultatFinal = NOMS_JOURS[jourSemaine];
  resAffiche.innerHTML = "Le jour correspondant est :<br><span class='jourColore'>" + resultatFinal + "</span>";
  void resAffiche.offsetWidth; resAffiche.classList.add("apparait");
  dernierTexteResultat = `Le ${jour} ${NOMS_MOIS[moisTape]} ${anneeComplete} était un ${resultatFinal}.`;
  document.getElementById("partageBoutons").style.display = "flex";
  const age = calculerAge(jour, moisTape, anneeComplete);
  if (age >= 0) { document.getElementById("ageTexte").textContent = age + " an" + (age>1?"s":""); document.getElementById("carteAge").style.display = "flex"; }
  const signe = calculerSigne(jour, moisTape);
  document.getElementById("signeSymbole").textContent = signe.symbole;
  document.getElementById("signeTexte").textContent = "Signe astrologique : " + signe.nom;
  document.getElementById("carteSigne").style.display = "flex";
  afficherCalendrier(jour, moisTape, anneeComplete);
  afficherDatesCles(anneeComplete);
  document.getElementById("extraZone").classList.add("visible");
};
document.getElementById("resetBtn").onclick = function() {
  document.getElementById("jourInput").value = ""; document.getElementById("moisInput").value = ""; document.getElementById("anneeInput").value = "";
  document.getElementById("resultatAffiche").textContent = ""; document.getElementById("resultatAffiche").classList.remove("apparait");
  document.getElementById("extraZone").classList.remove("visible"); document.getElementById("partageBoutons").style.display = "none";
};

// ==================== BANQUES DE QUESTIONS (10 JEUX) ====================
const BANQUE_HISTOIRE = [
  {q:"En quelle année a eu lieu l'indépendance du Togo ?", options:["1958","1960","1965","1975"], bonne:1, diff:"facile"},
  {q:"Qui a formulé la théorie de la relativité ?", options:["Newton","Einstein","Galilée","Darwin"], bonne:1, diff:"facile"},
  {q:"En quelle année a commencé la Première Guerre mondiale ?", options:["1910","1914","1918","1939"], bonne:1, diff:"facile"},
  {q:"Qui a peint la Joconde ?", options:["Michel-Ange","Léonard de Vinci","Picasso","Raphaël"], bonne:1, diff:"facile"},
  {q:"En quelle année a commencé la Révolution française ?", options:["1776","1789","1804","1815"], bonne:1, diff:"facile"},
  {q:"Quel empire a construit le Machu Picchu ?", options:["Aztèque","Maya","Inca","Romain"], bonne:2, diff:"moyen"},
  {q:"Quelle civilisation a inventé l'écriture cunéiforme ?", options:["Égyptienne","Sumérienne","Chinoise","Grecque"], bonne:1, diff:"moyen"},
  {q:"Qui était le premier président du Togo indépendant ?", options:["Gnassingbé Eyadéma","Sylvanus Olympio","Nicolas Grunitzky","Faure Gnassingbé"], bonne:1, diff:"moyen"},
  {q:"En quelle année est tombé le Mur de Berlin ?", options:["1985","1989","1991","1995"], bonne:1, diff:"moyen"},
  {q:"Quel traité a mis fin à la Première Guerre mondiale ?", options:["Traité de Rome","Traité de Versailles","Traité de Vienne","Traité de Paris"], bonne:1, diff:"moyen"},
  {q:"Qui a dirigé la conquête de l'Empire aztèque ?", options:["Christophe Colomb","Hernán Cortés","Francisco Pizarro","Vasco de Gama"], bonne:1, diff:"difficile"},
  {q:"En quelle année le Ghana (Gold Coast) a-t-il obtenu son indépendance ?", options:["1955","1957","1960","1963"], bonne:1, diff:"difficile"},
  {q:"Quelle dynastie a régné sur la Chine juste avant la République ?", options:["Ming","Tang","Qing","Song"], bonne:2, diff:"difficile"},
  {q:"Qui a été le premier empereur romain ?", options:["Jules César","Auguste","Néron","Trajan"], bonne:1, diff:"difficile"},
  {q:"En quelle année la Conférence de Berlin a-t-elle organisé le partage colonial de l'Afrique ?", options:["1875","1884","1895","1900"], bonne:1, diff:"difficile"}
];
const BANQUE_SCIENCE = [
  {q:"Quel gaz les plantes absorbent-elles pour la photosynthèse ?", options:["Oxygène","Azote","CO2","Hydrogène"], bonne:2, diff:"facile"},
  {q:"Quelle planète est surnommée la « planète rouge » ?", options:["Vénus","Jupiter","Mars","Saturne"], bonne:2, diff:"facile"},
  {q:"Combien d'os compte le corps humain adulte ?", options:["106","156","206","306"], bonne:2, diff:"facile"},
  {q:"Quel est l'organe qui pompe le sang dans le corps ?", options:["Le foie","Le cœur","Le rein","Le poumon"], bonne:1, diff:"facile"},
  {q:"Quel est l'état de l'eau à 0°C ?", options:["Liquide","Gazeux","Solide","Plasma"], bonne:2, diff:"facile"},
  {q:"Quel est l'élément chimique le plus abondant dans l'univers ?", options:["Oxygène","Carbone","Hydrogène","Hélium"], bonne:2, diff:"moyen"},
  {q:"Quelle est l'unité de mesure de la force ?", options:["Le watt","Le newton","Le joule","Le pascal"], bonne:1, diff:"moyen"},
  {q:"Quel scientifique a découvert la pénicilline ?", options:["Pasteur","Fleming","Curie","Darwin"], bonne:1, diff:"moyen"},
  {q:"Combien de chromosomes possède une cellule humaine normale ?", options:["23","46","44","48"], bonne:1, diff:"moyen"},
  {q:"Quelle est la vitesse de la lumière (arrondie) ?", options:["300 000 km/s","150 000 km/s","1 000 000 km/s","30 000 km/s"], bonne:0, diff:"moyen"},
  {q:"Quel est le symbole chimique de l'or ?", options:["Or","Au","Ag","Go"], bonne:1, diff:"difficile"},
  {q:"Quelle particule a une charge négative ?", options:["Proton","Neutron","Électron","Photon"], bonne:2, diff:"difficile"},
  {q:"Qui a formulé les lois du mouvement et de la gravitation universelle ?", options:["Einstein","Newton","Galilée","Kepler"], bonne:1, diff:"difficile"},
  {q:"Quel est le processus par lequel une cellule se divise en deux ?", options:["Méiose","Mitose","Osmose","Photosynthèse"], bonne:1, diff:"difficile"},
  {q:"Quelle couche de l'atmosphère contient la couche d'ozone ?", options:["Troposphère","Stratosphère","Mésosphère","Thermosphère"], bonne:1, diff:"difficile"}
];
const BANQUE_GEO = [
  {q:"Quelle est la capitale du Togo ?", options:["Kara","Sokodé","Lomé","Atakpamé"], bonne:2, diff:"facile"},
  {q:"Quel est le plus grand océan du monde ?", options:["Atlantique","Indien","Arctique","Pacifique"], bonne:3, diff:"facile"},
  {q:"Quel est le plus long fleuve du monde ?", options:["Amazone","Nil","Congo","Niger"], bonne:1, diff:"facile"},
  {q:"Quel pays a la plus grande population du monde ?", options:["Inde","Chine","États-Unis","Indonésie"], bonne:1, diff:"facile"},
  {q:"Quel est le plus grand désert chaud du monde ?", options:["Kalahari","Gobi","Sahara","Namib"], bonne:2, diff:"facile"},
  {q:"Combien de pays frontaliers le Togo a-t-il ?", options:["2","3","4","5"], bonne:1, diff:"moyen"},
  {q:"Quelle est la plus haute montagne d'Afrique ?", options:["Mont Cameroun","Kilimandjaro","Mont Kenya","Atlas"], bonne:1, diff:"moyen"},
  {q:"Quel est le plus petit pays du monde ?", options:["Monaco","Saint-Marin","Vatican","Liechtenstein"], bonne:2, diff:"moyen"},
  {q:"Quelle mer borde le Togo ?", options:["Mer Rouge","Golfe de Guinée","Mer Méditerranée","Océan Indien"], bonne:1, diff:"moyen"},
  {q:"Quel continent est le plus grand en superficie ?", options:["Afrique","Amérique","Asie","Europe"], bonne:2, diff:"moyen"},
  {q:"Quelle est la capitale de l'Australie ?", options:["Sydney","Melbourne","Canberra","Perth"], bonne:2, diff:"difficile"},
  {q:"Quel fleuve traverse l'Égypte ?", options:["Congo","Nil","Niger","Zambèze"], bonne:1, diff:"difficile"},
  {q:"Quel est le pays le plus vaste du monde ?", options:["Chine","Canada","États-Unis","Russie"], bonne:3, diff:"difficile"},
  {q:"Quelle chaîne de montagnes sépare l'Europe de l'Asie ?", options:["Alpes","Himalaya","Oural","Andes"], bonne:2, diff:"difficile"},
  {q:"Quelle ville est traversée par le méridien de Greenwich ?", options:["Paris","Londres","Madrid","Rome"], bonne:1, diff:"difficile"}
];
const BANQUE_ESPACE = [
  {q:"Combien de planètes compte le système solaire ?", options:["7","8","9","10"], bonne:1, diff:"facile"},
  {q:"Quelle est la planète la plus proche du Soleil ?", options:["Vénus","Mercure","Terre","Mars"], bonne:1, diff:"facile"},
  {q:"Quel astre tourne autour de la Terre ?", options:["Le Soleil","Mars","La Lune","Vénus"], bonne:2, diff:"facile"},
  {q:"Quelle est la plus grosse planète du système solaire ?", options:["Saturne","Jupiter","Neptune","Uranus"], bonne:1, diff:"moyen"},
  {q:"Combien de temps met la Terre à faire le tour du Soleil ?", options:["24h","30 jours","365 jours","10 ans"], bonne:2, diff:"moyen"},
  {q:"Quel est le nom de notre galaxie ?", options:["Andromède","Voie Lactée","Triangle","Sombrero"], bonne:1, diff:"moyen"},
  {q:"Qui a été le premier homme à marcher sur la Lune ?", options:["Youri Gagarine","Neil Armstrong","Buzz Aldrin","John Glenn"], bonne:1, diff:"difficile"},
  {q:"Quelle planète possède les anneaux les plus visibles ?", options:["Jupiter","Saturne","Uranus","Neptune"], bonne:1, diff:"difficile"},
  {q:"Quel phénomène se produit quand la Lune cache le Soleil ?", options:["Éclipse lunaire","Équinoxe","Éclipse solaire","Solstice"], bonne:2, diff:"difficile"}
];
const BANQUE_TOGO = [
  {q:"Quelle langue est officielle au Togo ?", options:["Anglais","Français","Portugais","Espagnol"], bonne:1, diff:"facile"},
  {q:"Quel est le plat traditionnel togolais à base de pâte de maïs ?", options:["Fufu","Akpan","Ablo","Gari"], bonne:0, diff:"facile"},
  {q:"Quelle est la monnaie utilisée au Togo ?", options:["Cedi","Franc CFA","Naira","Dollar"], bonne:1, diff:"facile"},
  {q:"Quelle ville togolaise est connue pour son marché des féticheuses ?", options:["Lomé","Kara","Sokodé","Kpalimé"], bonne:0, diff:"moyen"},
  {q:"Quel est le nom du plus grand lac du Togo ?", options:["Lac Togo","Lac Volta","Lac Nokoué","Lac Ahémé"], bonne:0, diff:"moyen"}
];
const BANQUE_VF = [
  { texte: "La Grande Muraille de Chine est visible à l'œil nu depuis l'espace.", reponse: false },
  { texte: "Le cœur humain bat environ 100 000 fois par jour.", reponse: true },
  { texte: "Napoléon Bonaparte était plus petit que la moyenne de son époque.", reponse: false },
  { texte: "La lumière du Soleil met environ 8 minutes à atteindre la Terre.", reponse: true },
  { texte: "Le Sahara est le plus grand désert du monde.", reponse: false },
  { texte: "L'ADN humain est identique à environ 98% à celui du chimpanzé.", reponse: true },
  { texte: "Toutankhamon a régné pendant plus de 50 ans.", reponse: false },
  { texte: "Le son voyage plus vite dans l'eau que dans l'air.", reponse: true },
  { texte: "La Révolution française a commencé en 1789.", reponse: true },
  { texte: "Les dinosaures et les humains ont coexisté.", reponse: false },
  { texte: "Le Togo a obtenu son indépendance en 1960.", reponse: true },
  { texte: "Il y a plus d'étoiles dans l'univers que de grains de sable sur Terre.", reponse: true },
  { texte: "Les requins sont des mammifères.", reponse: false },
  { texte: "L'Everest est la montagne la plus haute du monde.", reponse: true },
  { texte: "Le corps humain contient plus d'eau que de sang.", reponse: true }
];
const BANQUE_SIECLE = [
  { evenement: "L'indépendance du Togo", annee: 1960 },
  { evenement: "La chute de l'Empire romain d'Occident", annee: 476 },
  { evenement: "La Révolution française", annee: 1789 },
  { evenement: "La découverte de l'Amérique par Christophe Colomb", annee: 1492 },
  { evenement: "La Première Guerre mondiale", annee: 1914 },
  { evenement: "L'invention de l'imprimerie par Gutenberg", annee: 1450 },
  { evenement: "Le premier pas sur la Lune", annee: 1969 },
  { evenement: "La construction des pyramides de Gizeh", annee: -2560 },
  { evenement: "La chute du Mur de Berlin", annee: 1989 },
  { evenement: "Le début de la Renaissance", annee: 1400 }
];
const FIGURES_QUISUISJE = [
  { indices: ["Je suis née en Pologne.", "J'ai reçu deux prix Nobel.", "J'ai travaillé sur la radioactivité."], nom: "Marie Curie" },
  { indices: ["J'ai été le premier président du Togo indépendant.", "J'ai gouverné à partir de 1960.", "Mon nom de famille est Olympio."], nom: "Sylvanus Olympio" },
  { indices: ["J'ai formulé la théorie de la relativité.", "Je suis né en Allemagne.", "Ma formule la plus célèbre est E=mc²."], nom: "Albert Einstein" },
  { indices: ["J'ai peint la Joconde.", "Je suis aussi ingénieur et inventeur.", "Je suis né en Italie à la Renaissance."], nom: "Léonard de Vinci" },
  { indices: ["J'ai théorisé l'évolution des espèces.", "J'ai voyagé sur le Beagle.", "Mon livre principal s'appelle L'Origine des espèces."], nom: "Charles Darwin" },
  { indices: ["J'ai été la première femme à voler seule au-dessus de l'Atlantique.", "Je suis américaine.", "J'ai disparu en 1937 lors d'un vol autour du monde."], nom: "Amelia Earhart" },
  { indices: ["J'ai dirigé la résistance non-violente en Inde.", "On m'appelle souvent « Mahatma ».", "J'ai été assassiné en 1948."], nom: "Gandhi" },
  { indices: ["J'ai été le premier homme dans l'espace.", "Je suis soviétique.", "Mon vol a eu lieu en 1961."], nom: "Youri Gagarine" },
  { indices: ["J'ai lutté contre l'apartheid.", "J'ai été emprisonné pendant 27 ans.", "Je suis devenu président de l'Afrique du Sud."], nom: "Nelson Mandela" },
  { indices: ["J'ai inventé l'ampoule électrique (améliorée).", "Je suis un inventeur américain.", "J'ai fondé General Electric."], nom: "Thomas Edison" }
];

// ==================== MOTEUR DE JEU GENERIQUE ====================
let jeuScores = {};
let jeuActuelCode = null;
let questionActuelle = null;
let difficulteActuelle = "facile";

function genererQuestionQCM(banque) {
  const dispo = banque.filter(item => !item.diff || item.diff === difficulteActuelle);
  const source = dispo.length ? dispo : banque;
  const item = source[Math.floor(Math.random() * source.length)];
  return { question: item.q, options: item.options, correctIndex: item.bonne, points: 8 };
}
function genererQuestionDevineJour() {
  const annee = 1950 + Math.floor(Math.random()*100);
  const mois = 1 + Math.floor(Math.random()*12);
  const jour = 1 + Math.floor(Math.random()*joursDansLeMois(mois, annee));
  const idx = calculerJourSemaine(jour, mois, annee);
  return { question: `Quel jour de la semaine était le ${jour} ${NOMS_MOIS[mois]} ${annee} ?`, options: NOMS_JOURS_COURTS, correctIndex: idx, points: 6 };
}
function genererQuestionVF() {
  const item = BANQUE_VF[Math.floor(Math.random()*BANQUE_VF.length)];
  return { question: item.texte, options: ["Vrai","Faux"], correctIndex: item.reponse ? 0 : 1, points: 6 };
}
function genererQuestionSiecle() {
  const item = BANQUE_SIECLE[Math.floor(Math.random()*BANQUE_SIECLE.length)];
  const siecleCorrect = item.annee > 0 ? Math.ceil(item.annee / 100) : Math.ceil(item.annee / 100) - 1;
  let propositions = new Set([siecleCorrect]);
  while (propositions.size < 4) {
    const variation = siecleCorrect + Math.floor(Math.random()*7) - 3;
    if (variation > 0) propositions.add(variation);
  }
  const options = melanger([...propositions]).map(s => s + "e siècle");
  const correctIndex = options.indexOf(siecleCorrect + "e siècle");
  return { question: `En quel siècle a eu lieu : « ${item.evenement} » ?`, options, correctIndex, points: 8 };
}
function genererQuestionMotDef() {
  const item = DICTIONNAIRE[Math.floor(Math.random()*DICTIONNAIRE.length)];
  const autres = melanger(DICTIONNAIRE.filter(d => d.mot !== item.mot)).slice(0,3).map(d => d.mot);
  const options = melanger([item.mot, ...autres]);
  return { question: `Quel mot correspond à : « ${item.def} »`, options, correctIndex: options.indexOf(item.mot), points: 7 };
}
function genererQuestionQuiSuisJe() {
  const item = FIGURES_QUISUISJE[Math.floor(Math.random()*FIGURES_QUISUISJE.length)];
  const autres = melanger(FIGURES_QUISUISJE.filter(f => f.nom !== item.nom)).slice(0,3).map(f => f.nom);
  const options = melanger([item.nom, ...autres]);
  return { question: item.indices.join(" "), options, correctIndex: options.indexOf(item.nom), points: 10 };
}

const JEUX = {
  devine:    { titre: "📅 Devine le jour",     generer: genererQuestionDevineJour, diff: false },
  histoire:  { titre: "🏛️ Histoire",           generer: () => genererQuestionQCM(BANQUE_HISTOIRE), diff: true },
  science:   { titre: "🔬 Science",             generer: () => genererQuestionQCM(BANQUE_SCIENCE), diff: true },
  geo:       { titre: "🌍 Géographie",          generer: () => genererQuestionQCM(BANQUE_GEO), diff: true },
  espace:    { titre: "🪐 Espace",              generer: () => genererQuestionQCM(BANQUE_ESPACE), diff: true },
  togo:      { titre: "🇹🇬 Culture Togo",       generer: () => genererQuestionQCM(BANQUE_TOGO), diff: false },
  vraifaux:  { titre: "✅ Vrai ou Faux",        generer: genererQuestionVF, diff: false },
  siecle:    { titre: "🕰️ Devine le siècle",   generer: genererQuestionSiecle, diff: false },
  motdef:    { titre: "📖 Mot ou Définition",   generer: genererQuestionMotDef, diff: false },
  quisuisje: { titre: "🕵️ Qui suis-je ?",      generer: genererQuestionQuiSuisJe, diff: false }
};

function construireSousOngletsJeux() {
  const zone = document.getElementById("sousOngletsJeux");
  zone.innerHTML = Object.entries(JEUX).map(([code, cfg], i) =>
    `<button class="sous-onglet ${i===0?"actif":""}" data-jeu="${code}">${cfg.titre}</button>`
  ).join("");
  activerSousOnglets("sousOngletsJeux", "jeu", changerJeu);
}
function changerJeu(code) {
  jeuActuelCode = code;
  if (!jeuScores[code]) jeuScores[code] = { bonnes: 0, total: 0 };
  document.getElementById("difficulteChips").style.display = JEUX[code].diff ? "flex" : "none";
  nouvelleQuestion();
}
function nouvelleQuestion() {
  questionActuelle = JEUX[jeuActuelCode].generer();
  document.getElementById("jeuQuestionTexte").textContent = questionActuelle.question;
  document.getElementById("jeuFeedbackZone").textContent = "";
  const zone = document.getElementById("jeuReponsesZone");
  zone.className = "jeu-reponses " + (questionActuelle.options.length > 4 ? "" : questionActuelle.options.length === 2 ? "deux" : "colonne");
  zone.innerHTML = "";
  questionActuelle.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.onclick = () => repondre(i, btn);
    zone.appendChild(btn);
  });
  document.getElementById("jeuScoreZone").textContent = `Score : ${jeuScores[jeuActuelCode].bonnes} / ${jeuScores[jeuActuelCode].total}`;
}
function repondre(indexChoisi, boutonClique) {
  const s = jeuScores[jeuActuelCode];
  s.total++;
  document.querySelectorAll("#jeuReponsesZone button").forEach(b => b.disabled = true);
  const correct = indexChoisi === questionActuelle.correctIndex;
  enregistrerReponse(correct);
  if (correct) {
    s.bonnes++;
    boutonClique.classList.add("bonne");
    document.getElementById("jeuFeedbackZone").textContent = "✅ Bonne réponse !";
    ajouterPieces(questionActuelle.points);
  } else {
    boutonClique.classList.add("mauvaise");
    document.querySelectorAll("#jeuReponsesZone button")[questionActuelle.correctIndex].classList.add("bonne");
    document.getElementById("jeuFeedbackZone").textContent = "❌ La bonne réponse était : " + questionActuelle.options[questionActuelle.correctIndex];
  }
  document.getElementById("jeuScoreZone").textContent = `Score : ${s.bonnes} / ${s.total}`;
}
document.getElementById("jeuSuivanteBtn").onclick = nouvelleQuestion;
document.querySelectorAll(".diff-chip").forEach(chip => {
  chip.onclick = function() {
    document.querySelectorAll(".diff-chip").forEach(c => c.classList.remove("actif"));
    chip.classList.add("actif");
    difficulteActuelle = chip.dataset.diff;
    nouvelleQuestion();
  };
});
construireSousOngletsJeux();
changerJeu("devine");

// ==================== DICTIONNAIRE (100+ mots) ====================
const DICTIONNAIRE = [
  {mot:"Renaissance",cat:"Histoire",def:"Période de renouveau culturel, artistique et scientifique en Europe, du 14e au 17e siècle."},
  {mot:"Colonisation",cat:"Histoire",def:"Processus par lequel une puissance étrangère prend le contrôle politique et économique d'un territoire."},
  {mot:"Empire romain",cat:"Histoire",def:"Vaste civilisation antique centrée sur Rome, ayant dominé l'Europe et le bassin méditerranéen."},
  {mot:"Indépendance",cat:"Histoire",def:"Situation d'un pays qui n'est plus sous l'autorité d'une puissance coloniale ou étrangère."},
  {mot:"Esclavage",cat:"Histoire",def:"Système où des personnes sont considérées comme des biens et privées de liberté."},
  {mot:"Révolution",cat:"Histoire",def:"Changement brutal et profond dans l'organisation politique ou sociale d'un pays."},
  {mot:"Monarchie",cat:"Histoire",def:"Système politique dirigé par un roi ou une reine."},
  {mot:"Démocratie",cat:"Histoire",def:"Système politique où le pouvoir appartient au peuple, souvent par le vote."},
  {mot:"Traité",cat:"Histoire",def:"Accord officiel signé entre plusieurs pays ou parties."},
  {mot:"Dynastie",cat:"Histoire",def:"Succession de souverains appartenant à une même famille."},
  {mot:"Féodalité",cat:"Histoire",def:"Système social médiéval basé sur des liens de dépendance entre seigneurs et vassaux."},
  {mot:"Croisade",cat:"Histoire",def:"Expédition militaire chrétienne médiévale vers la Terre sainte."},
  {mot:"Apartheid",cat:"Histoire",def:"Système de ségrégation raciale institutionnalisé, notamment en Afrique du Sud."},
  {mot:"Colonisation française",cat:"Histoire",def:"Domination exercée par la France sur plusieurs territoires africains et asiatiques."},
  {mot:"Panafricanisme",cat:"Histoire",def:"Mouvement politique prônant l'unité et la solidarité des peuples africains."},
  {mot:"Guerre froide",cat:"Histoire",def:"Période de tension entre les États-Unis et l'URSS après la Seconde Guerre mondiale."},
  {mot:"Décolonisation",cat:"Histoire",def:"Processus par lequel les colonies accèdent à leur indépendance."},
  {mot:"Empire ottoman",cat:"Histoire",def:"Vaste empire musulman ayant existé du 14e au 20e siècle, centré sur la Turquie actuelle."},
  {mot:"Traite négrière",cat:"Histoire",def:"Commerce historique d'êtres humains réduits en esclavage, notamment entre l'Afrique et les Amériques."},
  {mot:"Pharaon",cat:"Histoire",def:"Titre porté par les souverains de l'Égypte antique."},
  {mot:"Hiéroglyphe",cat:"Histoire",def:"Système d'écriture utilisant des symboles, employé dans l'Égypte antique."},
  {mot:"Empire inca",cat:"Histoire",def:"Civilisation précolombienne d'Amérique du Sud, connue pour le Machu Picchu."},
  {mot:"Empire aztèque",cat:"Histoire",def:"Civilisation précolombienne d'Amérique centrale, centrée sur l'actuel Mexique."},
  {mot:"Renaissance africaine",cat:"Histoire",def:"Mouvement intellectuel prônant le renouveau culturel et politique du continent africain."},
  {mot:"Colonisation allemande du Togo",cat:"Togo",def:"Période où le Togo fut un protectorat allemand, de 1884 à 1914."},
  {mot:"Sylvanus Olympio",cat:"Togo",def:"Premier président du Togo indépendant, en fonction de 1960 à 1963."},
  {mot:"Gnassingbé Eyadéma",cat:"Togo",def:"Président du Togo ayant dirigé le pays de 1967 à 2005."},
  {mot:"Lomé",cat:"Togo",def:"Capitale et plus grande ville du Togo, située sur le golfe de Guinée."},
  {mot:"Éwé",cat:"Togo",def:"Groupe ethnique et langue parlée au Togo, au Ghana et au Bénin."},
  {mot:"Kabyè",cat:"Togo",def:"Groupe ethnique originaire du nord du Togo."},
  {mot:"Franc CFA",cat:"Togo",def:"Monnaie utilisée par plusieurs pays d'Afrique de l'Ouest, dont le Togo."},
  {mot:"Golfe de Guinée",cat:"Togo",def:"Portion de l'océan Atlantique bordant plusieurs pays d'Afrique de l'Ouest, dont le Togo."},
  {mot:"Fête de l'Indépendance togolaise",cat:"Togo",def:"Célébrée chaque 27 avril, jour de l'indépendance du Togo en 1960."},
  {mot:"Marché des féticheuses",cat:"Togo",def:"Marché traditionnel de Lomé vendant des objets liés à la médecine traditionnelle et au vaudou."},
  {mot:"Photosynthèse",cat:"Science",def:"Processus par lequel les plantes transforment la lumière du soleil en énergie chimique."},
  {mot:"Gravité",cat:"Science",def:"Force qui attire les objets ayant une masse les uns vers les autres."},
  {mot:"Molécule",cat:"Science",def:"Groupe d'au moins deux atomes liés chimiquement ensemble."},
  {mot:"ADN",cat:"Science",def:"Molécule qui contient les informations génétiques d'un être vivant."},
  {mot:"Atome",cat:"Science",def:"Plus petite unité de matière qui garde les propriétés chimiques d'un élément."},
  {mot:"Évolution",cat:"Science",def:"Processus par lequel les espèces vivantes se transforment progressivement au fil des générations."},
  {mot:"Écosystème",cat:"Science",def:"Ensemble formé par les êtres vivants et leur environnement, en interaction constante."},
  {mot:"Énergie renouvelable",cat:"Science",def:"Source d'énergie qui se renouvelle naturellement (soleil, vent, eau...)."},
  {mot:"Cellule",cat:"Science",def:"Plus petite unité vivante capable de se reproduire, constituant la base des organismes."},
  {mot:"Bactérie",cat:"Science",def:"Micro-organisme unicellulaire, parfois utile, parfois pathogène."},
  {mot:"Virus",cat:"Science",def:"Agent infectieux microscopique qui a besoin d'une cellule hôte pour se reproduire."},
  {mot:"Vaccin",cat:"Science",def:"Préparation médicale qui protège l'organisme contre une maladie spécifique."},
  {mot:"Système solaire",cat:"Science",def:"Ensemble formé par le Soleil et les objets célestes qui gravitent autour de lui."},
  {mot:"Galaxie",cat:"Science",def:"Vaste ensemble d'étoiles, de gaz et de poussière lié par la gravité."},
  {mot:"Étoile",cat:"Science",def:"Corps céleste massif produisant de la lumière et de la chaleur par fusion nucléaire."},
  {mot:"Trou noir",cat:"Science",def:"Région de l'espace où la gravité est si forte que rien, pas même la lumière, ne peut s'en échapper."},
  {mot:"Big Bang",cat:"Science",def:"Théorie scientifique décrivant l'origine et l'expansion de l'univers."},
  {mot:"Effet de serre",cat:"Science",def:"Phénomène naturel où certains gaz retiennent la chaleur dans l'atmosphère terrestre."},
  {mot:"Réchauffement climatique",cat:"Science",def:"Augmentation progressive de la température moyenne de la Terre."},
  {mot:"Biodiversité",cat:"Science",def:"Variété des espèces vivantes présentes sur Terre."},
  {mot:"Métabolisme",cat:"Science",def:"Ensemble des réactions chimiques permettant à un organisme de fonctionner."},
  {mot:"Neurone",cat:"Science",def:"Cellule nerveuse spécialisée dans la transmission de l'information dans le corps."},
  {mot:"Vaccination",cat:"Science",def:"Action d'administrer un vaccin pour prévenir une maladie."},
  {mot:"Électricité",cat:"Science",def:"Forme d'énergie liée au déplacement de charges électriques."},
  {mot:"Magnétisme",cat:"Science",def:"Phénomène physique lié à l'attraction ou la répulsion entre certains matériaux."},
  {mot:"Radioactivité",cat:"Science",def:"Phénomène par lequel certains noyaux atomiques se désintègrent en émettant un rayonnement."},
  {mot:"Fusion nucléaire",cat:"Science",def:"Réaction où deux noyaux atomiques légers s'assemblent en libérant une grande énergie."},
  {mot:"Gène",cat:"Science",def:"Segment d'ADN qui contient l'information nécessaire à un caractère héréditaire."},
  {mot:"Mutation",cat:"Science",def:"Modification accidentelle ou provoquée du matériel génétique d'un être vivant."},
  {mot:"Continent",cat:"Géographie",def:"Vaste étendue de terre émergée, comme l'Afrique, l'Asie ou l'Europe."},
  {mot:"Océan",cat:"Géographie",def:"Vaste étendue d'eau salée séparant les continents."},
  {mot:"Équateur",cat:"Géographie",def:"Ligne imaginaire divisant la Terre en hémisphère nord et hémisphère sud."},
  {mot:"Méridien",cat:"Géographie",def:"Ligne imaginaire reliant les pôles Nord et Sud, utilisée pour mesurer la longitude."},
  {mot:"Désert",cat:"Géographie",def:"Région caractérisée par un climat très sec et une végétation rare."},
  {mot:"Savane",cat:"Géographie",def:"Écosystème de prairie tropicale avec des arbres dispersés, typique de l'Afrique de l'Ouest."},
  {mot:"Delta",cat:"Géographie",def:"Zone où un fleuve se divise en plusieurs bras avant de se jeter dans la mer."},
  {mot:"Archipel",cat:"Géographie",def:"Groupe d'îles proches les unes des autres."},
  {mot:"Plateau continental",cat:"Géographie",def:"Zone peu profonde de l'océan bordant un continent."},
  {mot:"Isthme",cat:"Géographie",def:"Bande de terre étroite reliant deux terres plus grandes."},
  {mot:"Fleuve",cat:"Géographie",def:"Cours d'eau qui se jette dans la mer ou l'océan."},
  {mot:"Affluent",cat:"Géographie",def:"Cours d'eau qui se jette dans un autre cours d'eau plus important."},
  {mot:"Sahel",cat:"Géographie",def:"Zone de transition climatique entre le Sahara et les régions tropicales d'Afrique de l'Ouest."},
  {mot:"Mousson",cat:"Géographie",def:"Vent saisonnier apportant de fortes pluies dans certaines régions tropicales."},
  {mot:"Latitude",cat:"Géographie",def:"Coordonnée mesurant la distance angulaire d'un lieu par rapport à l'équateur."},
  {mot:"Longitude",cat:"Géographie",def:"Coordonnée mesurant la distance angulaire d'un lieu par rapport au méridien de Greenwich."},
  {mot:"Relief",cat:"Géographie",def:"Ensemble des formes du terrain (montagnes, plaines, vallées...)."},
  {mot:"Érosion",cat:"Géographie",def:"Usure progressive du relief par le vent, l'eau ou d'autres phénomènes naturels."},
  {mot:"Urbanisation",cat:"Géographie",def:"Processus de croissance des villes et de concentration de la population urbaine."},
  {mot:"Démographie",cat:"Géographie",def:"Étude scientifique des populations humaines et de leur évolution."},
  {mot:"Frontière",cat:"Géographie",def:"Ligne délimitant le territoire de deux pays voisins."},
  {mot:"Hémisphère",cat:"Géographie",def:"Moitié du globe terrestre, délimitée par l'équateur ou un méridien."},
  {mot:"Climat tropical",cat:"Géographie",def:"Climat chaud toute l'année, caractéristique des régions proches de l'équateur, comme le Togo."},
  {mot:"Baobab",cat:"Géographie",def:"Arbre emblématique des savanes africaines, connu pour son tronc massif."},
  {mot:"Golfe",cat:"Géographie",def:"Partie de mer qui s'avance dans les terres, plus petite qu'une mer."},
  {mot:"Empire",cat:"Histoire",def:"Vaste territoire regroupant plusieurs peuples sous une même autorité centrale."},
  {mot:"Colonie",cat:"Histoire",def:"Territoire administré et exploité par une puissance étrangère."},
  {mot:"Métropole",cat:"Histoire",def:"Pays qui exerce une domination coloniale sur un territoire extérieur."},
  {mot:"Nationalisme",cat:"Histoire",def:"Idéologie mettant en avant l'unité et les intérêts d'une nation."},
  {mot:"Constitution",cat:"Histoire",def:"Texte fondamental établissant l'organisation politique d'un État."},
  {mot:"Coup d'État",cat:"Histoire",def:"Prise de pouvoir illégale et souvent brutale, en dehors des voies légales."},
  {mot:"Génocide",cat:"Histoire",def:"Extermination volontaire et systématique d'un groupe humain."},
  {mot:"Diplomatie",cat:"Histoire",def:"Ensemble des relations et négociations entre États."},
  {mot:"Armistice",cat:"Histoire",def:"Accord mettant fin temporairement ou définitivement à des combats."},
  {mot:"Néolithique",cat:"Histoire",def:"Période préhistorique marquée par l'apparition de l'agriculture et de l'élevage."},
  {mot:"Système immunitaire",cat:"Science",def:"Ensemble des mécanismes de défense de l'organisme contre les infections."},
  {mot:"Protéine",cat:"Science",def:"Grande molécule biologique essentielle au fonctionnement des cellules."},
  {mot:"Enzyme",cat:"Science",def:"Protéine qui accélère les réactions chimiques dans les organismes vivants."},
  {mot:"Photon",cat:"Science",def:"Particule élémentaire qui constitue la lumière."},
  {mot:"Onde sonore",cat:"Science",def:"Vibration qui se propage dans l'air ou un autre milieu, perçue comme un son."},
  {mot:"Volcan",cat:"Géographie",def:"Relief formé par la remontée de magma depuis l'intérieur de la Terre."},
  {mot:"Tectonique des plaques",cat:"Science",def:"Théorie expliquant les mouvements des grandes plaques constituant la croûte terrestre."},
  {mot:"Séisme",cat:"Science",def:"Secousse brutale du sol causée par un déplacement soudain de failles géologiques."}
];
function afficherDictionnaire(filtre, categorie) {
  const f = filtre.toLowerCase().trim();
  let resultats = DICTIONNAIRE.filter(d => d.mot.toLowerCase().includes(f) || d.def.toLowerCase().includes(f));
  if (categorie && categorie !== "Tout") resultats = resultats.filter(d => d.cat === categorie);
  document.getElementById("dicoCompte").textContent = resultats.length + " mot" + (resultats.length>1?"s":"");
  document.getElementById("dicoResultats").innerHTML = resultats.map(d => `
    <div class="dico-item"><span class="dico-mot">${d.mot}</span><span class="dico-categorie">${d.cat}</span>
    <div class="dico-def">${d.def}</div></div>
  `).join("") || `<p style="color:var(--ink-soft); font-size:13px;">Aucun résultat.</p>`;
}
let dicoCategorieActuelle = "Tout";
document.getElementById("dicoRecherche").addEventListener("input", function() { afficherDictionnaire(this.value, dicoCategorieActuelle); });
activerSousOnglets("sousOngletsDico", "cat", function(cat) { dicoCategorieActuelle = cat; afficherDictionnaire(document.getElementById("dicoRecherche").value, cat); });
afficherDictionnaire("", "Tout");

// ==================== BOUTIQUE ====================
const OBJETS_BOUTIQUE = [
  {id:"vase-grec",nom:"Vase grec antique",emoji:"🏺",desc:"Poterie de la Grèce antique",prix:30},
  {id:"piece-romaine",nom:"Pièce romaine",emoji:"🪙",desc:"Monnaie de l'Empire romain",prix:20},
  {id:"parchemin",nom:"Parchemin ancien",emoji:"📜",desc:"Manuscrit historique",prix:25},
  {id:"masque-africain",nom:"Masque africain",emoji:"🎭",desc:"Art traditionnel ouest-africain",prix:35},
  {id:"astrolabe",nom:"Astrolabe",emoji:"🧭",desc:"Instrument scientifique ancien",prix:45},
  {id:"statuette",nom:"Statuette égyptienne",emoji:"🗿",desc:"Objet de l'Égypte antique",prix:40},
  {id:"carte-ancienne",nom:"Carte ancienne",emoji:"🗺️",desc:"Carte de navigation historique",prix:28},
  {id:"epee",nom:"Épée médiévale",emoji:"⚔️",desc:"Arme d'un chevalier du Moyen Âge",prix:50},
  {id:"couronne",nom:"Couronne royale",emoji:"👑",desc:"Symbole du pouvoir monarchique",prix:60},
  {id:"telescope",nom:"Télescope ancien",emoji:"🔭",desc:"Instrument des grands astronomes",prix:55},
  {id:"tambour-togolais",nom:"Tambour togolais",emoji:"🥁",desc:"Instrument traditionnel togolais",prix:32},
  {id:"amphore",nom:"Amphore antique",emoji:"🏛️",desc:"Contenant utilisé dans l'Antiquité",prix:26},
  {id:"boussole",nom:"Boussole d'explorateur",emoji:"🧲",desc:"Instrument des grands navigateurs",prix:22},
  {id:"livre-ancien",nom:"Livre ancien",emoji:"📚",desc:"Ouvrage précieux d'une autre époque",prix:38},
  {id:"globe",nom:"Globe terrestre ancien",emoji:"🌍",desc:"Représentation historique du monde",prix:42},
  {id:"lanterne",nom:"Lanterne d'antan",emoji:"🏮",desc:"Éclairage traditionnel ancien",prix:18}
];
function rafraichirBoutique() {
  if (!profilActuel) return;
  document.getElementById("vueMagasin").innerHTML = OBJETS_BOUTIQUE.map(o => {
    const possede = profilActuel.collection.includes(o.id);
    return `<div class="objet-carte"><div class="objet-emoji">${o.emoji}</div><div class="objet-nom">${o.nom}</div>
      <div class="objet-desc">${o.desc}</div><div class="objet-prix">🪙 ${o.prix}</div>
      ${possede ? `<button class="badge-possede" disabled>Possédé ✓</button>` : `<button class="btn-acheter" ${profilActuel.pieces < o.prix ? "disabled" : ""} onclick="acheterObjet('${o.id}')">Acheter</button>`}
      </div>`;
  }).join("");
  const possedes = OBJETS_BOUTIQUE.filter(o => profilActuel.collection.includes(o.id));
  document.getElementById("vueCollection").innerHTML = possedes.length ? possedes.map(o => `
    <div class="objet-carte"><div class="objet-emoji">${o.emoji}</div><div class="objet-nom">${o.nom}</div><div class="objet-desc">${o.desc}</div></div>`).join("")
    : `<p style="color:var(--ink-soft); font-size:13px; grid-column: 1/-1;">Ta collection est vide — gagne des pièces dans les jeux !</p>`;
  rafraichirBadges();
}
function acheterObjet(id) {
  if (!profilActuel) return;
  const objet = OBJETS_BOUTIQUE.find(o => o.id === id);
  if (profilActuel.pieces < objet.prix) return;
  profilActuel.pieces -= objet.prix;
  profilActuel.collection.push(id);
  sauverProfil();
  document.getElementById("profilPieces").textContent = profilActuel.pieces;
  rafraichirBoutique();
  verifierBadges();
}
activerSousOnglets("sousOngletsBoutique", "vue", function(vue) {
  document.getElementById("vueMagasin").style.display = vue === "magasin" ? "grid" : "none";
  document.getElementById("vueCollection").style.display = vue === "collection" ? "grid" : "none";
  document.getElementById("vueBadges").style.display = vue === "badges" ? "grid" : "none";
});

// ==================== BADGES ====================
const BADGES = [
  { id:"premier-pas", emoji:"🌱", nom:"Premier pas", desc:"1 bonne réponse", condition: p => p.bonnesReponses >= 1 },
  { id:"curieux", emoji:"🔎", nom:"Curieux", desc:"25 bonnes réponses", condition: p => p.bonnesReponses >= 25 },
  { id:"erudit", emoji:"🎓", nom:"Érudit", desc:"100 bonnes réponses", condition: p => p.bonnesReponses >= 100 },
  { id:"serie5", emoji:"🔥", nom:"En feu", desc:"5 bonnes réponses d'affilée", condition: p => p.meilleureSerie >= 5 },
  { id:"serie10", emoji:"⚡", nom:"Imbattable", desc:"10 bonnes réponses d'affilée", condition: p => p.meilleureSerie >= 10 },
  { id:"collectionneur", emoji:"🏺", nom:"Collectionneur", desc:"3 objets possédés", condition: p => p.collection.length >= 3 },
  { id:"grand-collectionneur", emoji:"👑", nom:"Grand collectionneur", desc:"Tous les objets possédés", condition: p => p.collection.length >= OBJETS_BOUTIQUE.length },
  { id:"riche", emoji:"💰", nom:"Riche", desc:"200 pièces gagnées au total", condition: p => p.piecesTotalGagnees >= 200 }
];
function verifierBadges() {
  if (!profilActuel) return;
  let nouveau = false;
  BADGES.forEach(b => {
    if (!profilActuel.badges.includes(b.id) && b.condition(profilActuel)) {
      profilActuel.badges.push(b.id);
      nouveau = true;
    }
  });
  if (nouveau) sauverProfil();
  rafraichirBadges();
}
function rafraichirBadges() {
  if (!profilActuel) return;
  document.getElementById("vueBadges").innerHTML = BADGES.map(b => {
    const debloque = profilActuel.badges.includes(b.id);
    return `<div class="objet-carte badge-carte ${debloque?"debloque":""}">
      <div class="badge-emoji">${b.emoji}</div><div class="badge-nom">${b.nom}</div><div class="badge-desc">${b.desc}</div>
    </div>`;
  }).join("");
}

// ==================== CLASSEMENT (local a l'appareil) ====================
function afficherClassement() {
  const profils = [];
  for (let i = 0; i < localStorage.length; i++) {
    const cle = localStorage.key(i);
    if (cle.startsWith("scalium_profil_")) {
      try { profils.push(JSON.parse(localStorage.getItem(cle))); } catch(e) {}
    }
  }
  profils.sort((a,b) => (b.bonnesReponses||0) - (a.bonnesReponses||0));
  const zone = document.getElementById("listeClassement");
  if (profils.length === 0) {
    zone.innerHTML = `<p style="color:var(--ink-soft); font-size:13px;">Aucun profil pour l'instant.</p>`;
    return;
  }
  zone.innerHTML = profils.map((p, i) => `
    <div class="classement-ligne ${profilActuel && p.pseudo===profilActuel.pseudo ? "moi" : ""}">
      <span class="classement-rang">${i+1}</span>
      <span class="classement-pseudo">${p.pseudo}</span>
      <span class="classement-score">${p.bonnesReponses||0} bonnes réponses · 🪙 ${p.piecesTotalGagnees||0}</span>
    </div>`).join("");
}
