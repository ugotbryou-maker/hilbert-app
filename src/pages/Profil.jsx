import { useState, useEffect, useRef } from "react";
import { Camera, Lock, Bell, LogOut, ChevronRight, Check, Shield, Megaphone, X } from "lucide-react";
import config from "../config/cabinet.config.js";
import { useSupabase } from "../hooks/useSupabase.js";
import { useNavigate } from "react-router-dom";

const PROFIL_COULEUR = {
  1: { bg: "#E8F5E9", color: "#27AE60", label: "Conservateur" },
  2: { bg: "#FFF3E0", color: "#F39C12", label: "Modéré" },
  3: { bg: "#FCE4EC", color: "#E74C3C", label: "Dynamique" },
};

// Projets de vie à signaler
const PROJETS = [
  { key: "heritage",    emoji: "🏛️", label: "Héritage ou donation" },
  { key: "immobilier",  emoji: "🏡", label: "Nouveau projet immobilier" },
  { key: "entreprise",  emoji: "💼", label: "Création ou cession d'entreprise" },
  { key: "famille",     emoji: "💍", label: "Mariage, PACS ou divorce" },
  { key: "naissance",   emoji: "👶", label: "Naissance ou adoption" },
  { key: "retraite",    emoji: "🌅", label: "Départ à la retraite" },
  { key: "rentree",     emoji: "💰", label: "Rentrée d'argent exceptionnelle" },
  { key: "autre",       emoji: "✏️", label: "Autre" },
];

