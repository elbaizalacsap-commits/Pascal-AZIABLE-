/* ============================================================
   P.Scalium ggg — script.js
   Application complète : calculateur de jour, jeux, monnaie
   virtuelle, boutique, dictionnaire, auteurs, comptes locaux
   et publications.

   IMPORTANT (a lire avant de deployer) :
   Ce site reste 100% statique (aucun serveur a gerer soi-meme).
   Les comptes joueurs, les pieces et la collection restent
   stockes dans le "localStorage" du navigateur : ils ne sont
   visibles que sur cet appareil, dans ce navigateur precis. Ce
   n'est pas un vrai systeme de securite ni un vrai partage
   multi-utilisateurs, et ce n'est pas le sujet ici.
   En revanche, les publications de la page Actus sont
   desormais partagees par tous les visiteurs : elles sont
   lues depuis /content/posts.json (fichier gere via l'espace
   /admin/, propulse par Decap CMS + Netlify Identity + Git
   Gateway). Seul le proprietaire du site, invite via Netlify
   Identity, peut publier depuis /admin/.
   ============================================================ */

/* ============================================================
   0. FORMULE DE CALCUL DU JOUR (reutilisee partout)
   ============================================================ */
function calculerJourSemaine(jour, mois, anneeComplete) {
  let estBiss = (anneeComplete % 4 == 0 && (anneeComplete % 100 != 0 || anneeComplete % 400 == 0));
  let siecle = Math.floor(anneeComplete / 100);
  let tableX = [2, 4, 6, 1];
  let x = tableX[siecle % 4];
  let an = anneeComplete % 100;
  let codesMois = [null, 1, 4, 4, 0, 2, 5, 0, 3, 6, 1, 4, 6];
  let codeMois = codesMois[mois];

  let resultat = jour + codeMois + Math.floor(an / 4) + an - x;
  if (estBiss && (mois == 1 || mois == 2)) {
    resultat = resultat - 1;
  }
  return ((resultat % 7) + 7) % 7;
}

const NOMS_JOURS = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
const NOMS_JOURS_COURTS = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
const NOMS_MOIS = ["", "janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

function estBissextileAnnee(annee) {
  return (annee % 4 == 0 && (annee % 100 != 0 || annee % 400 == 0));
}
function joursDansLeMois(mois, annee) {
  const joursParMois = [null, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (mois == 2 && estBissextileAnnee(annee)) return 29;
  return joursParMois[mois];
}

/* ============================================================
   1. MODE SOMBRE
   ============================================================ */
const modeBtn = document.getElementById("modeBtn");
function appliquerMode(sombre) {
  document.body.classList.toggle("dark", sombre);
  modeBtn.textContent = sombre ? "☀️" : "🌙";
  localStorage.setItem("psg_theme", sombre ? "sombre" : "clair");
}
appliquerMode(localStorage.getItem("psg_theme") === "sombre");
modeBtn.onclick = function () {
  appliquerMode(!document.body.classList.contains("dark"));
};

/* ============================================================
   2. NAVIGATION PAR ONGLETS
   ============================================================ */
document.querySelectorAll(".onglet").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".onglet").forEach(b => b.classList.remove("actif"));
    document.querySelectorAll(".page").forEach(p => p.classList.remove("actif"));
    btn.classList.add("actif");
    document.getElementById(btn.dataset.page).classList.add("actif");
  });
});

/* ============================================================
   3. PORTE-MONNAIE & PROFILS (invite ou compte local)
   ============================================================ */
function chargerUtilisateurs() {
  try { return JSON.parse(localStorage.getItem("psg_users")) || {}; }
  catch (e) { return {}; }
}
function sauverUtilisateurs(obj) {
  localStorage.setItem("psg_users", JSON.stringify(obj));
}
function chargerInvite() {
  try {
    return JSON.parse(localStorage.getItem("psg_guest")) || { coins: 0, collection: [], lastSpin: null };
  } catch (e) { return { coins: 0, collection: [], lastSpin: null }; }
}
function sauverInvite(obj) {
  localStorage.setItem("psg_guest", JSON.stringify(obj));
}
function getSessionPseudo() {
  return localStorage.getItem("psg_session");
}
function setSessionPseudo(pseudo) {
  if (pseudo) localStorage.setItem("psg_session", pseudo);
  else localStorage.removeItem("psg_session");
}

