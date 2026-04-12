// ============================================================
// CABINET CONFIG — Marque blanche centralisée
// V1 : fichier statique — modifier ici pour changer le branding
// V2 : ce fichier devient dynamique, chargé depuis Supabase
//       table `cabinets` → chaque cabinet gère son branding
//       depuis le Backoffice sans toucher au code
// ============================================================

const cabinetConfig = {
  // --- Identité cabinet ---
  name: "Hilbert Wealth Management",
  nameShort: "Hilbert",
  tagline: "Conseil en Gestion de Patrimoine",
  logoUrl: "/images/Logo_HWM_white%201.png", // logo blanc sur fonds sombres
  faviconUrl: "/icons/favicon.ico",

  // --- Branding couleurs ---
  colors: {
    // Fonds par page — gradient principal commun à toutes les pages
    pageGradient: "linear-gradient(180deg, #133248 0%, #488ecd 100%)",
    homeBackground: "#2690D2",          // fallback solid (sidebar desktop)
    portefeuilleBackground: "#133248",  // fallback solid (sidebar desktop)
    documentsBackground: "#1A5276",
    contactBackground: "#DB8648",
    actualitesBackground: "#1A3A5C",
    loginBackground: "#133248",

    // Couleurs système
    primary: "#2690D2",
    primaryLight: "#72C1F4",
    gradientStart: "#133248",
    gradientEnd: "#488ecd",
    accent: "#DB8648",
    accentDark: "#A37757",

    // Performance
    perfGreen: "#00f072",       // vert vif Figma (performances produits)
    perfGreenMuted: "#93b9a5",  // vert doux (carte investissement principale)

    // Texte sur fond blanc (cartes)
    nameGradient: "linear-gradient(90deg, #133248 0%, #2e79ae 100%)",

    // Neutres
    white: "#FFFFFF",
    textDark: "#1c1d1e",
    textLight: "#676767",
    cardBackground: "rgba(255, 255, 255, 0.97)",
    cardBorder: "rgba(255, 255, 255, 0.2)",
    overlay: "rgba(0, 0, 0, 0.3)",
  },

  // --- Typographie ---
  // Poppins — pack complet Extra Light (200) → Black (900)
  fonts: {
    heading: "'Poppins', sans-serif",  // titres, montants — weights 600/700
    body: "'Poppins', sans-serif",     // corps, UI — weights 300/400/500
    // Weights disponibles : 200/300/400/500/600/700/800/900 + italiques
    googleFontsUrl:
      "https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap",
  },

  // --- Transitions entre pages ---
  transitions: {
    duration: "0.6s",
    easing: "ease-in-out",
  },

  // --- Coordonnées générales du cabinet ---
  cabinet: {
    telephone: "+33 1 00 00 00 00",
    email: "contact@hilbert-wm.com",
    adresse: "2 rue Turgot",
    codePostal: "75009",
    ville: "Paris",
    siteWeb: "https://hilbert-wm.com",
    horaires: "Lun – Ven  9h – 18h",
    // Lien Google Business avis — remplacer par l'URL réelle
    googleAvisUrl: "https://g.page/r/VOTRE_ID_GOOGLE/review",
  },

  // --- Conseiller référent (données mock — remplacé par Supabase en V2) ---
  // API: GET /api/cabinet/conseiller
  conseiller: {
    prenom: "Amandine",
    nom: "Frapier",
    titre: "Votre Conseiller en Gestion Privée",
    role: "High treasury manager",
    photoUrl: "/images/Photo%20CGP.png",
    disponibilite: "disponible", // "disponible" | "indisponible" | "conges"
    email: "test@hilbert-wm.com",
    telephone: {
      standard: "+33 1 00 00 00 00",
      mobile: "+33 1 00 00 00 00",
    },
    adresse: "2 rue Turgot, Paris 75009",
    linkedin: "https://linkedin.com",
  },

  // --- PWA ---
  pwa: {
    appName: "Hilbert WM",
    appNameShort: "Hilbert",
    themeColor: "#2690D2",
    backgroundColor: "#03334A",
    description: "Votre espace patrimoine personnel",
  },

  // --- URLs et domaine ---
  domain: "app.hilbert-wm.fr",
  supportEmail: "support@hilbert-wm.com",
};

export default cabinetConfig;
