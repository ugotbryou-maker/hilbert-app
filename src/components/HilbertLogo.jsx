// Hilbert WM — Logo officiel
// Utilise l'image réelle si disponible, fallback SVG sinon

const LOGO_WHITE_URL = "/images/Logo_HWM_white%201.png";

export default function HilbertLogo({ height = 40, white = true }) {
  // On utilise toujours la version blanche (le logo est conçu pour fonds sombres)
  // Pour fond clair (version couleur) — ajouter logo-hilbert-color.png en V2
  return (
    <img
      src={LOGO_WHITE_URL}
      alt="Hilbert Wealth Management"
      style={{
        height,
        width: "auto",
        objectFit: "contain",
        filter: white ? "none" : "brightness(0) saturate(100%) invert(30%) sepia(80%) saturate(500%) hue-rotate(180deg)",
      }}
      onError={(e) => {
        // Fallback SVG si l'image n'est pas trouvée
        e.currentTarget.style.display = "none";
        e.currentTarget.parentElement?.insertAdjacentHTML("afterbegin", `
          <div style="display:flex;align-items:center;gap:7px;height:${height}px">
            <svg height="${height}" viewBox="0 0 54 80" fill="none">
              <path d="M27 4 C38 4,50 12,50 26 C50 40,38 46,27 45 C16 46,4 40,4 26 C4 12,16 4,27 4Z"
                stroke="white" stroke-width="8" fill="none"/>
              <path d="M27 45 C38 44,50 50,50 64 C50 76,38 80,27 80 C16 80,4 76,4 64 C4 50,16 44,27 45Z"
                stroke="white" stroke-width="8" fill="none"/>
              <rect x="23" y="28" width="8" height="14" rx="2" fill="white"/>
              <rect x="23" y="48" width="8" height="14" rx="2" fill="white"/>
            </svg>
            <div style="display:flex;flex-direction:column;line-height:1.15">
              <span style="color:white;font-weight:700;font-size:${Math.round(height*0.35)}px;letter-spacing:0.14em;font-family:Poppins,sans-serif;text-transform:uppercase">HILBERT</span>
              <span style="color:white;font-weight:300;font-size:${Math.round(height*0.19)}px;letter-spacing:0.06em;font-family:Poppins,sans-serif;text-transform:uppercase;opacity:0.8">Wealth Management</span>
            </div>
          </div>
        `);
      }}
    />
  );
}