// Renvoie le profil actif (utilisateur connecte, sinon invite)
function getProfil() {
  const session = getSessionPseudo();
  if (session) {
    const users = chargerUtilisateurs();
    if (users[session]) return { type: "compte", cle: session, data: users[session] };
  }
  return { type: "invite", cle: null, data: chargerInvite() };
}
function sauverProfil(profil) {
  if (profil.type === "compte") {
    const users = chargerUtilisateurs();
    users[profil.cle] = profil.data;
    sauverUtilisateurs(users);
  } else {
    sauverInvite(profil.data);
  }
}

function ajouterPieces(n) {
  const profil = getProfil();
  profil.data.coins = (profil.data.coins || 0) + n;
  sauverProfil(profil);
  rafraichirSoldePieces();
  return profil.data.coins;
}
function depenserPieces(n) {
  const profil = getProfil();
  if ((profil.data.coins || 0) < n) return false;
  profil.data.coins -= n;
  sauverProfil(profil);
  rafraichirSoldePieces();
  return true;
}
function ajouterAlaCollection(idObjet) {
  const profil = getProfil();
  if (!profil.data.collection) profil.data.collection = [];
  if (!profil.data.collection.includes(idObjet)) profil.data.collection.push(idObjet);
  sauverProfil(profil);
}
function possedeObjet(idObjet) {
  const profil = getProfil();
  return (profil.data.collection || []).includes(idObjet);
}
function rafraichirSoldePieces() {
  const profil = getProfil();
  document.getElementById("soldePieces").textContent = "🪙 " + (profil.data.coins || 0);
}

/* ============================================================
   4. OUTIL D'"OBFUSCATION" DE MOT DE PASSE
   (PAS une vraie securite : simple encodage, pas de chiffrement.
    A n'utiliser que pour ce mini-site sans serveur.)
   ============================================================ */
function obfusquer(txt) {
  try { return btoa(unescape(encodeURIComponent(txt))); }
  catch (e) { return txt; }
}

/* ============================================================
   5. COMPTE — inscription / connexion / deconnexion
   ============================================================ */
const ongletConnexionBtn = document.getElementById("ongletConnexionBtn");
const ongletInscriptionBtn = document.getElementById("ongletInscriptionBtn");
const formConnexion = document.getElementById("formConnexion");
const formInscription = document.getElementById("formInscription");

ongletConnexionBtn.onclick = function () {
  ongletConnexionBtn.classList.add("actif");
  ongletInscriptionBtn.classList.remove("actif");
  formConnexion.style.display = "block";
  formInscription.style.display = "none";
};
ongletInscriptionBtn.onclick = function () {
  ongletInscriptionBtn.classList.add("actif");
  ongletConnexionBtn.classList.remove("actif");
  formInscription.style.display = "block";
  formConnexion.style.display = "none";
};

document.getElementById("regBtn").onclick = function () {
  const pseudo = document.getElementById("regPseudo").value.trim();
  const pass = document.getElementById("regMotDePasse").value;
  const msg = document.getElementById("regMessage");
  msg.className = "message-etat";

  if (pseudo.length < 3) { msg.textContent = "Le pseudo doit faire au moins 3 caractères."; msg.classList.add("erreur"); return; }
  if (pass.length < 6) { msg.textContent = "Le mot de passe doit faire au moins 6 caractères."; msg.classList.add("erreur"); return; }

  const cle = pseudo.toLowerCase();
  const users = chargerUtilisateurs();
  if (users[cle]) { msg.textContent = "Ce pseudo est déjà pris."; msg.classList.add("erreur"); return; }

  // Le compte recupere les pieces/collection de la session invite en cours
  const invite = chargerInvite();
  users[cle] = {
    pseudo: pseudo,
    pass: obfusquer(pass),
    coins: invite.coins || 0,
    collection: invite.collection || [],
    lastSpin: invite.lastSpin || null,
    createdAt: new Date().toISOString()
  };
  sauverUtilisateurs(users);
  setSessionPseudo(cle);
  msg.textContent = "Compte créé ! Bienvenue.";
  msg.classList.add("succes");
  afficherEtatCompte();
};

