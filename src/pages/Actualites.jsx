import { useState, useEffect } from "react";
import config from "../config/cabinet.config.js";
import { useSupabase } from "../hooks/useSupabase.js";

// Onglets Figma V1 : Articles / Webinaire / Évènement
const TABS = [
  { key: "articles",   label: "Articles" },
  { key: "webinaire",  label: "Webinaire" },
  { key: "evenement",  label: "Évènement" },
];

// ── Carte Actualité (image + texte) ── exactement comme dans le Figma
function NewsCard({ article, featured = false }) {
  const imgHeight = featured ? 220 : 154;
  const width = featured ? "100%" : "calc(50% - 5px)";

  return (
    <div
      onClick={() => article.url && window.open(article.url, "_blank")}
      style={{
        width,
        borderRadius: 7,
        overflow: "hidden",
        cursor: "pointer",
        boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
      }}
    >
      {/* Zone image */}
      <div style={{
        height: imgHeight,
        background: `linear-gradient(135deg, ${config.colors.gradientStart} 0%, ${config.colors.gradientEnd} 100%)`,
        position: "relative",
        overflow: "hidden",
      }}>
        {article.imageUrl && (
          <img
            src={article.imageUrl}
            alt={article.titre}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={e => { e.currentTarget.style.display = "none"; }}
          />
        )}
        {/* Badge type */}
        <div style={{
          position: "absolute", top: 8, left: 8,
          padding: "2px 7px", borderRadius: 4,
          background: "rgba(255,255,255,0.18)",
          color: "#fff", fontSize: 9, fontWeight: 600,
          fontFamily: config.fonts.body,
        }}>
          {article.type || article.tag}
        </div>
      </div>

      {/* Zone texte — fond blanc */}
      <div style={{
        background: "#fff",
        padding: featured ? "12px 14px 14px" : "8px 10px 10px",
        borderRadius: "0 0 7px 7px",
      }}>
        <p style={{
          margin: "0 0 2px",
          fontSize: featured ? 12 : 10,
          fontWeight: 400,
          color: config.colors.gradientStart,
          fontFamily: config.fonts.body,
          lineHeight: 1.35,
          display: "-webkit-box",
          WebkitLineClamp: featured ? 3 : 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}>
          {article.titre}
        </p>
        <p style={{
          margin: 0,
          fontSize: 8,
          color: "#444",
          fontFamily: config.fonts.body,
        }}>
          {article.source}
        </p>
      </div>
    </div>
  );
}

export default function Actualites() {
  const { fetchActualites } = useSupabase();
  const [articles, setArticles] = useState([]);
  const [tabActif, setTabActif] = useState("articles");

  useEffect(() => {
    // API V2: flux RSS + sélection par le cabinet + push notification
    fetchActualites().then(setArticles);
  }, []);

  // Filtrage par onglet — V2 le champ `onglet` sera rempli par le backoffice
  const filtered = articles; // V1 : on affiche tout

  // Article mis en avant (premier / le plus récent)
  const featured = filtered[0] || null;
  const grid = filtered.slice(1);

  return (
    <div className="page-enter" style={{ padding: "16px 16px 0", maxWidth: 480, margin: "0 auto" }}>

      {/* Titre — ExtraLight 25px comme dans le Figma */}
      <h1 style={{
        fontFamily: config.fonts.heading,
        color: "#fff", fontSize: 25, fontWeight: 200,
        margin: "0 0 20px",
      }}>
        Actualités du cabinet
      </h1>

      {/* Article featured — pleine largeur */}
      {featured && (
        <div style={{ marginBottom: 24 }}>
          <NewsCard article={featured} featured />
        </div>
      )}

      {/* Section "Nos actualités" + onglets */}
      <h3 style={{
        color: "#fff", fontSize: 16, fontWeight: 400,
        fontFamily: config.fonts.body, margin: "0 0 10px",
      }}>
        Nos actualités
      </h3>

      {/* Tab pill container — même style que Portefeuille */}
      <div style={{
        display: "flex", gap: 0,
        background: "#fff", borderRadius: 17, padding: 2,
        marginBottom: 16, boxShadow: "0 4px 4px rgba(0,0,0,0.15)",
      }}>
        {TABS.map(({ key, label }) => {
          const isActive = tabActif === key;
          return (
            <button key={key} onClick={() => setTabActif(key)} style={{
              flex: 1, padding: "7px 4px", borderRadius: 15, border: "none", cursor: "pointer",
              background: isActive ? config.colors.nameGradient : "transparent",
              color: isActive ? "#fff" : "#666",
              fontFamily: config.fonts.body, fontSize: 12,
              fontWeight: isActive ? 300 : 500,
              transition: "all 0.2s",
            }}>
              {label}
            </button>
          );
        })}
      </div>

      {/* Grille 2 colonnes */}
      {grid.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 20px", color: "rgba(255,255,255,0.4)", fontFamily: config.fonts.body }}>
          {tabActif !== "articles" ? "Prochainement disponible" : "Aucun article"}
        </div>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {grid.map((a) => (
            <NewsCard key={a.id} article={a} />
          ))}
        </div>
      )}
    </div>
  );
}
