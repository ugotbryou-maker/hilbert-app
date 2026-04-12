import { useState, useEffect, useRef } from "react";
import { Camera, Lock, Bell, LogOut, ChevronRight, Check, Shield } from "lucide-react";
import config from "../config/cabinet.config.js";
import { useSupabase } from "../hooks/useSupabase.js";
import { useNavigate } from "react-router-dom";

// Couleurs du profil risque
const PROFIL_COULEUR = {
  1: { bg: "#E8F5E9", color: "#27AE60", label: "Conservateur" },
  2: { bg: "#FFF3E0", color: "#F39C12", label: "Modéré" },
  3: { bg: "#FCE4EC", color: "#E74C3C", label: "Dynamique" },
};

// ── Ligne d'info éditable ──
function EditRow({ label, value, onChange, type = "text", placeholder, readOnly = false }) {
  return (
    <div style={{ padding: "12px 0", borderBottom: "1px solid #F0F0F0" }}>
      <div style={{ fontSize: 11, color: config.colors.textLight, fontFamily: config.fonts.body, marginBottom: 4 }}>
        {label}
      </div>
      {readOnly ? (
        <div style={{ fontSize: 14, color: config.colors.textDark, fontFamily: config.fonts.body, fontWeight: 500 }}>
          {value}
        </div>
      ) : (
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            width: "100%", border: "none", outline: "none",
            fontSize: 14, color: config.colors.textDark,
            fontFamily: config.fonts.body, fontWeight: 500,
            background: "transparent", padding: 0,
          }}
        />
      )}
    </div>
  );
}

// ── Toggle notification ──
function NotifToggle({ label, description, value, onChange }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "13px 0", borderBottom: "1px solid #F0F0F0",
    }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 500, color: config.colors.textDark, fontFamily: config.fonts.body }}>
          {label}
        </div>
        {description && (
          <div style={{ fontSize: 11, color: config.colors.textLight, fontFamily: config.fonts.body, marginTop: 2 }}>
            {description}
          </div>
        )}
      </div>
      <div
        onClick={() => onChange(!value)}
        style={{
          width: 44, height: 24, borderRadius: 12,
          background: value ? config.colors.perfGreen : "#E0E0E0",
          position: "relative", cursor: "pointer",
          transition: "background 0.2s",
          flexShrink: 0, marginLeft: 16,
        }}
      >
        <div style={{
          position: "absolute", top: 2,
          left: value ? 22 : 2,
          width: 20, height: 20, borderRadius: "50%",
          background: "#fff",
          boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
          transition: "left 0.2s",
        }} />
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 16,
      padding: "0 18px", marginBottom: 16,
      boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
    }}>
      <div style={{
        padding: "14px 0 10px",
        fontSize: 12, fontWeight: 600,
        color: config.colors.gradientStart,
        fontFamily: config.fonts.body,
        textTransform: "uppercase", letterSpacing: "0.06em",
        borderBottom: "1px solid #F0F0F0",
      }}>
        {title}
      </div>
      {children}
    </div>
  );
}

