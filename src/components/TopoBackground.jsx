// ============================================================
// TopoBackground — Pattern topographique angulaire
// Réf : Hilbert WM / ForwardQuant — chevrons concentriques
// Polygones irréguliers propres depuis focaux aux coins + centre
// SVG statique pur — zéro animation, zéro dépendance
// ============================================================

/**
 * Génère un anneau polygonal angulaire irrégulier.
 * Les sommets sont inégalement répartis en angle → donne le caractère angulaire
 * Variation de rayon FAIBLE → polygone, pas étoile
 */
function angularPoly(cx, cy, r, angleOffsets, radiusScale, twist) {
  const pts = [];
  const N = angleOffsets.length;
  for (let i = 0; i <= N; i++) {
    const idx = i % N;
    const angle = angleOffsets[idx] + twist;
    const rr = r * radiusScale[idx];
    pts.push(`${(cx + rr * Math.cos(angle)).toFixed(2)},${(cy + rr * Math.sin(angle)).toFixed(2)}`);
  }
  return pts.join(" ");
}

// Convertit degrés → radians
const d2r = (d) => (d * Math.PI) / 180;

/**
 * Chaque focal définit sa propre "signature" angulaire :
 * un template de sommets avec angles inégaux + facteurs rayon légèrement variables
 * → donne à chaque groupe de contours sa forme unique
 */
function buildPattern(W, H) {
  const foci = [
    // ── COIN HAUT GAUCHE ──
    {
      cx: 0, cy: 0,
      // Angles non uniformes → forme angulaire irrégulière
      angles: [d2r(15), d2r(65), d2r(105), d2r(155), d2r(210), d2r(265), d2r(310), d2r(355)],
      rScale: [1.00, 0.82, 1.00, 0.85, 1.00, 0.80, 1.00, 0.88],
      rings: 36, step: 13, rotStep: 0.004,
    },
    // ── COIN HAUT DROIT ──
    {
      cx: W, cy: 0,
      angles: [d2r(20), d2r(75), d2r(125), d2r(170), d2r(215), d2r(275), d2r(320), d2r(360)],
      rScale: [1.00, 0.85, 1.00, 0.80, 1.00, 0.83, 1.00, 0.87],
      rings: 34, step: 13, rotStep: 0.004,
    },
    // ── COIN BAS GAUCHE ──
    {
      cx: 0, cy: H,
      angles: [d2r(10), d2r(60), d2r(110), d2r(165), d2r(205), d2r(260), d2r(315), d2r(358)],
      rScale: [1.00, 0.83, 1.00, 0.86, 1.00, 0.82, 1.00, 0.85],
      rings: 34, step: 13, rotStep: 0.005,
    },
    // ── COIN BAS DROIT ──
    {
      cx: W, cy: H,
      angles: [d2r(25), d2r(70), d2r(120), d2r(172), d2r(218), d2r(268), d2r(318), d2r(5)],
      rScale: [1.00, 0.84, 1.00, 0.81, 1.00, 0.84, 1.00, 0.86],
      rings: 32, step: 13, rotStep: 0.005,
    },

    // ── MILIEU BORD HAUT ──
    {
      cx: W * 0.48, cy: 0,
      angles: [d2r(5), d2r(55), d2r(110), d2r(160), d2r(200), d2r(255), d2r(305), d2r(350)],
      rScale: [1.00, 0.82, 1.00, 0.83, 1.00, 0.81, 1.00, 0.84],
      rings: 28, step: 12, rotStep: 0.003,
    },
    // ── MILIEU BORD BAS ──
    {
      cx: W * 0.52, cy: H,
      angles: [d2r(15), d2r(62), d2r(115), d2r(168), d2r(212), d2r(262), d2r(312), d2r(358)],
      rScale: [1.00, 0.83, 1.00, 0.82, 1.00, 0.83, 1.00, 0.85],
      rings: 28, step: 12, rotStep: 0.003,
    },

    // ── FOCAUX INTÉRIEURS (milieu de l'écran) ──
    {
      cx: W * 0.28, cy: H * 0.28,
      angles: [d2r(20), d2r(68), d2r(118), d2r(165), d2r(215), d2r(268), d2r(318), d2r(2)],
      rScale: [1.00, 0.84, 1.00, 0.82, 1.00, 0.85, 1.00, 0.83],
      rings: 22, step: 12, rotStep: 0.004,
    },
    {
      cx: W * 0.78, cy: H * 0.20,
      angles: [d2r(12), d2r(58), d2r(112), d2r(158), d2r(208), d2r(258), d2r(308), d2r(352)],
      rScale: [1.00, 0.83, 1.00, 0.84, 1.00, 0.82, 1.00, 0.85],
      rings: 20, step: 12, rotStep: 0.005,
    },
    {
      cx: W * 0.18, cy: H * 0.70,
      angles: [d2r(18), d2r(65), d2r(115), d2r(162), d2r(212), d2r(260), d2r(310), d2r(355)],
      rScale: [1.00, 0.85, 1.00, 0.81, 1.00, 0.84, 1.00, 0.86],
      rings: 20, step: 11, rotStep: 0.004,
    },
    {
      cx: W * 0.72, cy: H * 0.65,
      angles: [d2r(22), d2r(72), d2r(122), d2r(170), d2r(220), d2r(272), d2r(320), d2r(8)],
      rScale: [1.00, 0.82, 1.00, 0.85, 1.00, 0.82, 1.00, 0.84],
      rings: 20, step: 11, rotStep: 0.005,
    },
  ];

  return foci.flatMap(({ cx, cy, angles, rScale, rings, step, rotStep }) =>
    Array.from({ length: rings }, (_, i) => {
      const r = 12 + i * step;
      const twist = i * rotStep; // micro-rotation anneau par anneau
      return angularPoly(cx, cy, r, angles, rScale, twist);
    })
  );
}

// ─── Version image ───
// Charge le vrai pattern Figma déposé dans /public/images/
const PATTERN_URL = "/images/fwu-pattern.webp";

import { useState } from "react";

export default function TopoBackground({ opacity = 0.1 }) {
  const [imgFailed, setImgFailed] = useState(false);
  const W = 900;
  const H = 1700;
  const paths = buildPattern(W, H);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
      {/* Image réelle (fwu-pattern.webp) — prioritaire */}
      {!imgFailed && (
        <img
          src={PATTERN_URL}
          alt=""
          onError={() => setImgFailed(true)}
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            objectFit: "cover", opacity,
            pointerEvents: "none",
          }}
        />
      )}
      {/* Fallback SVG généré — uniquement si l'image échoue */}
      {imgFailed && (
        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: "100%", height: "100%", opacity, position: "absolute", inset: 0 }}
        >
          {paths.map((pts, i) => (
            <polyline key={i} points={pts} fill="none" stroke="white"
              strokeWidth="0.7" strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit="10" />
          ))}
        </svg>
      )}
    </div>
  );
}
