import { useState, useEffect } from "react";
import { X, ChevronRight, PlusCircle, RefreshCw } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import config from "../config/cabinet.config.js";
import { useSupabase } from "../hooks/useSupabase.js";
import FournisseurLogo from "../components/FournisseurLogo.jsx";

const PERIODES = ["1M", "6M", "1A"];

const CATEGORIES = [
  { key: "all", label: "Investissement" },
  { key: "tresorerie", label: "Trésorerie" },
  { key: "immobilier", label: "Immobilier" },
];

const formatMontant = (n) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

const formatDate = (str) =>
  new Date(str).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

// ── Labels date concis ──
const shortDate = (str) =>
  new Date(str).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });

// ── Mini graphique performance avec sélecteur période ──
function MiniChart({ placement, color = config.colors.primary }) {
  const [periode, setPeriode] = useState("1A");

  if (!placement?.historique) return null;

  // Construire les données selon la période choisie
  const allData = placement.historique;
  const now = new Date();
  const cutoffs = {
    "3M": new Date(now.getFullYear(), now.getMonth() - 3, now.getDate()),
    "6M": new Date(now.getFullYear(), now.getMonth() - 6, now.getDate()),
    "1A": new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()),
    "Max": new Date(0),
  };
  const data = allData.filter(d => new Date(d.date) >= cutoffs[periode]);

  if (data.length < 2) return (
    <div style={{ textAlign: "center", padding: "20px", color: "#ccc", fontSize: 12, fontFamily: config.fonts.body }}>
      Données insuffisantes
    </div>
  );

  const first = data[0];
  const last = data[data.length - 1];
  const perfPct = ((last.valeur - first.valeur) / first.valeur * 100).toFixed(1);
  const isPositive = parseFloat(perfPct) >= 0;

  // Décimer les points pour l'axe X (5 jalons max)
  const step = Math.max(1, Math.floor(data.length / 4));
  const ticks = data
    .filter((_, i) => i % step === 0 || i === data.length - 1)
    .map(d => d.date);

  return (
    <div>
      {/* Sélecteur période */}
      <div style={{ display: "flex", gap: 4, marginBottom: 8, justifyContent: "flex-end" }}>
        {["3M", "6M", "1A", "Max"].map(p => (
          <button key={p} onClick={() => setPeriode(p)} style={{
            padding: "3px 9px", borderRadius: 6, border: "none", cursor: "pointer",
            background: p === periode ? config.colors.gradientStart : "#F0F0F0",
            color: p === periode ? "#fff" : "#888",
            fontSize: 11, fontWeight: 600, fontFamily: config.fonts.body,
          }}>{p}</button>
        ))}
      </div>

      {/* Perf sur la période */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <span style={{ fontSize: 11, color: "#888", fontFamily: config.fonts.body }}>
          {shortDate(first.date)} → {shortDate(last.date)}
        </span>
        <span style={{ fontSize: 14, fontWeight: 700, color: isPositive ? config.colors.perfGreen : "#E74C3C", fontFamily: config.fonts.body }}>
          {isPositive ? "+" : ""}{perfPct}%
        </span>
      </div>

      <ResponsiveContainer width="100%" height={110}>
        <LineChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
          <XAxis
            dataKey="date"
            ticks={ticks}
            tickFormatter={shortDate}
            tick={{ fill: "#aaa", fontSize: 9, fontFamily: config.fonts.body }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis hide domain={["auto", "auto"]} />
          <Tooltip
            formatter={(v) => [formatMontant(v), "Valeur"]}
            labelFormatter={(l) => new Date(l).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
            contentStyle={{
              background: "#fff", border: "1px solid #eee",
              borderRadius: 8, fontSize: 11, fontFamily: config.fonts.body,
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
            labelStyle={{ color: "#888", fontSize: 10, marginBottom: 2 }}
          />
          <Line
            type="monotone" dataKey="valeur"
            stroke={isPositive ? config.colors.perfGreen : "#E74C3C"}
            strokeWidth={2} dot={false}
            activeDot={{ r: 4, fill: isPositive ? config.colors.perfGreen : "#E74C3C", stroke: "#fff", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── Modal versement ──
function VersementModal({ placement, onClose }) {
  const [type, setType] = useState("ponctuel"); // ponctuel | programme
  const [montant, setMontant] = useState("");
  const [frequence, setFrequence] = useState("mensuel");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    // API V2: POST /api/versements { placement_id, type, montant, frequence }
    setSubmitted(true);
    setTimeout(onClose, 2000);
  };

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 300 }} />
      <div className="versement-modal" style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        background: "#fff", borderRadius: "20px 20px 0 0",
        padding: "24px 20px 40px", zIndex: 301,
        animation: "slideUp 0.3s ease",
        maxWidth: 600, margin: "0 auto",
      }}>
        <div style={{ width: 40, height: 4, borderRadius: 2, background: "#E0E0E0", margin: "0 auto 20px" }} />

        {submitted ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
            <h3 style={{ fontFamily: config.fonts.heading, fontSize: 18, color: config.colors.textDark, margin: "0 0 8px" }}>
              Demande envoyée !
            </h3>
            <p style={{ fontFamily: config.fonts.body, fontSize: 14, color: config.colors.textLight, margin: 0 }}>
              Votre conseiller va traiter votre demande.
            </p>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontFamily: config.fonts.heading, fontSize: 18, color: config.colors.textDark, margin: 0 }}>
                Effectuer un versement
              </h3>
              <button onClick={onClose} style={{ background: "#F5F5F5", border: "none", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <X size={16} />
              </button>
            </div>

            <p style={{ fontFamily: config.fonts.body, fontSize: 13, color: config.colors.textLight, margin: "0 0 16px" }}>
              {placement.nom} · {placement.fournisseur}
            </p>

            {/* Type versement */}
            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
              {[
                { key: "ponctuel", label: "Ponctuel", icon: <PlusCircle size={14} /> },
                { key: "programme", label: "Programmé", icon: <RefreshCw size={14} /> },
              ].map(({ key, label, icon }) => (
                <button
                  key={key}
                  onClick={() => setType(key)}
                  style={{
                    flex: 1, padding: "10px", borderRadius: 10,
                    border: type === key ? `2px solid ${config.colors.accent}` : "1px solid #E0E0E0",
                    background: type === key ? `${config.colors.accent}10` : "#FAFAFA",
                    color: type === key ? config.colors.accent : config.colors.textLight,
                    fontFamily: config.fonts.body, fontSize: 13, fontWeight: 600,
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  }}
                >
                  {icon} {label}
                </button>
              ))}
            </div>

            {/* Montant */}
            <label style={{ fontSize: 12, color: config.colors.textLight, fontFamily: config.fonts.body, display: "block", marginBottom: 6 }}>
              Montant (€)
            </label>
            <input
              type="number"
              placeholder="Ex : 500"
              value={montant}
              onChange={e => setMontant(e.target.value)}
              style={{
                width: "100%", padding: "12px 14px", borderRadius: 10,
                border: "1px solid #E0E0E0", fontFamily: config.fonts.body, fontSize: 15,
                color: config.colors.textDark, outline: "none", boxSizing: "border-box", marginBottom: 16,
              }}
            />

            {/* Fréquence (si programmé) */}
            {type === "programme" && (
              <>
                <label style={{ fontSize: 12, color: config.colors.textLight, fontFamily: config.fonts.body, display: "block", marginBottom: 6 }}>
                  Fréquence
                </label>
                <select
                  value={frequence}
                  onChange={e => setFrequence(e.target.value)}
                  style={{
                    width: "100%", padding: "12px 14px", borderRadius: 10,
                    border: "1px solid #E0E0E0", fontFamily: config.fonts.body, fontSize: 15,
                    color: config.colors.textDark, outline: "none", boxSizing: "border-box", marginBottom: 16,
                  }}
                >
                  <option value="mensuel">Mensuel</option>
                  <option value="trimestriel">Trimestriel</option>
                  <option value="annuel">Annuel</option>
                </select>
              </>
            )}

            <p style={{ fontSize: 11, color: config.colors.textLight, fontFamily: config.fonts.body, marginBottom: 16, lineHeight: 1.5 }}>
              Votre conseiller recevra cette demande et vous contactera pour finaliser l'opération.
            </p>

            <button
              onClick={handleSubmit}
              disabled={!montant}
              style={{
                width: "100%", padding: "14px", borderRadius: 12,
                border: "none",
                background: montant ? config.colors.accent : "#E0E0E0",
                color: "#fff",
                fontFamily: config.fonts.body, fontSize: 15, fontWeight: 600,
                cursor: montant ? "pointer" : "not-allowed",
              }}
            >
              Envoyer la demande
            </button>
          </>
        )}
      </div>
      <style>{`@keyframes slideUp { from{transform:translateY(100%)}to{transform:translateY(0)} }`}</style>
    </>
  );
}

// ── Bottom sheet détail produit ──
function PlacementSheet({ placement, onClose, onVersement }) {
  if (!placement) return null;

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200 }} />
      <div className="placement-sheet" style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        background: "#fff", borderRadius: "20px 20px 0 0",
        padding: "20px 20px 32px", zIndex: 201,
        maxWidth: 600, margin: "0 auto",
        animation: "slideUp 0.3s ease", maxHeight: "92dvh", overflowY: "auto",
      }}>
        <div style={{ width: 40, height: 4, borderRadius: 2, background: "#E0E0E0", margin: "0 auto 16px" }} />

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
          <FournisseurLogo
            fournisseurLogo={placement.fournisseurLogo}
            fournisseurCouleur={placement.fournisseurCouleur}
            nom={placement.fournisseur}
            size={46}
          />
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: 0, fontFamily: config.fonts.heading, fontSize: 17, color: config.colors.textDark }}>{placement.nom}</h3>
            <p style={{ margin: "2px 0 0", fontSize: 12, color: config.colors.textLight, fontFamily: config.fonts.body }}>{placement.sousTitre || placement.fournisseur}</p>
          </div>
          <button onClick={onClose} style={{ background: "#F5F5F5", border: "none", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <X size={16} color={config.colors.textDark} />
          </button>
        </div>

        {/* Valeur + perf */}
        <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
          <div style={{ flex: 1, background: "#F8F9FA", borderRadius: 12, padding: 14 }}>
            <p style={{ margin: "0 0 3px", fontSize: 11, color: config.colors.textLight, fontFamily: config.fonts.body }}>Valeur</p>
            <p style={{ margin: 0, fontFamily: config.fonts.heading, fontSize: 20, color: config.colors.textDark, fontWeight: 700 }}>{formatMontant(placement.valeur)}</p>
          </div>
          <div style={{ flex: 1, background: "#F0FFF4", borderRadius: 12, padding: 14 }}>
            <p style={{ margin: "0 0 3px", fontSize: 11, color: config.colors.textLight, fontFamily: config.fonts.body }}>Performance (1 an)</p>
            <p style={{ margin: 0, fontFamily: config.fonts.heading, fontSize: 20, color: config.colors.perfGreen, fontWeight: 700 }}>+{placement.performance}%</p>
          </div>
        </div>

        {/* Graphique performance */}
        <div style={{ background: "#F8F9FA", borderRadius: 12, padding: "12px 12px 8px", marginBottom: 18 }}>
          <p style={{ margin: "0 0 8px", fontSize: 12, color: config.colors.textLight, fontFamily: config.fonts.body, fontWeight: 600 }}>
            Value — Performance
          </p>
          <MiniChart placement={placement} color={placement.fournisseurCouleur || config.colors.primary} />
        </div>

        {/* Infos */}
        <div style={{ background: "#F8F9FA", borderRadius: 12, padding: 14, marginBottom: 18 }}>
          {[
            { label: "Fournisseur", value: placement.fournisseur },
            { label: "Allocation", value: `${placement.allocationPct}% du portefeuille` },
            { label: "Ouverture", value: formatDate(placement.dateOuverture) },
            { label: "API V2", value: `Connexion ${placement.fournisseur} disponible` },
          ].map(({ label, value }) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #EFEFEF" }}>
              <span style={{ fontSize: 13, color: config.colors.textLight, fontFamily: config.fonts.body }}>{label}</span>
              <span style={{ fontSize: 13, color: label === "API V2" ? config.colors.primary : config.colors.textDark, fontFamily: config.fonts.body, fontWeight: 500, textAlign: "right", maxWidth: "55%" }}>{value}</span>
            </div>
          ))}
        </div>

        {/* Boutons versements */}
        {placement.versementPossible && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button
              onClick={() => onVersement(placement, "ponctuel")}
              style={{
                width: "100%", padding: "13px", borderRadius: 12,
                border: `1px solid ${config.colors.textLight}40`,
                background: "transparent", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 10,
                fontFamily: config.fonts.body, fontSize: 14, color: config.colors.textDark,
              }}
            >
              <PlusCircle size={18} color={config.colors.accent} />
              Effectuer un versement ponctuel
            </button>
            <button
              onClick={() => onVersement(placement, "programme")}
              style={{
                width: "100%", padding: "13px", borderRadius: 12,
                border: `1px solid ${config.colors.textLight}40`,
                background: "transparent", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 10,
                fontFamily: config.fonts.body, fontSize: 14, color: config.colors.textDark,
              }}
            >
              <RefreshCw size={18} color={config.colors.accent} />
              Effectuer des versements programmés
            </button>
          </div>
        )}
      </div>
      <style>{`@keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}`}</style>
    </>
  );
}

