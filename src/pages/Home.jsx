import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import config from "../config/cabinet.config.js";
import { useSupabase } from "../hooks/useSupabase.js";
import FournisseurLogo from "../components/FournisseurLogo.jsx";

// ── Jauge profil risque (5 pilules) ──
function RiskGauge({ niveau, label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{
        fontSize: 11, color: "rgba(255,255,255,0.75)",
        fontFamily: config.fonts.body, fontWeight: 300,
      }}>
        Profil {label}
      </span>
      <div style={{ display: "flex", gap: 3 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} style={{
            width: 22, height: 5, borderRadius: 3,
            background: i < niveau ? "#fff" : "transparent",
            border: "1px solid rgba(255,255,255,0.5)",
          }} />
        ))}
      </div>
    </div>
  );
}

// ── Texte avec dégradé (#133248 → #2e79ae) ──
const GradText = ({ children, size = 12, weight = 600, style = {} }) => (
  <span style={{
    background: config.colors.nameGradient,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    fontSize: size, fontWeight: weight,
    fontFamily: config.fonts.body,
    lineHeight: 1.3,
    ...style,
  }}>
    {children}
  </span>
);

// ── Carte placement (Home + RDV + Doc) layout Figma ──
function PlacementCard({ plc, onClick }) {
  return (
    <div
      onClick={onClick}
      className="card-hover"
      style={{
        background: "#fff",
        borderRadius: 7,
        padding: "0 12px",
        height: 68,
        display: "flex", alignItems: "center", gap: 10,
        cursor: "pointer",
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
      }}
    >
      {/* Logo fournisseur */}
      <div style={{
        width: 43, height: 43, borderRadius: 5,
        background: "#e8e8e8", flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
      }}>
        <FournisseurLogo
          fournisseurLogo={plc.fournisseurLogo}
          fournisseurCouleur={plc.fournisseurCouleur}
          nom={plc.fournisseur}
          size={30}
        />
      </div>

      {/* Textes */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <GradText size={12} weight={600}>{plc.nom}</GradText>
        <div style={{ color: "#1c1d1e", fontSize: 10, fontWeight: 300, fontFamily: config.fonts.body, lineHeight: 1.3 }}>
          {plc.sousTitre || plc.fournisseur}
        </div>
        <div style={{ color: "#1c1d1e", fontSize: 12, fontWeight: 300, fontFamily: config.fonts.body, lineHeight: 1.3 }}>
          {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(plc.valeur)}
        </div>
      </div>

      {/* Performance */}
      <span style={{
        color: config.colors.perfGreen,
        fontSize: 15, fontWeight: 700,
        fontFamily: config.fonts.body, flexShrink: 0,
      }}>
        +{plc.performance}%
      </span>
    </div>
  );
}

const sectionTitle = (text) => (
  <h3 style={{
    margin: "0 0 8px",
    color: "#fff",
    fontFamily: config.fonts.body,
    fontSize: 16, fontWeight: 400,
  }}>
    {text}
  </h3>
);

export default function Home() {
  const navigate = useNavigate();
  const { fetchUser, fetchPortefeuille, fetchRendezVous, fetchDocuments, fetchActualites } = useSupabase();
  const [user, setUser] = useState(null);
  const [portefeuille, setPortefeuille] = useState(null);
  const [rdvs, setRdvs] = useState([]);
  const [newDoc, setNewDoc] = useState(null);
  const [actualites, setActualites] = useState([]);

  useEffect(() => {
    Promise.all([
      fetchUser(), fetchPortefeuille(), fetchRendezVous(), fetchDocuments(), fetchActualites(),
    ]).then(([u, p, r, d, a]) => {
      setUser(u);
      setPortefeuille(p);
      setRdvs(r);
      setNewDoc(d.find(doc => doc.nouveau) || null);
      setActualites(a.slice(0, 2));
    });
  }, []);

  const today = new Date();
  const dateStr = today.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const nextRdv = rdvs[0];
  const conseiller = config.conseiller;

  if (!user || !portefeuille) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "rgba(255,255,255,0.5)", fontFamily: config.fonts.body }}>
        Chargement...
      </div>
    );
  }

  const formatMontant = (n) =>
    new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="page-enter" style={{ padding: "12px 16px 24px", maxWidth: 480, margin: "0 auto" }}>

      {/* Date */}
      <p style={{
        color: "rgba(255,255,255,0.7)", fontSize: 11,
        margin: "0 0 2px", textAlign: "center",
        fontFamily: config.fonts.body, fontWeight: 200,
      }}>
        {dateStr}
      </p>

      {/* Bonjour — Poppins ExtraLight 200 */}
      <h1 style={{
        fontFamily: config.fonts.heading,
        color: "#fff", fontSize: 28,
        textAlign: "center", margin: "0 0 8px",
        fontWeight: 200,
      }}>
        Bonjour {user.prenom}
      </h1>

      {/* Profil risque */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
        <RiskGauge niveau={user.profilRisque.niveau} label={user.profilRisque.label} />
      </div>

      {/* Carte investissement */}
      <div style={{
        background: "#fff",
        borderRadius: 7,
        padding: "12px 16px",
        marginBottom: 10,
        boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
      }}>
        <p style={{
          margin: "0 0 6px", fontSize: 12,
          color: "#676767", fontFamily: config.fonts.body, fontWeight: 200,
        }}>
          Votre investissement
        </p>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
          {/* Montant avec dégradé */}
          <span style={{
            fontFamily: config.fonts.heading,
            fontSize: 30, fontWeight: 700,
            background: config.colors.nameGradient,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            {formatMontant(portefeuille.valeurTotale)}
          </span>
          <span style={{
            color: config.colors.perfGreenMuted,
            fontSize: 15, fontWeight: 700,
            fontFamily: config.fonts.body,
          }}>
            +{portefeuille.performanceGlobale}%
          </span>
        </div>
      </div>

      {/* 2 CTA pills */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <button
          onClick={() => navigate("/portefeuille")}
          style={{
            flex: 1, padding: "11px",
            borderRadius: 50,
            border: "1px solid rgba(255,255,255,0.7)",
            background: "transparent",
            color: "#fff",
            fontFamily: config.fonts.body, fontSize: 14, fontWeight: 200,
            cursor: "pointer",
          }}
        >
          Voir le détail
        </button>
        <button
          onClick={() => navigate("/contact")}
          style={{
            flex: 1, padding: "11px",
            borderRadius: 50,
            border: "2px solid #fff",
            background: "#fff",
            color: config.colors.gradientStart,
            fontFamily: config.fonts.body, fontSize: 14, fontWeight: 200,
            cursor: "pointer",
          }}
        >
          Contact
        </button>
      </div>

      {/* Mes placements */}
      {sectionTitle("Mes placements :")}
      <div className="stagger" style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
        {portefeuille.placements.slice(0, 2).map((plc) => (
          <PlacementCard
            key={plc.id}
            plc={plc}
            onClick={() => navigate("/portefeuille")}
          />
        ))}
      </div>

      {/* Prochains RDV */}
      {nextRdv && (
        <>
          {sectionTitle("Mes prochains rendez-vous")}
          <div
            onClick={() => navigate("/contact")}
            style={{
              background: "#fff",
              borderRadius: 7, height: 68,
              padding: "0 12px",
              display: "flex", alignItems: "center", gap: 10,
              cursor: "pointer", marginBottom: 16,
              boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
            }}
          >
            {/* Photo conseiller (circular) */}
            <div style={{
              width: 44, height: 44, borderRadius: "50%",
              background: "#e8e8e8", flexShrink: 0,
              overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {conseiller.photoUrl ? (
                <img src={conseiller.photoUrl} alt={conseiller.prenom} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <span style={{ fontSize: 15, fontWeight: 700, color: "#888", fontFamily: config.fonts.body }}>
                  {`${conseiller.prenom?.[0]}${conseiller.nom?.[0]}`.toUpperCase()}
                </span>
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <GradText size={12} weight={600}>{nextRdv.type}</GradText>
              <div style={{ color: "#1c1d1e", fontSize: 10, fontWeight: 300, fontFamily: config.fonts.body }}>
                {new Date(nextRdv.date).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              </div>
              <div style={{ color: "#1c1d1e", fontSize: 10, fontWeight: 300, fontFamily: config.fonts.body }}>
                {nextRdv.heure}
              </div>
            </div>
            <div style={{ color: "#1c1d1e", fontSize: 10, fontWeight: 300, fontFamily: config.fonts.body, textAlign: "right", flexShrink: 0 }}>
              avec {conseiller.prenom} {conseiller.nom}
            </div>
          </div>
        </>
      )}

      {/* Documents */}
      {newDoc && (
        <>
          {sectionTitle("Mes documents")}
          <div
            onClick={() => navigate("/documents")}
            style={{
              background: "#fff",
              borderRadius: 7, height: 68,
              padding: "0 12px",
              display: "flex", alignItems: "center", gap: 10,
              cursor: "pointer", marginBottom: 16,
              boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
              position: "relative",
            }}
          >
            {/* Icône document — carré gris */}
            <div style={{
              width: 43, height: 43, borderRadius: 5,
              background: "#e8e8e8", flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {/* Logo Hilbert chaîne SVG miniature */}
              <svg width={20} height={28} viewBox="0 0 54 80" fill="none">
                <path d="M27 4 C38 4,50 12,50 26 C50 40,38 46,27 45 C16 46,4 40,4 26 C4 12,16 4,27 4Z"
                  stroke={config.colors.gradientStart} strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M27 45 C38 44,50 50,50 64 C50 76,38 80,27 80 C16 80,4 76,4 64 C4 50,16 44,27 45Z"
                  stroke={config.colors.gradientStart} strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="23" y="28" width="8" height="14" rx="2" fill={config.colors.gradientStart}/>
                <rect x="23" y="48" width="8" height="14" rx="2" fill={config.colors.gradientStart}/>
              </svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <GradText size={12} weight={600}>{newDoc.nom}</GradText>
              <div style={{ color: "#1c1d1e", fontSize: 10, fontWeight: 300, fontFamily: config.fonts.body }}>
                {new Date(newDoc.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
              </div>
            </div>
            {!newDoc.lu && (
              <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#E74C3C", flexShrink: 0 }} />
            )}
          </div>
        </>
      )}

      {/* Actualités du cabinet */}
      {sectionTitle("Actualités du cabinet :")}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {actualites.map((a) => (
          <div
            key={a.id}
            onClick={() => navigate("/actualites")}
            style={{
              borderRadius: 7,
              overflow: "hidden",
              cursor: "pointer",
              boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
            }}
          >
            {/* Image zone (photo/instagram) */}
            <div style={{
              height: 112,
              background: `linear-gradient(135deg, ${config.colors.gradientStart} 0%, ${config.colors.gradientEnd} 100%)`,
              display: "flex", alignItems: "flex-start", padding: "10px 8px",
            }}>
              <span style={{
                display: "inline-block", padding: "2px 7px", borderRadius: 4,
                background: "rgba(255,255,255,0.18)", color: "#fff",
                fontSize: 9, fontWeight: 600, fontFamily: config.fonts.body,
              }}>{a.type}</span>
            </div>
            {/* Titre zone — fond blanc */}
            <div style={{
              background: "#fff",
              borderRadius: "0 0 7px 7px",
              padding: "8px 10px 10px",
            }}>
              <p style={{
                margin: "0 0 2px", fontSize: 10, fontWeight: 400,
                color: config.colors.gradientStart,
                fontFamily: config.fonts.body, lineHeight: 1.35,
                display: "-webkit-box", WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical", overflow: "hidden",
              }}>
                {a.titre}
              </p>
              <p style={{ margin: 0, fontSize: 8, color: "#444", fontFamily: config.fonts.body }}>
                {a.source}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