// ── Modale signalement projet ──
function ProjetModal({ onClose }) {
  const [step, setStep] = useState(1); // 1=choix, 2=note, 3=confirmation
  const [selected, setSelected] = useState(null);
  const [note, setNote] = useState("");

  const handleSubmit = () => {
    // API V2: supabase.from('demandes').insert({ type: selected.key, note, statut: 'en_attente' })
    // API V2: envoyer notification push au CGP via Edge Function
    setStep(3);
  };

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 400 }} />
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        background: "#fff", borderRadius: "20px 20px 0 0",
        zIndex: 401, maxWidth: 600, margin: "0 auto",
        animation: "slideUp 0.3s cubic-bezier(0.22,1,0.36,1)",
        maxHeight: "85dvh", display: "flex", flexDirection: "column",
      }}>
        {/* Poignée + Header */}
        <div style={{ padding: "12px 20px 0", flexShrink: 0 }}>
          <div style={{ width: 40, height: 4, borderRadius: 2, background: "#E0E0E0", margin: "0 auto 16px" }} />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
            <h3 style={{ margin: 0, fontFamily: config.fonts.heading, fontSize: 18, color: config.colors.textDark, fontWeight: 600 }}>
              {step === 3 ? "Demande envoyée !" : "Signaler un changement"}
            </h3>
            <button onClick={onClose} style={{ background: "#F5F5F5", border: "none", borderRadius: "50%", width: 30, height: 30, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <X size={15} color="#888" />
            </button>
          </div>
          {step < 3 && (
            <p style={{ margin: "0 0 14px", fontSize: 13, color: config.colors.textLight, fontFamily: config.fonts.body }}>
              Votre conseiller sera notifié pour organiser un point avec vous.
            </p>
          )}
        </div>

        {/* Contenu scrollable */}
        <div style={{ overflowY: "auto", flex: 1, padding: "0 20px", paddingBottom: "calc(24px + env(safe-area-inset-bottom))" }}>

          {step === 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {PROJETS.map(p => (
                <button
                  key={p.key}
                  onClick={() => { setSelected(p); setStep(2); }}
                  style={{
                    display: "flex", alignItems: "center", gap: 14,
                    padding: "14px 16px", borderRadius: 12,
                    border: "1.5px solid #EFEFEF",
                    background: "#FAFAFA",
                    cursor: "pointer", textAlign: "left", width: "100%",
                    transition: "border-color 0.15s, background 0.15s",
                  }}
                >
                  <span style={{ fontSize: 22 }}>{p.emoji}</span>
                  <span style={{ fontSize: 14, fontWeight: 500, color: config.colors.textDark, fontFamily: config.fonts.body }}>
                    {p.label}
                  </span>
                </button>
              ))}
            </div>
          )}

          {step === 2 && selected && (
            <div>
              <div style={{
                display: "flex", alignItems: "center", gap: 12,
                background: "#F0F7FF", borderRadius: 12, padding: "14px 16px", marginBottom: 18,
              }}>
                <span style={{ fontSize: 26 }}>{selected.emoji}</span>
                <span style={{ fontSize: 15, fontWeight: 600, color: config.colors.gradientStart, fontFamily: config.fonts.body }}>
                  {selected.label}
                </span>
              </div>
              <p style={{ fontSize: 13, color: config.colors.textLight, fontFamily: config.fonts.body, margin: "0 0 8px" }}>
                Un message pour votre conseiller (optionnel)
              </p>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Ex. : Je viens d'hériter d'un bien immobilier et souhaite en discuter..."
                rows={4}
                style={{
                  width: "100%", padding: "12px 14px",
                  borderRadius: 10, border: "1.5px solid #E0E0E0",
                  fontFamily: config.fonts.body, fontSize: 13,
                  outline: "none", resize: "none", boxSizing: "border-box",
                  color: config.colors.textDark,
                }}
              />
              <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                <button onClick={() => setStep(1)} style={{
                  flex: 1, padding: "12px", borderRadius: 10,
                  border: "1.5px solid #E0E0E0", background: "#fff",
                  color: "#888", fontFamily: config.fonts.body, fontSize: 14, cursor: "pointer",
                }}>
                  Retour
                </button>
                <button onClick={handleSubmit} style={{
                  flex: 2, padding: "12px", borderRadius: 10,
                  border: "none", background: config.colors.pageGradient,
                  color: "#fff", fontFamily: config.fonts.body, fontSize: 14, fontWeight: 600, cursor: "pointer",
                }}>
                  Envoyer la demande
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div style={{ textAlign: "center", padding: "24px 0" }}>
              <div style={{ fontSize: 52, marginBottom: 16 }}>✅</div>
              <h4 style={{ fontFamily: config.fonts.heading, fontSize: 17, color: config.colors.textDark, margin: "0 0 10px" }}>
                Votre conseiller a été notifié
              </h4>
              <p style={{ fontSize: 13, color: config.colors.textLight, fontFamily: config.fonts.body, margin: "0 0 24px" }}>
                Il reviendra vers vous très prochainement pour organiser un point patrimonial.
              </p>
              <button onClick={onClose} style={{
                padding: "13px 32px", borderRadius: 12,
                border: "none", background: config.colors.pageGradient,
                color: "#fff", fontFamily: config.fonts.body, fontSize: 14, fontWeight: 600, cursor: "pointer",
              }}>
                Fermer
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

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
          transition: "background 0.2s", flexShrink: 0, marginLeft: 16,
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

  const [user, setUser]             = useState(null);
  const [telephone, setTelephone]   = useState("");
  const [email, setEmail]           = useState("");
  const [adresse, setAdresse]       = useState("");
  const [codePostal, setCodePostal] = useState("");
  const [ville, setVille]           = useState("");
  const [avatarUrl, setAvatarUrl]   = useState(null);
  const [notifs, setNotifs]         = useState({});
  const [saved, setSaved]           = useState(false);
  const [showPwdForm, setShowPwdForm] = useState(false);
  const [showProjet, setShowProjet] = useState(false);
  const [pwd, setPwd]               = useState({ current: "", new: "", confirm: "" });

  useEffect(() => {
    fetchUser().then(u => {
      setUser(u);
      setTelephone(u.telephone || "");
      setEmail(u.email || "");
      setAdresse(u.adresse || "");
      setCodePostal(u.codePostal || "");
      setVille(u.ville || "");
      setAvatarUrl(u.avatar || "/images/Profile%20utilisateur%20photo.png");
      setNotifs(u.preferences || {});
    });
  }, []);

  const handleSave = () => {
    // API V2: supabase.from('users').update({ telephone, email, adresse, codePostal, ville, preferences: notifs }).eq('id', user.id)
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleAvatar = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarUrl(URL.createObjectURL(file));
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
          <div style={{
            width: 88, height: 88, borderRadius: "50%",
            overflow: "hidden", background: "#e8e8e8",
            border: "3px solid rgba(255,255,255,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={() => setAvatarUrl(null)} />
            ) : (
              <span style={{ fontSize: 30, fontWeight: 700, color: "#888", fontFamily: config.fonts.body }}>{initials}</span>
            )}
          </div>
          <button onClick={() => fileRef.current?.click()} style={{
            position: "absolute", bottom: 0, right: 0,
            width: 28, height: 28, borderRadius: "50%",
            background: config.colors.gradientStart, border: "2px solid #fff",
            display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
          }}>
            <Camera size={13} color="#fff" />
          </button>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleAvatar} />
        </div>

        <h2 style={{ color: "#fff", fontFamily: config.fonts.heading, fontSize: 22, fontWeight: 300, margin: "0 0 2px" }}>
          {user.prenom} {user.nom}
        </h2>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, fontFamily: config.fonts.body, margin: 0 }}>
          {email}
        </p>
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
        <EditRow label="E-mail" value={email} onChange={setEmail} type="email" placeholder="votre@email.fr" />
        <EditRow label="Téléphone" value={telephone} onChange={setTelephone} type="tel" placeholder="+33 6 00 00 00 00" />
      </Section>

      {/* ── Adresse ── */}
      <Section title="Adresse postale">
        <EditRow label="Rue" value={adresse} onChange={setAdresse} placeholder="2 rue de la Paix" />
        <EditRow label="Code postal" value={codePostal} onChange={setCodePostal} placeholder="75001" />
        <EditRow label="Ville" value={ville} onChange={setVille} placeholder="Paris" />
      </Section>

      {/* ── Sécurité ── */}
      <Section title="Sécurité">
        <div onClick={() => setShowPwdForm(v => !v)} style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "13px 0", cursor: "pointer",
        }}>
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
              <input key={key} type="password" placeholder={label} value={pwd[key]}
                onChange={e => setPwd(p => ({ ...p, [key]: e.target.value }))}
                style={{ width: "100%", padding: "11px 14px", borderRadius: 8, border: "1px solid #E0E0E0", fontFamily: config.fonts.body, fontSize: 14, outline: "none", boxSizing: "border-box" }}
              />
            ))}
            <button onClick={() => { setShowPwdForm(false); setPwd({ current: "", new: "", confirm: "" }); }}
              style={{ padding: "11px", borderRadius: 8, border: "none", background: config.colors.gradientStart, color: "#fff", fontFamily: config.fonts.body, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
              Confirmer
            </button>
          </div>
        )}
      </Section>

      {/* ── Notifications ── */}
      <Section title="Notifications">
        <NotifToggle label="Nouveaux documents" description="Relevés, bilans, contrats"
          value={notifs.notif_documents} onChange={v => setNotifs(n => ({ ...n, notif_documents: v }))} />
        <NotifToggle label="Rendez-vous" description="Confirmations et rappels"
          value={notifs.notif_rdv} onChange={v => setNotifs(n => ({ ...n, notif_rdv: v }))} />
        <NotifToggle label="Performance du portefeuille" description="Alertes sur variations significatives"
          value={notifs.notif_performance} onChange={v => setNotifs(n => ({ ...n, notif_performance: v }))} />
        <NotifToggle label="Actualités du cabinet" description="Newsletter, événements, webinaires"
          value={notifs.notif_actualites} onChange={v => setNotifs(n => ({ ...n, notif_actualites: v }))} />
      </Section>

      {/* ── Sauvegarder ── */}
      <button onClick={handleSave} style={{
        width: "100%", padding: "14px", borderRadius: 12, border: "none",
        background: saved ? config.colors.perfGreen : "#fff",
        color: saved ? "#fff" : config.colors.gradientStart,
        fontFamily: config.fonts.body, fontSize: 15, fontWeight: 600,
        cursor: "pointer", marginBottom: 12, transition: "all 0.25s",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
      }}>
        {saved ? <><Check size={18} /> Enregistré</> : "Sauvegarder"}
      </button>

      {/* ── Signaler un changement ── */}
      <button onClick={() => setShowProjet(true)} style={{
        width: "100%", padding: "14px", borderRadius: 12,
        border: "none",
        background: config.colors.pageGradient,
        color: "#fff",
        fontFamily: config.fonts.body, fontSize: 14, fontWeight: 500,
        cursor: "pointer", marginBottom: 12,
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
      }}>
        <Megaphone size={17} />
        Signaler un changement / projet
      </button>

      {/* ── Déconnexion ── */}
      <button onClick={handleLogout} style={{
        width: "100%", padding: "14px", borderRadius: 12,
        border: "1px solid rgba(255,255,255,0.25)", background: "transparent",
        color: "rgba(255,255,255,0.6)",
        fontFamily: config.fonts.body, fontSize: 14,
        cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
      }}>
        <LogOut size={16} />
        Se déconnecter
      </button>

      {/* ── Modale projet ── */}
      {showProjet && <ProjetModal onClose={() => setShowProjet(false)} />}
    </div>
  );
}