document.getElementById("loginBtn").onclick = function () {
  const pseudo = document.getElementById("loginPseudo").value.trim();
  const pass = document.getElementById("loginMotDePasse").value;
  const msg = document.getElementById("loginMessage");
  msg.className = "message-etat";

  const cle = pseudo.toLowerCase();
  const users = chargerUtilisateurs();
  if (!users[cle] || users[cle].pass !== obfusquer(pass)) {
    msg.textContent = "Pseudo ou mot de passe incorrect.";
    msg.classList.add("erreur");
    return;
  }
  setSessionPseudo(cle);
  msg.textContent = "Connexion réussie !";
  msg.classList.add("succes");
  afficherEtatCompte();
};

document.getElementById("logoutBtn").onclick = function () {
  setSessionPseudo(null);
  afficherEtatCompte();
};

function afficherEtatCompte() {
  const session = getSessionPseudo();
  const deco = document.getElementById("compteDeconnecte");
  const conn = document.getElementById("compteConnecte");
  rafraichirSoldePieces();

  if (session) {
    const users = chargerUtilisateurs();
    const u = users[session];
    if (!u) { setSessionPseudo(null); afficherEtatCompte(); return; }
    deco.style.display = "none";
    conn.style.display = "block";
    document.getElementById("compteAvatar").textContent = u.pseudo.charAt(0).toUpperCase();
    document.getElementById("comptePseudo").textContent = u.pseudo;
    document.getElementById("comptePieces").textContent = (u.coins || 0) + " 🪙";
    document.getElementById("compteNbObjets").textContent = (u.collection || []).length;
    const d = u.createdAt ? new Date(u.createdAt) : null;
    document.getElementById("compteDepuis").textContent = d ? d.toLocaleDateString("fr-FR") : "—";

    const grille = document.getElementById("maCollectionGrille");
    grille.innerHTML = "";
    const collection = u.collection || [];
    for (let i = 0; i < 10; i++) {
      const idObjet = collection[i];
      const objetInfo = idObjet ? BOUTIQUE.find(o => o.id === idObjet) : null;
      const div = document.createElement("div");
      div.className = "collection-case" + (objetInfo ? "" : " vide");
      div.textContent = objetInfo ? objetInfo.icone : "•";
      grille.appendChild(div);
    }
  } else {
    deco.style.display = "block";
    conn.style.display = "none";
  }
}
afficherEtatCompte();

/* ============================================================
   6. CALCULATEUR "QUEL JOUR ?" (page Accueil)
   ============================================================ */
document.getElementById("aujourdhuiBtn").onclick = function () {
  const t = new Date();
  document.getElementById("jourInput").value = t.getDate();
  document.getElementById("moisInput").value = t.getMonth() + 1;
  document.getElementById("anneeInput").value = t.getFullYear();
};

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
  if ((t.getMonth() + 1) < mois || ((t.getMonth() + 1) === mois && t.getDate() < jour)) {
    age -= 1;
  }
  return age;
}

const DATES_CLES = [
  { jour: 1, mois: 1, label: "Nouvel An" },
  { jour: 27, mois: 4, label: "Indépendance du Togo" },
  { jour: 1, mois: 5, label: "Fête du Travail" },
  { jour: 15, mois: 8, label: "Assomption" },
  { jour: 1, mois: 11, label: "Toussaint" },
  { jour: 25, mois: 12, label: "Noël" }
];
function afficherDatesCles(annee) {
  document.getElementById("anneeDatesCles").textContent = annee;
  const liste = document.getElementById("listeDatesCles");
  liste.innerHTML = DATES_CLES.map(d => {
    const idx = calculerJourSemaine(d.jour, d.mois, annee);
    return `<div class="date-cle"><span>${d.label} (${d.jour}/${d.mois})</span><span class="jour-nom">${NOMS_JOURS[idx]}</span></div>`;
  }).join("");
  document.getElementById("blocDatesCles").style.display = "block";
}

