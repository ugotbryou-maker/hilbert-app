// ============================================================
// MOCK DATA — V1
// Structure API-ready. Remplacer par calls Supabase en V2.
// ============================================================

// API: GET /api/user/profile
export const mockUser = {
  id: "usr_001",
  prenom: "Ugo",
  nom: "Tamburrini",
  email: "test@hilbert-wm.fr",
  telephone: "+33 6 00 00 00 00",
  avatar: null, // API V2: Supabase Storage URL
  profilRisque: {
    label: "Conservateur",
    niveau: 1,
    description: "Préservation du capital, faible volatilité",
  },
  dateInscription: "2023-01-15",
  preferences: {
    notif_documents: true,
    notif_rdv: true,
    notif_performance: true,
    notif_actualites: true,
    notif_blog: true,
  },
};

// API: GET /api/portefeuille/synthese
export const mockPortefeuille = {
  valeurTotale: 250000,
  devise: "EUR",
  performanceGlobale: 8.0,
  performanceYTD: 3.2,
  dateValorisation: "2026-04-08",

  placements: [
    // ── INVESTISSEMENT ──
    {
      id: "plc_001",
      categorie: "investissement",
      nom: "Plan Épargne Retraite",
      sousTitre: "PER Generali particulier",
      nomCourt: "PER",
      fournisseur: "Generali",
      fournisseurLogo: "generali", // clé logo dans FOURNISSEUR_LOGOS
      fournisseurCouleur: "#CC0000",
      // API V2: connexion API Generali disponible
      typeActif: "retraite",
      valeur: 100000,
      performance: 8.0,
      allocationPct: 40,
      dateOuverture: "2021-03-01",
      documents: ["doc_003"],
      versementPossible: true,
      // Historique performance mock pour le mini-graphique
      historique: [
        { date: "2025-04", valeur: 88000 },
        { date: "2025-07", valeur: 91000 },
        { date: "2025-10", valeur: 94000 },
        { date: "2026-01", valeur: 97000 },
        { date: "2026-04", valeur: 100000 },
      ],
    },
    {
      id: "plc_002",
      categorie: "investissement",
      nom: "Assurance-vie",
      sousTitre: "Hilbert CMS 10 ans",
      nomCourt: "AV",
      fournisseur: "Hilbert",
      fournisseurLogo: "hilbert",
      fournisseurCouleur: "#2690D2",
      // API V2: connexion API Abeille Assurances disponible
      typeActif: "assurance-vie",
      valeur: 100000,
      performance: 8.0,
      allocationPct: 20,
      dateOuverture: "2020-06-15",
      documents: ["doc_002"],
      versementPossible: true,
      historique: [
        { date: "2025-04", valeur: 88000 },
        { date: "2025-07", valeur: 91500 },
        { date: "2025-10", valeur: 94000 },
        { date: "2026-01", valeur: 97500 },
        { date: "2026-04", valeur: 100000 },
      ],
    },
    {
      id: "plc_003",
      categorie: "investissement",
      nom: "Plan Épargne Retraite",
      sousTitre: "Generali",
      nomCourt: "PER2",
      fournisseur: "Generali",
      fournisseurLogo: "generali",
      fournisseurCouleur: "#CC0000",
      // API V2: connexion API Generali disponible
      typeActif: "retraite",
      valeur: 50000,
      performance: 6.5,
      allocationPct: 20,
      dateOuverture: "2022-01-10",
      documents: [],
      versementPossible: true,
      historique: [
        { date: "2025-04", valeur: 43000 },
        { date: "2025-07", valeur: 45000 },
        { date: "2025-10", valeur: 47000 },
        { date: "2026-01", valeur: 48500 },
        { date: "2026-04", valeur: 50000 },
      ],
    },

    // ── TRÉSORERIE ──
    {
      id: "plc_004",
      categorie: "tresorerie",
      nom: "Fonds euros",
      sousTitre: "Spirica Sécurité",
      nomCourt: "Fonds €",
      fournisseur: "Spirica",
      fournisseurLogo: "spirica",
      fournisseurCouleur: "#0057A8",
      // API V2: connexion API Spirica disponible
      typeActif: "fonds-euros",
      valeur: 25000,
      performance: 3.1,
      allocationPct: 10,
      dateOuverture: "2023-04-20",
      documents: [],
      versementPossible: true,
      historique: [
        { date: "2025-04", valeur: 23800 },
        { date: "2025-07", valeur: 24100 },
        { date: "2025-10", valeur: 24400 },
        { date: "2026-01", valeur: 24700 },
        { date: "2026-04", valeur: 25000 },
      ],
    },

    // ── IMMOBILIER ──
    {
      id: "plc_005",
      categorie: "immobilier",
      nom: "SCPI Patrimoine",
      sousTitre: "Perial Euro Patrimoine",
      nomCourt: "SCPI",
      fournisseur: "Perial AM",
      fournisseurLogo: "perial",
      fournisseurCouleur: "#004B6E",
      // API V2: connexion API Perial AM disponible
      typeActif: "immobilier",
      valeur: 75000,
      performance: 6.5,
      allocationPct: 30,
      dateOuverture: "2021-09-15",
      documents: [],
      versementPossible: false,
      historique: [
        { date: "2025-04", valeur: 68000 },
        { date: "2025-07", valeur: 70000 },
        { date: "2025-10", valeur: 72000 },
        { date: "2026-01", valeur: 73500 },
        { date: "2026-04", valeur: 75000 },
      ],
    },
  ],

  // API: GET /api/portefeuille/historique?periode=1A
  historique: {
    "1M": [
      { date: "2026-03-08", valeur: 244000 },
      { date: "2026-03-15", valeur: 245500 },
      { date: "2026-03-22", valeur: 246800 },
      { date: "2026-03-29", valeur: 247200 },
      { date: "2026-04-05", valeur: 248900 },
      { date: "2026-04-08", valeur: 250000 },
    ],
    "6M": [
      { date: "2025-10-08", valeur: 230000 },
      { date: "2025-11-08", valeur: 233000 },
      { date: "2025-12-08", valeur: 237000 },
      { date: "2026-01-08", valeur: 240000 },
      { date: "2026-02-08", valeur: 244000 },
      { date: "2026-03-08", valeur: 247000 },
      { date: "2026-04-08", valeur: 250000 },
    ],
    "1A": [
      { date: "2025-04-08", valeur: 215000 },
      { date: "2025-07-08", valeur: 225000 },
      { date: "2025-10-08", valeur: 230000 },
      { date: "2026-01-08", valeur: 240000 },
      { date: "2026-04-08", valeur: 250000 },
    ],
  },

  repartition: [
    { label: "Retraite", valeur: 40, couleur: "#2690D2" },
    { label: "Assurance-vie", valeur: 20, couleur: "#72C1F4" },
    { label: "Immobilier", valeur: 30, couleur: "#DB8648" },
    { label: "Fonds €", valeur: 10, couleur: "#A37757" },
  ],
};