// Tooltip graphique portefeuille
function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#fff", border: "1px solid #E0E0E0", borderRadius: 8, padding: "8px 12px", fontFamily: config.fonts.body }}>
      <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: config.colors.textDark }}>{formatMontant(payload[0].value)}</p>
    </div>
  );
}

export default function Portefeuille() {
  const { fetchPortefeuille } = useSupabase();
  const [data, setData] = useState(null);
  const [periode, setPeriode] = useState("1A");
  const [categorie, setCategorie] = useState("all");
  const [selectedPlacement, setSelectedPlacement] = useState(null);
  const [versementPlacement, setVersementPlacement] = useState(null);

  useEffect(() => { fetchPortefeuille().then(setData); }, []);

  if (!data) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "rgba(255,255,255,0.5)", fontFamily: config.fonts.body }}>
      Chargement...
    </div>
  );

  const histData = data.historique[periode] || [];

  // Filtrage par catégorie
  const filteredPlacements = categorie === "all"
    ? data.placements.filter(p => p.categorie === "investissement")
    : data.placements.filter(p => p.categorie === categorie);

  return (
    <div className="page-enter" style={{ padding: "16px 16px 0", maxWidth: 560, margin: "0 auto" }}>

      {/* Header valeur totale */}
      <div style={{ marginBottom: 20 }}>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, margin: "0 0 4px", fontFamily: config.fonts.body, fontWeight: 200 }}>Valeur totale</p>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontFamily: config.fonts.heading, color: "#fff", fontSize: 30, fontWeight: 700 }}>
            {formatMontant(data.valeurTotale)}
          </span>
          <span style={{ background: "rgba(0,240,114,0.6)", color: config.colors.perfGreen, borderRadius: 3, padding: "2px 8px", fontSize: 12, fontWeight: 700, fontFamily: config.fonts.body }}>
            +{data.performanceGlobale}%
          </span>
          <span style={{ background: "rgba(217,217,217,0.3)", color: "#fff", borderRadius: 3, padding: "2px 8px", fontSize: 12, fontFamily: config.fonts.body, fontWeight: 700 }}>
            YTD +{data.performanceYTD}%
          </span>
        </div>
      </div>

      {/* Graphique courbe */}
      <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: 16, padding: "14px 12px 8px", marginBottom: 12, border: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ display: "flex", gap: 6, marginBottom: 12, justifyContent: "flex-end" }}>
          {PERIODES.map(p => (
            <button key={p} onClick={() => setPeriode(p)} style={{
              padding: "4px 12px", borderRadius: 8, border: "none", cursor: "pointer",
              background: p === periode ? "#fff" : "rgba(255,255,255,0.1)",
              color: p === periode ? config.colors.portefeuilleBackground : "rgba(255,255,255,0.6)",
              fontFamily: config.fonts.body, fontSize: 12, fontWeight: 600, transition: "all 0.2s",
            }}>{p}</button>
          ))}
        </div>
        <ResponsiveContainer width="100%" height={150}>
          <LineChart data={histData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
            <XAxis dataKey="date" tickFormatter={v => new Date(v).toLocaleDateString("fr-FR", { month: "short" })}
              tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10, fontFamily: config.fonts.body }} axisLine={false} tickLine={false} />
            <YAxis hide domain={["auto", "auto"]} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="valeur" stroke={config.colors.primaryLight} strokeWidth={2.5} dot={false} activeDot={{ r: 4, fill: config.colors.primaryLight }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Donut */}
      <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: 16, padding: 14, marginBottom: 20, border: "1px solid rgba(255,255,255,0.08)" }}>
        <p style={{ margin: "0 0 0", color: "rgba(255,255,255,0.7)", fontSize: 13, fontFamily: config.fonts.body, fontWeight: 500 }}>Répartition par classe d'actif</p>
        <ResponsiveContainer width="100%" height={190}>
          <PieChart>
            <Pie data={data.repartition} cx="50%" cy="50%" innerRadius={45} outerRadius={68} paddingAngle={3} dataKey="valeur">
              {data.repartition.map((e, i) => <Cell key={i} fill={e.couleur} />)}
            </Pie>
            <Legend formatter={(value, entry) => (
              <span style={{ color: "rgba(255,255,255,0.75)", fontSize: 11, fontFamily: config.fonts.body }}>{entry.payload.label} {entry.payload.valeur}%</span>
            )} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* ─── Onglets catégories ─── */}
      <h3 style={{ margin: "0 0 10px", color: "#fff", fontSize: 16, fontFamily: config.fonts.body, fontWeight: 400 }}>
        Mes placements :
      </h3>
      {/* Tab pill container — fond blanc, tab actif en gradient */}
      <div style={{
        display: "flex", gap: 0,
        background: "#fff", borderRadius: 17, padding: 2,
        marginBottom: 14, boxShadow: "0 4px 4px rgba(0,0,0,0.25)",
      }}>
        {CATEGORIES.map(({ key, label }) => {
          const isActive = categorie === key;
          return (
            <button key={key} onClick={() => setCategorie(key)} style={{
              flex: 1, padding: "7px 4px", borderRadius: 15, border: "none", cursor: "pointer",
              background: isActive ? config.colors.nameGradient : "transparent",
              color: isActive ? "#fff" : "#666",
              fontFamily: config.fonts.body, fontSize: 12, fontWeight: isActive ? 300 : 500,
              transition: "all 0.2s",
              WebkitBackgroundClip: isActive ? "initial" : undefined,
            }}>{label}</button>
          );
        })}
      </div>

      {/* Liste placements */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filteredPlacements.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "rgba(255,255,255,0.4)", fontFamily: config.fonts.body }}>
            Aucun produit dans cette catégorie
          </div>
        ) : (
          filteredPlacements.map(plc => (
            <div
              key={plc.id}
              onClick={() => setSelectedPlacement(plc)}
              style={{
                background: "#fff", borderRadius: 7,
                height: 68, padding: "0 12px",
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
              {/* Textes — 3 lignes */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{
                  background: "linear-gradient(90deg, #133248 0%, #2e79ae 100%)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  fontSize: 12, fontWeight: 600, fontFamily: config.fonts.body, lineHeight: 1.3,
                  display: "block",
                }}>
                  {plc.nom}
                </span>
                <span style={{ color: "#1c1d1e", fontSize: 10, fontWeight: 300, fontFamily: config.fonts.body, lineHeight: 1.3, display: "block" }}>
                  {plc.sousTitre || plc.fournisseur}
                </span>
                <span style={{ color: "#1c1d1e", fontSize: 12, fontWeight: 300, fontFamily: config.fonts.body, lineHeight: 1.3, display: "block" }}>
                  {formatMontant(plc.valeur)}
                </span>
              </div>
              {/* Perf */}
              <span style={{ color: config.colors.perfGreen, fontSize: 15, fontWeight: 700, fontFamily: config.fonts.body, flexShrink: 0 }}>
                +{plc.performance}%
              </span>
            </div>
          ))
        )}
      </div>

      {/* Sheets */}
      {selectedPlacement && !versementPlacement && (
        <PlacementSheet
          placement={selectedPlacement}
          onClose={() => setSelectedPlacement(null)}
          onVersement={(plc) => { setVersementPlacement(plc); setSelectedPlacement(null); }}
        />
      )}
      {versementPlacement && (
        <VersementModal
          placement={versementPlacement}
          onClose={() => setVersementPlacement(null)}
        />
      )}
    </div>
  );
}