function afficherCalendrier(jour, mois, annee) {
  document.getElementById("calendrierEntetes").innerHTML = NOMS_JOURS_COURTS.map(j => `<span>${j}</span>`).join("");
  const premierJourIndex = calculerJourSemaine(1, mois, annee);
  const totalJours = joursDansLeMois(mois, annee);
  let html = "";
  for (let i = 0; i < premierJourIndex; i++) html += `<div class="jour-case vide"></div>`;
  for (let j = 1; j <= totalJours; j++) {
    html += `<div class="jour-case ${j === jour ? "actif" : ""}">${j}</div>`;
  }
  document.getElementById("calendrierGrille").innerHTML = html;
  document.getElementById("blocCalendrier").style.display = "block";
}

let dernierTexteResultat = "";
document.getElementById("copierBtn").onclick = function () {
  navigator.clipboard.writeText(dernierTexteResultat).then(() => {
    const btn = document.getElementById("copierBtn");
    const original = btn.textContent;
    btn.textContent = "✅ Copié !";
    setTimeout(() => { btn.textContent = original; }, 1500);
  });
};
if (navigator.share) {
  document.getElementById("partagerBtn").style.display = "inline-block";
  document.getElementById("partagerBtn").onclick = function () {
    navigator.share({ text: dernierTexteResultat }).catch(() => {});
  };
}

document.getElementById("calculerBtn").onclick = function () {
  document.getElementById("extraZone").classList.remove("visible");
  document.getElementById("carteAge").style.display = "none";
  document.getElementById("carteSigne").style.display = "none";
  document.getElementById("blocCalendrier").style.display = "none";
  document.getElementById("blocDatesCles").style.display = "none";
  document.getElementById("partageBoutons").style.display = "none";

  const resAffiche = document.getElementById("resultatAffiche");
  resAffiche.classList.remove("apparait");

  if (document.getElementById("jourInput").value === "" || document.getElementById("moisInput").value === "" || document.getElementById("anneeInput").value === "") {
    resAffiche.textContent = "Merci de remplir les 3 champs.";
    void resAffiche.offsetWidth;
    resAffiche.classList.add("apparait");
    return;
  }

  let jour = Number(document.getElementById("jourInput").value);
  let moisTape = Number(document.getElementById("moisInput").value);
  let anneeComplete = Number(document.getElementById("anneeInput").value);

  if (anneeComplete < 1) {
    resAffiche.textContent = "Année invalide.";
    void resAffiche.offsetWidth;
    resAffiche.classList.add("apparait");
    return;
  }
  if (moisTape < 1 || moisTape > 12) {
    resAffiche.textContent = "Mois invalide.";
    void resAffiche.offsetWidth;
    resAffiche.classList.add("apparait");
    return;
  }
  const maxJour = joursDansLeMois(moisTape, anneeComplete);
  if (jour < 1 || jour > maxJour) {
    resAffiche.textContent = "Date invalide.";
    void resAffiche.offsetWidth;
    resAffiche.classList.add("apparait");
    return;
  }

  const jourSemaine = calculerJourSemaine(jour, moisTape, anneeComplete);
  const resultatFinal = NOMS_JOURS[jourSemaine];
  resAffiche.innerHTML = "Le jour correspondant est :<br><span class='jourColore'>" + resultatFinal + "</span>";
  void resAffiche.offsetWidth;
  resAffiche.classList.add("apparait");

  dernierTexteResultat = `Le ${jour} ${NOMS_MOIS[moisTape]} ${anneeComplete} était un ${resultatFinal}.`;
  document.getElementById("partageBoutons").style.display = "flex";

  const age = calculerAge(jour, moisTape, anneeComplete);
  if (age >= 0) {
    document.getElementById("ageTexte").textContent = age + " an" + (age > 1 ? "s" : "");
    document.getElementById("carteAge").style.display = "flex";
  }

  const signe = calculerSigne(jour, moisTape);
  document.getElementById("signeSymbole").textContent = signe.symbole;
  document.getElementById("signeTexte").textContent = "Signe astrologique : " + signe.nom;
  document.getElementById("carteSigne").style.display = "flex";

  afficherCalendrier(jour, moisTape, anneeComplete);
  afficherDatesCles(anneeComplete);

  document.getElementById("extraZone").classList.add("visible");
};

