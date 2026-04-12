import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import config from "../config/cabinet.config.js";
import HilbertLogo from "../components/HilbertLogo.jsx";
import TopoBackground from "../components/TopoBackground.jsx";

// ── Bouton SSO (Google / Apple) ──
function SsoButton({ icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: "100%", padding: "11px 16px",
        borderRadius: 6,
        border: "1.5px solid rgba(255,255,255,0.85)",
        background: "#fff",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
        cursor: "pointer",
        fontFamily: config.fonts.body, fontSize: 14, fontWeight: 500,
        color: "#222",
        transition: "opacity 0.2s",
      }}
    >
      {icon}
      {label}
    </button>
  );
}

// Icône Google SVG
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
    <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
  </svg>
);

// Icône Apple SVG
const AppleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 814 1000" fill="#000">
    <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-37.5-167.2-107.1c-53-62.5-101.1-165.5-101.1-263 0-174.3 113.4-266.5 224.4-266.5 59.2 0 108.7 39.4 146.4 39.4 36 0 92.7-41.8 159.1-41.8 25.5 0 108.2 2.6 168.1 74.6zm-56.8-144.1c28.5-33.7 48.3-81 48.3-128.3 0-6.5-.6-13.1-1.9-18.3-45.2 1.7-98.8 30.2-131.4 68.7-26.5 29.9-49.7 76.5-49.7 124.5 0 7.1 1.3 14.2 1.9 16.5 3.2.6 8.4 1.3 13.6 1.3 40.8 0 92.1-27.8 119.2-64.4z"/>
  </svg>
);

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [showEmailForm, setShowEmailForm] = useState(true); // V1: formulaire visible par défaut
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await onLogin(email, password);
    setLoading(false);
    if (result.success) {
      navigate("/");
    } else {
      setError(result.error || "Identifiants incorrects");
    }
  };

  return (
    <div style={{
      minHeight: "100dvh",
      background: config.colors.pageGradient,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 24px",
      position: "relative",
      overflow: "hidden",
      fontFamily: config.fonts.body,
    }}>
      <TopoBackground opacity={0.07} />

      {/* Zone haute — Logo */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 60 }}>
        <HilbertLogo height={52} white={true} />
      </div>

      {/* Zone milieu — Texte bienvenue */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", width: "100%", maxWidth: 360, position: "relative", zIndex: 1 }}>
        <div style={{ marginBottom: 12 }}>
          <p style={{ margin: "0 0 0", color: "#fff", fontFamily: config.fonts.heading, fontSize: 30, fontWeight: 500, lineHeight: 1.2 }}>
            Bienvenue
          </p>
          <p style={{ margin: "0 0 16px", color: "#fff", fontFamily: config.fonts.heading, fontSize: 30, fontWeight: 200, lineHeight: 1.2 }}>
            sur votre espace
          </p>
          <p style={{ margin: 0, color: "rgba(255,255,255,0.75)", fontSize: 15, fontWeight: 300, fontFamily: config.fonts.body, lineHeight: 1.5 }}>
            connectez-vous pour accéder<br />à votre compte
          </p>
        </div>
      </div>

      {/* Zone basse — Boutons */}
      <div style={{ width: "100%", maxWidth: 360, paddingBottom: "calc(48px + env(safe-area-inset-bottom))", position: "relative", zIndex: 1 }}>
        {/* Formulaire email — visible par défaut (V1) */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {/* Email */}
          <input
            type="email"
            placeholder="Adresse e-mail"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoComplete="email"
            style={{
              width: "100%", padding: "13px 16px",
              borderRadius: 8, border: "1.5px solid rgba(255,255,255,0.25)",
              background: "rgba(255,255,255,0.12)", color: "#fff",
              fontFamily: config.fonts.body, fontSize: 14, outline: "none",
              boxSizing: "border-box",
            }}
          />
          {/* Mot de passe */}
          <div style={{ position: "relative" }}>
            <input
              type={showPass ? "text" : "password"}
              placeholder="Mot de passe"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              style={{
                width: "100%", padding: "13px 44px 13px 16px",
                borderRadius: 8, border: "1.5px solid rgba(255,255,255,0.25)",
                background: "rgba(255,255,255,0.12)", color: "#fff",
                fontFamily: config.fonts.body, fontSize: 14, outline: "none",
                boxSizing: "border-box",
              }}
            />
            <button type="button" onClick={() => setShowPass(v => !v)}
              style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", display: "flex", padding: 4 }}>
              {showPass ? <EyeOff size={18} color="rgba(255,255,255,0.4)" /> : <Eye size={18} color="rgba(255,255,255,0.4)" />}
            </button>
          </div>

          {error && (
            <div style={{ background: "rgba(231,76,60,0.15)", border: "1px solid rgba(231,76,60,0.3)", borderRadius: 8, padding: "10px 14px" }}>
              <p style={{ color: "#E74C3C", fontSize: 13, margin: 0 }}>{error}</p>
            </div>
          )}

          {/* Se connecter — bouton blanc */}
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "13px", borderRadius: 8,
              border: "none",
              background: loading ? "rgba(255,255,255,0.3)" : "#fff",
              color: config.colors.gradientStart,
              fontFamily: config.fonts.body, fontSize: 14, fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              marginBottom: 4,
            }}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        {/* SSO Google / Apple */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <SsoButton
            icon={<GoogleIcon />}
            label="Continue with Google"
            onClick={() => {
              /* V2: supabase.auth.signInWithOAuth({ provider: 'google' }) */
              onLogin("test@hilbert-wm.fr", "demo").then(r => r.success && navigate("/"));
            }}
          />
          <SsoButton
            icon={<AppleIcon />}
            label="Continue with Apple"
            onClick={() => {
              /* V2: supabase.auth.signInWithOAuth({ provider: 'apple' }) */
              onLogin("test@hilbert-wm.fr", "demo").then(r => r.success && navigate("/"));
            }}
          />
        </div>

        <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 11, fontFamily: config.fonts.body, margin: "16px 0 0", textAlign: "center" }}>
          Demo : test@hilbert-wm.fr / demo
        </p>
      </div>

      <style>{`
        input::placeholder { color: rgba(255,255,255,0.35) !important; }
        input:focus { border-color: rgba(255,255,255,0.5) !important; }
      `}</style>
    </div>
  );
}
