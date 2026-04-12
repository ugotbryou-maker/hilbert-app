import { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Calendar, CheckCircle, Clock, XCircle, ChevronRight } from "lucide-react";

// LinkedIn SVG inline (lucide-react v1 ne l'exporte pas)
function LinkedinIcon({ size = 18, color = "#fff" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
      <rect x="2" y="9" width="4" height="12"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  );
}
import config from "../config/cabinet.config.js";
import { useSupabase } from "../hooks/useSupabase.js";
import RdvModal from "../components/RdvModal.jsx";

const DISPONIBILITE_META = {
  disponible: { label: "Disponible", color: "#27AE60", dot: "#27AE60" },
  indisponible: { label: "Indisponible", color: "#E74C3C", dot: "#E74C3C" },
  conges: { label: "En congés", color: "#F39C12", dot: "#F39C12" },
};

const STATUT_META = {
  confirme: { icon: CheckCircle, label: "confirmé", color: "#27AE60" },
  en_attente: { icon: Clock, label: "en attente", color: "#F39C12" },
  annule: { icon: XCircle, label: "annulé", color: "#E74C3C" },
};

// Avatar conseiller
function ConseillerAvatar({ conseiller }) {
  if (conseiller.photoUrl) {
    return (
      <img
        src={conseiller.photoUrl}
        alt={`${conseiller.prenom} ${conseiller.nom}`}
        style={{ width: 90, height: 90, borderRadius: "50%", objectFit: "cover", border: "3px solid rgba(255,255,255,0.3)" }}
      />
    );
  }
  const initials = `${conseiller.prenom[0]}${conseiller.nom[0]}`.toUpperCase();
  return (
    <div style={{
      width: 90, height: 90, borderRadius: "50%",
      background: "rgba(255,255,255,0.2)",
      border: "3px solid rgba(255,255,255,0.3)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <span style={{ color: "#fff", fontSize: 30, fontWeight: 700, fontFamily: config.fonts.heading }}>
        {initials}
      </span>
    </div>
  );
}

export default function Contact() {
  const { fetchRendezVous, bookRendezVous } = useSupabase();
  const [rdvs, setRdvs] = useState([]);
  const [showRdvModal, setShowRdvModal] = useState(false);

  const conseiller = config.conseiller;
  const dispMeta = DISPONIBILITE_META[conseiller.disponibilite] || DISPONIBILITE_META.disponible;

  useEffect(() => {
    fetchRendezVous().then(setRdvs);
  }, []);

  const handleConfirmRdv = async (params) => {
    const result = await bookRendezVous(params);
    if (result.success) {
      setRdvs((prev) => [...prev, result.rdv]);
    }
  };

  const CTA_BUTTON = ({ icon: Icon, label, onClick, color }) => (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        padding: "14px 8px",
        borderRadius: 14,
        border: "none",
        background: color || config.colors.accent,
        color: "#fff",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
        transition: "transform 0.15s, opacity 0.15s",
      }}
      onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
      onMouseLeave={e => e.currentTarget.style.opacity = "1"}
    >
      <Icon size={22} color="#fff" />
      <span style={{ fontSize: 11, fontFamily: config.fonts.body, fontWeight: 500, color: "rgba(255,255,255,0.85)" }}>
        {label}
      </span>
    </button>
  );

  const formatDateRdv = (str) => {
    const d = new Date(str);
    return {
      jour: d.getDate(),
      mois: d.toLocaleDateString("fr-FR", { month: "short" }),
      full: d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" }),
    };
  };

  return (
    <div className="page-enter" style={{ padding: "20px 16px 40px", maxWidth: 480, margin: "0 auto" }}>
      {/* Card conseiller */}
      <div style={{
        background: config.colors.cardBackground,
        borderRadius: 20,
        padding: "28px 20px 24px",
        marginBottom: 16,
        boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
        textAlign: "center",
      }}>
        {/* Avatar */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
          <ConseillerAvatar conseiller={conseiller} />
        </div>

        {/* Statut disponibilité */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 12 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: dispMeta.dot }} />
          <span style={{ fontSize: 13, color: dispMeta.color, fontFamily: config.fonts.body, fontWeight: 500 }}>
            {dispMeta.label}
          </span>
        </div>

        {/* Titre */}
        <p style={{ margin: "0 0 4px", fontSize: 12, color: config.colors.textLight, fontFamily: config.fonts.body }}>
          {conseiller.titre}
        </p>

        {/* Nom */}
        <h2 style={{
          fontFamily: config.fonts.heading,
          fontSize: 24, fontWeight: 600,
          color: config.colors.accent,
          margin: "0 0 4px",
        }}>
          {conseiller.prenom} {conseiller.nom}
        </h2>
        <p style={{ margin: "0 0 20px", fontSize: 13, color: config.colors.textLight, fontFamily: config.fonts.body, fontStyle: "italic" }}>
          {conseiller.role}
        </p>

        {/* 3 CTA */}
        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          <CTA_BUTTON
            icon={Calendar}
            label="Rendez-vous"
            onClick={() => setShowRdvModal(true)}
            color={config.colors.accent}
          />
          <CTA_BUTTON
            icon={Mail}
            label="E-mail"
            onClick={() => window.open(`mailto:${conseiller.email}`)}
            color={config.colors.accent}
          />
          <CTA_BUTTON
            icon={Phone}
            label="Téléphone"
            onClick={() => window.open(`tel:${conseiller.telephone.mobile.replace(/\s/g, "")}`)}
            color={config.colors.accent}
          />
        </div>

        {/* Coordonnées */}
        <div style={{ textAlign: "left", display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { label: "Standard", value: conseiller.telephone.standard },
            { label: "Mobile", value: conseiller.telephone.mobile },
            { label: "E-mail", value: conseiller.email },
          ].map(({ label, value }) => (
            <div key={label} style={{ display: "flex", gap: 6 }}>
              <span style={{ fontSize: 13, color: config.colors.textLight, fontFamily: config.fonts.body, minWidth: 56 }}>
                {label}
              </span>
              <span style={{ fontSize: 13, color: config.colors.textDark, fontFamily: config.fonts.body }}>
                {value}
              </span>
            </div>
          ))}
          <div style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
            <MapPin size={14} color={config.colors.textLight} style={{ marginTop: 2, flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: config.colors.textDark, fontFamily: config.fonts.body }}>
              {conseiller.adresse}
            </span>
          </div>
        </div>

        {/* LinkedIn */}
        {conseiller.linkedin && (
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
            <button
              onClick={() => window.open(conseiller.linkedin, "_blank")}
              style={{
                width: 36, height: 36, borderRadius: 8,
                background: "#0077B5", border: "none",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <LinkedinIcon size={18} color="#fff" />
            </button>
          </div>
        )}
      </div>

      {/* Bouton Prendre RDV */}
      <button
        onClick={() => setShowRdvModal(true)}
        style={{
          width: "100%",
          padding: "15px",
          borderRadius: 14,
          border: "2px solid #fff",
          background: "transparent",
          color: "#fff",
          fontFamily: config.fonts.body,
          fontSize: 16,
          fontWeight: 600,
          cursor: "pointer",
          marginBottom: 24,
          transition: "background 0.2s",
        }}
        onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
      >
        Prendre rendez-vous
      </button>

      {/* Prochains RDV */}
      <h3 style={{ margin: "0 0 12px", color: "rgba(255,255,255,0.8)", fontSize: 14, fontFamily: config.fonts.body, fontWeight: 500 }}>
        Mes prochains rendez-vous
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {rdvs.length === 0 ? (
          <div style={{ textAlign: "center", padding: "24px", color: "rgba(255,255,255,0.4)", fontFamily: config.fonts.body }}>
            Aucun rendez-vous planifié
          </div>
        ) : (
          rdvs.map((rdv) => {
            const { jour, full } = formatDateRdv(rdv.date);
            const statut = STATUT_META[rdv.statut] || STATUT_META.en_attente;
            const StatutIcon = statut.icon;
            return (
              <div
                key={rdv.id}
                style={{
                  background: "#fff",
                  borderRadius: 14,
                  padding: "14px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                }}
              >
                {/* Date carré */}
                <div style={{
                  width: 48, height: 48, borderRadius: 10,
                  background: "#F5F5F5",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <span style={{ fontFamily: config.fonts.heading, fontSize: 22, fontWeight: 700, color: config.colors.textDark }}>
                    {jour}
                  </span>
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: config.colors.textDark, fontFamily: config.fonts.body }}>
                    {rdv.type}
                  </p>
                  <p style={{ margin: "2px 0 0", fontSize: 12, color: config.colors.textLight, fontFamily: config.fonts.body }}>
                    {rdv.heure}
                  </p>
                </div>

                <span style={{
                  padding: "4px 10px", borderRadius: 20,
                  background: `${statut.color}15`, color: statut.color,
                  border: `1px solid ${statut.color}30`,
                  fontSize: 11, fontWeight: 600,
                  fontFamily: config.fonts.body,
                  display: "flex", alignItems: "center", gap: 4,
                }}>
                  <StatutIcon size={10} />
                  {statut.label}
                </span>
              </div>
            );
          })
        )}
      </div>

      {/* ── Coordonnées du cabinet ── */}
      {(() => {
        const cab = config.cabinet;
        if (!cab) return null;
        return (
          <div style={{
            background: config.colors.cardBackground,
            borderRadius: 20, padding: "22px 20px",
            marginTop: 24,
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          }}>
            <h3 style={{
              margin: "0 0 16px",
              fontFamily: config.fonts.heading,
              fontSize: 16, fontWeight: 600,
              color: config.colors.gradientStart,
            }}>
              Coordonnées du cabinet
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { icon: Phone, label: "Téléphone", value: cab.telephone, href: `tel:${cab.telephone.replace(/\s/g, "")}` },
                { icon: Mail, label: "E-mail", value: cab.email, href: `mailto:${cab.email}` },
                { icon: MapPin, label: "Adresse", value: `${cab.adresse}, ${cab.codePostal} ${cab.ville}`, href: `https://maps.google.com?q=${encodeURIComponent(cab.adresse + " " + cab.ville)}` },
                { icon: Clock, label: "Horaires", value: cab.horaires, href: null },
              ].map(({ icon: Icon, label, value, href }) => (
                <div
                  key={label}
                  onClick={() => href && window.open(href, "_blank")}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "10px 0",
                    borderBottom: "1px solid #F0F0F0",
                    cursor: href ? "pointer" : "default",
                  }}
                >
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: `${config.colors.gradientStart}10`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <Icon size={16} color={config.colors.gradientStart} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, color: config.colors.textLight, fontFamily: config.fonts.body }}>{label}</div>
                    <div style={{ fontSize: 13, color: config.colors.textDark, fontFamily: config.fonts.body, fontWeight: 500 }}>{value}</div>
                  </div>
                  {href && <ChevronRight size={14} color="#ccc" />}
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Modal RDV */}
      {showRdvModal && (
        <RdvModal
          onClose={() => setShowRdvModal(false)}
          onConfirm={handleConfirmRdv}
        />
      )}
    </div>
  );
}