document.getElementById("resetBtn").onclick = function () {
  document.getElementById("jourInput").value = "";
  document.getElementById("moisInput").value = "";
  document.getElementById("anneeInput").value = "";
  document.getElementById("resultatAffiche").textContent = "";
  document.getElementById("resultatAffiche").classList.remove("apparait");
  document.getElementById("extraZone").classList.remove("visible");
  document.getElementById("partageBoutons").style.display = "none";
};

/* ============================================================
   7. NAVIGATION ENTRE LES JEUX (menu <-> sous-jeux)
   ============================================================ */
document.querySelectorAll(".jeu-carte").forEach(carte => {
  carte.addEventListener("click", () => {
    ouvrirSousPage("jeu-" + carte.dataset.jeu);
    if (carte.dataset.jeu === "quiz") demarrerQuiz();
    if (carte.dataset.jeu === "memoire") demarrerMemoire();
    if (carte.dataset.jeu === "roue") initRoue();
  });
});
document.querySelectorAll(".retour-btn").forEach(btn => {
  btn.addEventListener("click", () => ouvrirSousPage(btn.dataset.retour));
});
function ouvrirSousPage(id) {
  document.querySelectorAll("#page-jeux .sous-page").forEach(p => p.classList.remove("actif"));
  document.getElementById(id).classList.add("actif");
}

/* ---- Jeu 1 : "Devine le jour !" ---- */
let jeuBonnes = 0;
let jeuTotal = 0;
let jeuDateActuelle = {};

function dateAleatoire() {
  const annee = 1950 + Math.floor(Math.random() * 100);
  const mois = 1 + Math.floor(Math.random() * 12);
  const jour = 1 + Math.floor(Math.random() * joursDansLeMois(mois, annee));
  return { jour, mois, annee };
}

function nouvelleQuestionJeu() {
  jeuDateActuelle = dateAleatoire();
  document.getElementById("jeuDateTexte").textContent =
    `${jeuDateActuelle.jour} ${NOMS_MOIS[jeuDateActuelle.mois]} ${jeuDateActuelle.annee}`;
  document.getElementById("jeuFeedback").textContent = "";

  const reponses = document.getElementById("jeuReponses");
  reponses.innerHTML = "";
  NOMS_JOURS_COURTS.forEach((nomCourt, index) => {
    const btn = document.createElement("button");
    btn.textContent = nomCourt;
    btn.onclick = function () { repondreJeu(index, btn); };
    reponses.appendChild(btn);
  });
}

function repondreJeu(indexChoisi, boutonClique) {
  const bonneReponse = calculerJourSemaine(jeuDateActuelle.jour, jeuDateActuelle.mois, jeuDateActuelle.annee);
  jeuTotal++;

  const tousLesBoutons = document.querySelectorAll("#jeuReponses button");
  tousLesBoutons.forEach(b => b.disabled = true);

  if (indexChoisi === bonneReponse) {
    jeuBonnes++;
    boutonClique.classList.add("bonne");
    const gagne = ajouterPieces(10);
    document.getElementById("jeuFeedback").textContent = "✅ Bravo, c'était bien " + NOMS_JOURS[bonneReponse] + " ! +10 🪙";
  } else {
    boutonClique.classList.add("mauvaise");
    tousLesBoutons[bonneReponse].classList.add("bonne");
    document.getElementById("jeuFeedback").textContent = "❌ Raté, c'était " + NOMS_JOURS[bonneReponse] + ".";
  }

  document.getElementById("jeuScore").textContent = `Score : ${jeuBonnes} / ${jeuTotal}`;
}
document.getElementById("jeuNouvelleBtn").onclick = nouvelleQuestionJeu;
nouvelleQuestionJeu();

/* ---- Jeu 2 : Quiz Culture ---- */
const QUIZ_TAILLE = 5;
let quizQuestions = [];
let quizIndex = 0;
let quizBonnes = 0;

function melanger(tableau) {
  const t = tableau.slice();
  for (let i = t.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [t[i], t[j]] = [t[j], t[i]];
  }
  return t;
}