// API: GET /api/documents
export const mockDocuments = [
  {
    id: "doc_001",
    nom: "Relevé annuel de performance",
    type: "releve",
    date: "2026-03-31",
    taille: "2.4 MB",
    fournisseur: "Hilbert WM",
    url: "#",
    lu: false,
    nouveau: true,
  },
  {
    id: "doc_002",
    nom: "Bulletin de situation Assurance-vie",
    type: "releve",
    date: "2026-01-15",
    taille: "1.1 MB",
    fournisseur: "Abeille Assurances",
    url: "#",
    lu: true,
    nouveau: false,
  },
  {
    id: "doc_003",
    nom: "Attestation PER 2025",
    type: "attestation",
    date: "2026-02-01",
    taille: "0.8 MB",
    fournisseur: "Generali",
    url: "#",
    lu: true,
    nouveau: false,
  },
  {
    id: "doc_004",
    nom: "IFU 2025 — Déclaration fiscale",
    type: "fiscal",
    date: "2026-02-28",
    taille: "1.5 MB",
    fournisseur: "Hilbert WM",
    url: "#",
    lu: false,
    nouveau: false,
  },
  {
    id: "doc_005",
    nom: "Rapport de conseil patrimonial",
    type: "rapport",
    date: "2025-12-10",
    taille: "3.2 MB",
    fournisseur: "Hilbert WM",
    url: "#",
    lu: true,
    nouveau: false,
  },
  {
    id: "doc_006",
    nom: "Contrat d'assurance-vie — Ouverture",
    type: "contrat",
    date: "2020-06-15",
    taille: "4.7 MB",
    fournisseur: "Abeille Assurances",
    url: "#",
    lu: true,
    nouveau: false,
  },
];

