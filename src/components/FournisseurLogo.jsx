// ============================================================
// FournisseurLogo — Logos assureurs / fournisseurs
// V1 : SVG/initiales inline
// V2 : chargement depuis /public/images/logo-{key}.png
//      → déposer les fichiers PNG pour activer le vrai logo
// ============================================================

// Mapping clé → fichier image dans /public/images/
// Les noms correspondent aux fichiers déposés par l'utilisateur
const LOGO_IMAGES = {
  generali: "/images/Assicurazioni_Generali_(logo).svg.png",
  hilbert:  "/images/logo-hilbert%20investment%20solutions.png",  // Hilbert IS
  spirica:  null,  // à ajouter
  perial:   null,  // à ajouter
  amundi:   null,  // à ajouter
  abeille:  "/images/Logo%20Abeille%20assurance.png",
};

// Couleurs de fallback par fournisseur
const FALLBACK_COLORS = {
  generali: "#CC0000",
  hilbert:  "#2690D2",
  spirica:  "#0057A8",
  perial:   "#004B6E",
  amundi:   "#00A651",
  abeille:  "#E2001A",
};

// Initiales de fallback
const FALLBACK_INITIALS = {
  generali: "GE",
  hilbert:  "HI",
  spirica:  "SP",
  perial:   "PA",
  amundi:   "AM",
  abeille:  "AB",
};

// ── Fallback SVG Hilbert (chaîne) ──
function HilbertSvg({ size }) {
  const color = "#2690D2";
  return (
    <svg width={size * 0.55} height={size * 0.75} viewBox="0 0 54 80" fill="none">
      <path d="M27 4 C38 4,50 12,50 26 C50 40,38 46,27 45 C16 46,4 40,4 26 C4 12,16 4,27 4Z"
        stroke={color} strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M27 45 C38 44,50 50,50 64 C50 76,38 80,27 80 C16 80,4 76,4 64 C4 50,16 44,27 45Z"
        stroke={color} strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="23" y="28" width="8" height="14" rx="2" fill={color}/>
      <rect x="23" y="48" width="8" height="14" rx="2" fill={color}/>
    </svg>
  );
}

// ── Initiales fallback ──
function InitialesLogo({ text, couleur, size }) {
  return (
    <span style={{
      color: couleur,
      fontWeight: 700,
      fontSize: size * 0.36,
      fontFamily: "'Poppins', sans-serif",
      lineHeight: 1,
    }}>
      {text}
    </span>
  );
}

/**
 * FournisseurLogo
 * Rendu à l'intérieur d'un conteneur gris (#e8e8e8) fourni par le parent.
 * Le composant renvoie uniquement le contenu (image / SVG / initiales).
 *
 * Props:
 *   fournisseurLogo  — clé: "generali" | "hilbert" | "spirica" | ...
 *   fournisseurCouleur — couleur hex du fournisseur
 *   nom              — nom texte (fallback initiales)
 *   size             — taille en px du logo (pas du conteneur)
 */
export default function FournisseurLogo({ fournisseurLogo, fournisseurCouleur, nom, size = 30 }) {
  const key = fournisseurLogo?.toLowerCase();
  const imgSrc = key ? (LOGO_IMAGES[key] ?? null) : null;
  const color = fournisseurCouleur || FALLBACK_COLORS[key] || "#2690D2";
  const initials = FALLBACK_INITIALS[key] || (nom || "?").slice(0, 2).toUpperCase();

  if (imgSrc) {
    return (
      <img
        src={imgSrc}
        alt={nom || key}
        onError={e => {
          // Si le fichier n'existe pas → afficher le SVG fallback
          e.currentTarget.style.display = "none";
          e.currentTarget.nextSibling?.style && (e.currentTarget.nextSibling.style.display = "flex");
        }}
        style={{
          width: size, height: "auto", maxHeight: size,
          objectFit: "contain",
        }}
      />
    );
  }

  if (key === "hilbert") return <HilbertSvg size={size} />;

  return <InitialesLogo text={initials} couleur={color} size={size} />;
}