function demarrerQuiz() {
  quizQuestions = melanger(QUIZ).slice(0, QUIZ_TAILLE);
  quizIndex = 0;
  quizBonnes = 0;
  document.getElementById("quizScore").textContent = "Score : 0 / 0";
  afficherQuestionQuiz();
}

function afficherQuestionQuiz() {
  document.getElementById("quizFeedback").textContent = "";
  if (quizIndex >= quizQuestions.length) {
    document.getElementById("quizProgression").textContent = "Quiz terminé !";
    document.getElementById("quizQuestion").textContent =
      `Tu as obtenu ${quizBonnes} / ${quizQuestions.length}. Relance une partie pour rejouer.`;
    document.getElementById("quizChoix").innerHTML = "";
    document.getElementById("quizSuivanteBtn").textContent = "Recommencer ▶";
    return;
  }
  document.getElementById("quizSuivanteBtn").textContent = "Suivante ▶";
  const q = quizQuestions[quizIndex];
  document.getElementById("quizProgression").textContent = `Question ${quizIndex + 1} / ${quizQuestions.length} — ${q.categorie}`;
  document.getElementById("quizQuestion").textContent = q.question;
  const zone = document.getElementById("quizChoix");
  zone.innerHTML = "";
  q.choix.forEach((choix, i) => {
    const btn = document.createElement("button");
    btn.textContent = choix;
    btn.onclick = () => repondreQuiz(i, btn);
    zone.appendChild(btn);
  });
}

function repondreQuiz(indexChoisi, boutonClique) {
  const q = quizQuestions[quizIndex];
  const boutons = document.querySelectorAll("#quizChoix button");
  boutons.forEach(b => b.disabled = true);

  if (indexChoisi === q.bonne) {
    quizBonnes++;
    boutonClique.classList.add("bonne");
    ajouterPieces(15);
    document.getElementById("quizFeedback").textContent = "✅ Bonne réponse ! +15 🪙";
  } else {
    boutonClique.classList.add("mauvaise");
    boutons[q.bonne].classList.add("bonne");
    document.getElementById("quizFeedback").textContent = "❌ La bonne réponse était : " + q.choix[q.bonne];
  }
  document.getElementById("quizScore").textContent = `Score : ${quizBonnes} / ${quizIndex + 1}`;
}

document.getElementById("quizSuivanteBtn").onclick = function () {
  if (quizIndex >= quizQuestions.length) {
    demarrerQuiz();
  } else {
    quizIndex++;
    afficherQuestionQuiz();
  }
};

/* ---- Jeu 3 : Mémoire Antique ---- */
let memoCartes = [];
let memoRetournees = [];
let memoPairesTrouvees = 0;
let memoCoups = 0;
let memoBloque = false;

function demarrerMemoire() {
  const symboles = melanger(MEMO_SYMBOLES).slice(0, 8);
  memoCartes = melanger([...symboles, ...symboles]).map(s => ({ symbole: s, trouvee: false }));
  memoRetournees = [];
  memoPairesTrouvees = 0;
  memoCoups = 0;
  memoBloque = false;
  document.getElementById("memoCoups").textContent = "Coups : 0";
  document.getElementById("memoPaires").textContent = "Paires : 0 / 8";
  document.getElementById("memoRecompense").textContent = "";
  rendreGrilleMemoire();
}

function rendreGrilleMemoire() {
  const grille = document.getElementById("memoGrille");
  grille.innerHTML = "";
  memoCartes.forEach((carte, index) => {
    const div = document.createElement("div");
    div.className = "memo-carte" + (carte.trouvee ? " trouvee" : "") + (memoRetournees.includes(index) ? " visible" : "");
    div.textContent = carte.trouvee || memoRetournees.includes(index) ? carte.symbole : "";
    div.onclick = () => cliquerCarteMemoire(index);
    grille.appendChild(div);
  });
}