// API: GET /api/rdv
export const mockRendezVous = [
  {
    id: "rdv_001",
    type: "Bilan annuel",
    date: "2026-04-16",
    heure: "14:00",
    statut: "confirme",
    lieu: "Présentiel — Cabinet Hilbert",
    notes: "",
  },
  {
    id: "rdv_002",
    type: "Point trimestriel",
    date: "2026-06-10",
    heure: "10:30",
    statut: "en_attente",
    lieu: "Visioconférence",
    notes: "",
  },
];

// API: GET /api/actualites
export const mockActualites = [
  {
    id: "act_001",
    titre: "Newsletter patrimoine — Avril 2026",
    type: "Newsletter",
    tag: "Patrimoine",
    date: "2026-04-01",
    source: "Blog cabinet",
    tempsLecture: 4,
    imageUrl: null,
    extrait: "Découvrez notre analyse des marchés du premier trimestre et nos recommandations pour optimiser votre patrimoine...",
    url: "#",
  },
  {
    id: "act_002",
    titre: "Salon Patrimonia 2026 — Nous y serons",
    type: "Évènement",
    tag: "Patrimoine",
    date: "2026-04-05",
    source: "Blog cabinet",
    tempsLecture: 2,
    imageUrl: null,
    extrait: "Retrouvez l'équipe Hilbert au Salon Patrimonia les 24 et 25 septembre à Lyon...",
    url: "#",
  },
  {
    id: "act_003",
    titre: "La BCE maintient ses taux directeurs",
    type: "Marchés",
    tag: "Marchés",
    date: "2026-04-07",
    source: "Les Échos",
    tempsLecture: 3,
    imageUrl: null,
    extrait: "La Banque centrale européenne a annoncé hier le maintien de ses taux à 2.5%...",
    url: "#",
  },
  {
    id: "act_004",
    titre: "Immobilier : les SCPI résistent en 2026",
    type: "Immobilier",
    tag: "Immobilier",
    date: "2026-04-03",
    source: "Le Revenu",
    tempsLecture: 5,
    imageUrl: null,
    extrait: "Malgré un contexte de taux élevés, les SCPI de rendement affichent une performance moyenne de 5.2%...",
    url: "#",
  },
  {
    id: "act_005",
    titre: "PER : les avantages fiscaux en 2026",
    type: "Fiscalité",
    tag: "Fiscalité",
    date: "2026-03-28",
    source: "Blog cabinet",
    tempsLecture: 6,
    imageUrl: null,
    extrait: "Le Plan d'Épargne Retraite reste l'un des outils les plus efficaces pour réduire votre imposition...",
    url: "#",
  },
  {
    id: "act_006",
    titre: "Perspectives économiques — T2 2026",
    type: "Économie",
    tag: "Économie",
    date: "2026-04-06",
    source: "Boursorama",
    tempsLecture: 4,
    imageUrl: null,
    extrait: "Les indicateurs avancés suggèrent une reprise modérée de la croissance en zone euro pour le second trimestre...",
    url: "#",
  },
];

// API: GET /api/notifications
export const mockNotifications = [
  {
    id: "notif_001",
    type: "doc",
    titre: "Nouveau document",
    message: "Votre relevé annuel de performance est disponible",
    date: "2026-04-08",
    lu: false,
  },
  {
    id: "notif_002",
    type: "rdv",
    titre: "Rappel rendez-vous",
    message: "Bilan annuel le 16 avril à 14h00",
    date: "2026-04-07",
    lu: false,
  },
  {
    id: "notif_003",
    type: "perf",
    titre: "Performance",
    message: "Votre portefeuille a progressé de +8% cette année",
    date: "2026-04-01",
    lu: false,
  },
  {
    id: "notif_004",
    type: "news",
    titre: "Nouvelle publication",
    message: "Newsletter Patrimoine — Avril 2026 disponible",
    date: "2026-04-01",
    lu: true,
  },
];

// API: GET /api/creneaux?date=YYYY-MM-DD (V2 — Google Calendar / Calendly)
export const mockCreneaux = {
  "2026-04-20": ["09:00", "10:00", "14:00", "15:00", "16:00"],
  "2026-04-21": ["09:30", "11:00", "14:30"],
  "2026-04-22": ["10:00", "11:00", "15:00", "16:30"],
  "2026-04-23": ["09:00", "14:00"],
  "2026-04-27": ["10:00", "11:30", "14:00", "15:30"],
  "2026-04-28": ["09:00", "10:30", "14:00"],
};