export default function Profil({ onLogout }) {
  const { fetchUser } = useSupabase();
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [user, setUser] = useState(null);
  const [telephone, setTelephone] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [notifs, setNotifs] = useState({});
  const [saved, setSaved] = useState(false);
  const [showPwdForm, setShowPwdForm] = useState(false);
  const [pwd, setPwd] = useState({ current: "", new: "", confirm: "" });

  useEffect(() => {
    fetchUser().then(u => {
      setUser(u);
      setTelephone(u.telephone || "");
      setAvatarUrl(u.avatar || "/images/Profile%20utilisateur%20photo.png");
      setNotifs(u.preferences || {});
    });
  }, []);

  const handleSave = () => {
    // API V2: supabase.from('users').update({ telephone, preferences: notifs }).eq('id', user.id)
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleAvatar = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatarUrl(url);
    // API V2: supabase.storage.from('avatars').upload(userId, file)
  };

  const handleLogout = () => {
    onLogout?.();
    navigate("/login");
  };

  if (!user) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "rgba(255,255,255,0.5)", fontFamily: config.fonts.body }}>
      Chargement...
    </div>
  );

  const profilCouleur = PROFIL_COULEUR[user.profilRisque?.niveau] || PROFIL_COULEUR[1];
  const initials = `${user.prenom?.[0]}${user.nom?.[0]}`.toUpperCase();

  return (
    <div className="page-enter" style={{ padding: "20px 16px 40px", maxWidth: 480, margin: "0 auto" }}>

      {/* ── Avatar + nom ── */}
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ position: "relative", display: "inline-block", marginBottom: 12 }}>
          {/* Photo */}
          <div style={{
            width: 88, height: 88, borderRadius: "50%",
            overflow: "hidden", background: "#e8e8e8",
            border: "3px solid rgba(255,255,255,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Avatar"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={() => setAvatarUrl(null)}
              />
            ) : (
              <span style={{ fontSize: 30, fontWeight: 700, color: "#888", fontFamily: config.fonts.body }}>
                {initials}
              </span>
            )}
          </div>
          {/* Bouton changer photo */}
          <button
            onClick={() => fileRef.current?.click()}
            style={{
              position: "absolute", bottom: 0, right: 0,
              width: 28, height: 28, borderRadius: "50%",
              background: config.colors.gradientStart,
              border: "2px solid #fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <Camera size={13} color="#fff" />
          </button>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleAvatar} />
        </div>

        <h2 style={{ color: "#fff", fontFamily: config.fonts.heading, fontSize: 22, fontWeight: 300, margin: "0 0 2px" }}>
          {user.prenom} {user.nom}
        </h2>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, fontFamily: config.fonts.body, margin: 0 }}>
          {user.email}
        </p>

        {/* Badge profil risque */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: profilCouleur.bg, borderRadius: 20,
          padding: "5px 14px", marginTop: 10,
        }}>
          <Shield size={12} color={profilCouleur.color} />
          <span style={{ fontSize: 12, fontWeight: 600, color: profilCouleur.color, fontFamily: config.fonts.body }}>
            Profil {profilCouleur.label}
          </span>
        </div>
      </div>

      {/* ── Informations personnelles ── */}
      <Section title="Informations personnelles">
        <EditRow label="Prénom" value={user.prenom} readOnly />
        <EditRow label="Nom" value={user.nom} readOnly />
        <EditRow label="E-mail" value={user.email} readOnly />
        <EditRow
          label="Téléphone"
          value={telephone}
          onChange={setTelephone}
          type="tel"
          placeholder="+33 6 00 00 00 00"
        />
      </Section>

      {/* ── Sécurité ── */}
      <Section title="Sécurité">
        <div
          onClick={() => setShowPwdForm(v => !v)}
          style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "13px 0", cursor: "pointer",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Lock size={16} color={config.colors.gradientStart} />
            <span style={{ fontSize: 14, fontWeight: 500, color: config.colors.textDark, fontFamily: config.fonts.body }}>
              Changer de mot de passe
            </span>
          </div>
          <ChevronRight size={16} color="#ccc" style={{ transform: showPwdForm ? "rotate(90deg)" : "none", transition: "transform 0.2s" }} />
        </div>
        {showPwdForm && (
          <div style={{ paddingBottom: 14, display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { key: "current", label: "Mot de passe actuel" },
              { key: "new", label: "Nouveau mot de passe" },
              { key: "confirm", label: "Confirmer le nouveau" },
            ].map(({ key, label }) => (
              <input
                key={key}
                type="password"
                placeholder={label}
                value={pwd[key]}
                onChange={e => setPwd(p => ({ ...p, [key]: e.target.value }))}
                style={{
                  width: "100%", padding: "11px 14px",
                  borderRadius: 8, border: "1px solid #E0E0E0",
                  fontFamily: config.fonts.body, fontSize: 14,
                  outline: "none", boxSizing: "border-box",
                }}
              />
            ))}
            <button
              onClick={() => { setShowPwdForm(false); setPwd({ current: "", new: "", confirm: "" }); }}
              style={{
                padding: "11px", borderRadius: 8, border: "none",
                background: config.colors.gradientStart, color: "#fff",
                fontFamily: config.fonts.body, fontSize: 14, fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Confirmer
            </button>
          </div>
        )}
      </Section>

      {/* ── Notifications ── */}
      <Section title="Notifications">
        <NotifToggle
          label="Nouveaux documents"
          description="Relevés, bilans, contrats"
          value={notifs.notif_documents}
          onChange={v => setNotifs(n => ({ ...n, notif_documents: v }))}
        />
        <NotifToggle
          label="Rendez-vous"
          description="Confirmations et rappels"
          value={notifs.notif_rdv}
          onChange={v => setNotifs(n => ({ ...n, notif_rdv: v }))}
        />
        <NotifToggle
          label="Performance du portefeuille"
          description="Alertes sur variations significatives"
          value={notifs.notif_performance}
          onChange={v => setNotifs(n => ({ ...n, notif_performance: v }))}
        />
        <NotifToggle
          label="Actualités du cabinet"
          description="Newsletter, événements, webinaires"
          value={notifs.notif_actualites}
          onChange={v => setNotifs(n => ({ ...n, notif_actualites: v }))}
        />
      </Section>

      {/* ── Bouton sauvegarder ── */}
      <button
        onClick={handleSave}
        style={{
          width: "100%", padding: "14px",
          borderRadius: 12, border: "none",
          background: saved ? config.colors.perfGreen : "#fff",
          color: saved ? "#fff" : config.colors.gradientStart,
          fontFamily: config.fonts.body, fontSize: 15, fontWeight: 600,
          cursor: "pointer", marginBottom: 12,
          transition: "all 0.25s",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        }}
      >
        {saved ? <><Check size={18} /> Enregistré</> : "Sauvegarder"}
      </button>

      {/* ── Déconnexion ── */}
      <button
        onClick={handleLogout}
        style={{
          width: "100%", padding: "14px",
          borderRadius: 12,
          border: "1px solid rgba(255,255,255,0.25)",
          background: "transparent",
          color: "rgba(255,255,255,0.6)",
          fontFamily: config.fonts.body, fontSize: 14,
          cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        }}
      >
        <LogOut size={16} />
        Se déconnecter
      </button>
    </div>
  );
}