function cliquerCarteMemoire(index) {
  if (memoBloque) return;
  if (memoCartes[index].trouvee || memoRetournees.includes(index)) return;
  if (memoRetournees.length >= 2) return;

  memoRetournees.push(index);
  rendreGrilleMemoire();

  if (memoRetournees.length === 2) {
    memoCoups++;
    document.getElementById("memoCoups").textContent = "Coups : " + memoCoups;
    const [a, b] = memoRetournees;
    if (memoCartes[a].symbole === memoCartes[b].symbole) {
      memoCartes[a].trouvee = true;
      memoCartes[b].trouvee = true;
      memoPairesTrouvees++;
      memoRetournees = [];
      document.getElementById("memoPaires").textContent = `Paires : ${memoPairesTrouvees} / 8`;
      rendreGrilleMemoire();
      if (memoPairesTrouvees === 8) terminerMemoire();
    } else {
      memoBloque = true;
      setTimeout(() => {
        memoRetournees = [];
        memoBloque = false;
        rendreGrilleMemoire();
      }, 700);
    }
  }
}

function terminerMemoire() {
  // Recompense degressive selon le nombre de coups (moins de coups = plus de pieces)
  const gain = Math.max(30, 150 - Math.max(0, memoCoups - 8) * 8);
  ajouterPieces(gain);
  document.getElementById("memoRecompense").textContent = `🎉 Grille terminée en ${memoCoups} coups ! +${gain} 🪙`;
}

document.getElementById("memoRejouerBtn").onclick = demarrerMemoire;

/* ---- Jeu 4 : Roue de la Fortune (1 tour gratuit / jour) ---- */
function dateDuJour() {
  return new Date().toISOString().slice(0, 10);
}
function initRoue() {
  const profil = getProfil();
  const roue = document.getElementById("roue");
  const btn = document.getElementById("roueLancerBtn");
  const attente = document.getElementById("roueAttente");
  // On coupe la transition le temps de remettre la roue a 0, pour ne pas
  // rejouer une animation de retour en arriere a chaque ouverture de la page.
  roue.style.transition = "none";
  roue.style.transform = "rotate(0deg)";
  void roue.offsetWidth;
  roue.style.transition = "";
  document.getElementById("roueResultat").textContent = "";

  if (profil.data.lastSpin === dateDuJour()) {
    btn.style.display = "none";
    attente.style.display = "block";
  } else {
    btn.style.display = "block";
    attente.style.display = "none";
  }
}
document.getElementById("roueLancerBtn").onclick = function () {
  const btn = document.getElementById("roueLancerBtn");
  btn.disabled = true;

  const indexGagnant = Math.floor(Math.random() * ROUE_SEGMENTS.length);
  const gain = ROUE_SEGMENTS[indexGagnant];
  const angleSegment = 360 / ROUE_SEGMENTS.length;
  // on vise le milieu du segment gagnant, + plusieurs tours complets pour l'effet
  const angleFinal = 360 * 5 + (360 - (indexGagnant * angleSegment + angleSegment / 2));

  const roue = document.getElementById("roue");
  roue.style.transform = `rotate(${angleFinal}deg)`;

  setTimeout(() => {
    ajouterPieces(gain);
    document.getElementById("roueResultat").textContent = `🎉 Tu as gagné ${gain} 🪙 !`;
    const profil = getProfil();
    profil.data.lastSpin = dateDuJour();
    sauverProfil(profil);
    btn.style.display = "none";
    document.getElementById("roueAttente").style.display = "block";
  }, 3300);
};

/* ============================================================
   8. BOUTIQUE
   ============================================================ */
let boutiqueFiltreActuel = "tous";
document.querySelectorAll("#boutiqueFiltres .filtre-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("#boutiqueFiltres .filtre-btn").forEach(b => b.classList.remove("actif"));
    btn.classList.add("actif");
    boutiqueFiltreActuel = btn.dataset.filtre;
    rendreBoutique();
  });
});

function rendreBoutique() {
  const grille = document.getElementById("objetGrille");
  grille.innerHTML = "";
  const items = BOUTIQUE.filter(o => boutiqueFiltreActuel === "tous" || o.rarete === boutiqueFiltreActuel);

  items.forEach(objet => {
    const possede = possedeObjet(objet.id);
    const div = document.createElement("div");
    div.className = "objet-carte rarete-" + objet.rarete;
    div.innerHTML = `
      <span class="objet-icone">${objet.icone}</span>
      <div class="objet-nom">${objet.nom}</div>
      <div class="objet-rarete ${objet.rarete}">${objet.rarete}</div>
      <div class="objet-prix">${possede ? "Acquis" : objet.prix + " 🪙"}</div>
      <button class="objet-btn ${possede ? "possede" : ""}" ${possede ? "disabled" : ""}>${possede ? "✔ Possédé" : "Acheter"}</button>
    `;
    div.title = objet.desc;
    if (!possede) {
      div.querySelector(".objet-btn").onclick = () => acheterObjet(objet);
    }
    grille.appendChild(div);
  });
}

function acheterObjet(objet) {
  if (depenserPieces(objet.prix)) {
    ajouterAlaCollection(objet.id);
    rendreBoutique();
    afficherEtatCompte();
  } else {
    alert("Pas assez de pièces 🪙 pour acheter " + objet.nom + ". Va gagner des pièces dans les jeux !");
  }
}
rendreBoutique();

/* ============================================================
   9. DICTIONNAIRE
   ============================================================ */
let dicoFiltreActuel = "tous";
let dicoRechercheActuelle = "";

document.querySelectorAll("#dicoFiltres .filtre-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("#dicoFiltres .filtre-btn").forEach(b => b.classList.remove("actif"));
    btn.classList.add("actif");
    dicoFiltreActuel = btn.dataset.filtre;
    rendreDictionnaire();
  });
});
document.getElementById("dicoRecherche").addEventListener("input", (e) => {
  dicoRechercheActuelle = e.target.value.trim().toLowerCase();
  rendreDictionnaire();
});

function rendreDictionnaire() {
  const zone = document.getElementById("dicoListe");
  const items = DICTIONNAIRE.filter(d => {
    const okCat = dicoFiltreActuel === "tous" || d.categorie === dicoFiltreActuel;
    const okRecherche = !dicoRechercheActuelle || d.terme.toLowerCase().includes(dicoRechercheActuelle) || d.definition.toLowerCase().includes(dicoRechercheActuelle);
    return okCat && okRecherche;
  });

  if (items.length === 0) {
    zone.innerHTML = `<p class="intro">Aucun terme ne correspond à ta recherche.</p>`;
    return;
  }

  zone.innerHTML = items.map(d => `
    <div class="dico-entree">
      <span class="dico-terme">${d.terme}</span><span class="dico-cat">${d.categorie}</span>
      <div class="dico-def">${d.definition}</div>
    </div>
  `).join("");
}
rendreDictionnaire();

/* ============================================================
   10. AUTEURS
   ============================================================ */
function rendreAuteurs() {
  const zone = document.getElementById("auteursListe");
  zone.innerHTML = AUTEURS.map(a => `
    <div class="carte auteur-carte">
      <span class="auteur-icone">${a.icone}</span>
      <div>
        <div class="auteur-nom">${a.nom}</div>
        <div class="auteur-meta">${a.periode} · ${a.domaine}</div>
        <div class="auteur-bio">${a.bio}</div>
      </div>
    </div>
  `).join("");
}
rendreAuteurs();

/* ============================================================
   11. ACTUS / PUBLICATIONS (espace reserve a P.Scalium ggg)
   ============================================================ */
function afficherPosts(posts) {
  const zone = document.getElementById("postsListe");
  if (!posts || !posts.length) {
    zone.innerHTML = `<p class="intro">Aucune publication pour l'instant.</p>`;
    return;
  }
  const tries = posts.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
  zone.innerHTML = tries.map(p => `
    <div class="carte post-carte">
      <div class="post-titre">${p.titre}</div>
      <div class="post-date">${new Date(p.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</div>
      <div class="post-corps">${p.corps}</div>
    </div>
  `).join("");
}
function chargerPosts() {
  fetch("/content/posts.json")
    .then(reponse => {
      if (!reponse.ok) throw new Error("posts.json introuvable");
      return reponse.json();
    })
    .then(donnees => afficherPosts(donnees.posts || []))
    .catch(() => afficherPosts([]));
}
chargerPosts();

/* ============================================================
   12. INITIALISATION FINALE
   ============================================================ */
rafraichirSoldePieces();
