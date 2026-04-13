import { useState, useEffect, useRef } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Home, PieChart, FileText, Phone, Newspaper, Bell, Menu, X, LogOut, ChevronRight } from "lucide-react";
import config from "../config/cabinet.config.js";
import TopoBackground from "./TopoBackground.jsx";
import NotificationPanel from "./NotificationPanel.jsx";
import HilbertLogo from "./HilbertLogo.jsx";

const NAV_ITEMS = [
  { path: "/", label: "Accueil", icon: Home },
  { path: "/portefeuille", label: "Portefeuille", icon: PieChart },
  { path: "/documents", label: "Documents", icon: FileText },
  { path: "/contact", label: "Contact", icon: Phone },
  { path: "/actualites", label: "Actualités", icon: Newspaper },
];

// Gradients par page — les pages "standard" utilisent le gradient Figma
// Les pages spéciales (contact) gardent leur couleur propre
const PAGE_BG = {
  "/": config.colors.homeBackground,
  "/portefeuille": config.colors.portefeuilleBackground,
  "/documents": config.colors.documentsBackground,
  "/contact": config.colors.contactBackground,
  "/actualites": config.colors.actualitesBackground,
};

const PAGE_GRADIENT = {
  "/": config.colors.pageGradient,
  "/portefeuille": config.colors.pageGradient,
  "/documents": config.colors.pageGradient,
  "/contact": `linear-gradient(180deg, ${config.colors.contactBackground} 0%, #8B4513 100%)`,
  "/actualites": config.colors.pageGradient,
  "/profil": config.colors.pageGradient,
};

export default function Layout({ children, notifications, onMarkRead, user, onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [bgColor, setBgColor] = useState(PAGE_BG[location.pathname] || config.colors.homeBackground);
  const [bgGradient, setBgGradient] = useState(PAGE_GRADIENT[location.pathname] || config.colors.pageGradient);

  const unreadCount = notifications.filter((n) => !n.lu).length;

  // ── Scroll-hide header (mobile only) ──
  const mainRef = useRef(null);
  const lastScrollY = useRef(0);
  const [headerVisible, setHeaderVisible] = useState(true);

  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const onScroll = () => {
      const y = el.scrollTop;
      if (y > lastScrollY.current && y > 50) {
        setHeaderVisible(false);
      } else {
        setHeaderVisible(true);
      }
      lastScrollY.current = y;
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setBgColor(PAGE_BG[location.pathname] || config.colors.homeBackground);
    setBgGradient(PAGE_GRADIENT[location.pathname] || config.colors.pageGradient);
    setMenuOpen(false);
    setHeaderVisible(true);
    lastScrollY.current = 0;
  }, [location.pathname]);

  const initials = user ? `${user.prenom?.[0] || ""}${user.nom?.[0] || ""}`.toUpperCase() : "?";

  const handleLogout = () => { onLogout(); navigate("/login"); };

  return (
    <div style={{ display: "flex", height: "100dvh", width: "100vw", overflow: "hidden", fontFamily: config.fonts.body }}>
      {/* Fond gradient avec transition */}
      <div style={{
        position: "fixed", inset: 0,
        background: bgGradient,
        transition: `background ${config.transitions.duration} ${config.transitions.easing}`,
        zIndex: -1,
      }} />
      <TopoBackground opacity={0.09} />

      {/* ═══ DESKTOP SIDEBAR ═══ */}
      <aside className="desktop-sidebar" style={{
        width: 220, height: "100dvh",
        background: "rgba(0,0,0,0.2)", backdropFilter: "blur(8px)",
        display: "flex", flexDirection: "column", padding: "24px 0",
        flexShrink: 0, position: "relative", zIndex: 10,
      }}>
        <div style={{ padding: "0 20px 24px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <HilbertLogo height={36} white={true} />
        </div>

        <nav style={{ flex: 1, padding: "16px 12px" }}>
          {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
            const isActive = location.pathname === path;
            return (
              <NavLink key={path} to={path} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 12px", borderRadius: 10, textDecoration: "none",
                marginBottom: 4,
                background: isActive ? "rgba(255,255,255,0.18)" : "transparent",
                transition: "background 0.2s",
              }}>
                <Icon size={18} color={isActive ? "#fff" : "rgba(255,255,255,0.55)"} />
                <span style={{ color: isActive ? "#fff" : "rgba(255,255,255,0.55)", fontSize: 14, fontWeight: isActive ? 600 : 400 }}>
                  {label}
                </span>
                {isActive && <ChevronRight size={14} color="rgba(255,255,255,0.3)" style={{ marginLeft: "auto" }} />}
              </NavLink>
            );
          })}
        </nav>

        <div style={{ padding: "16px 12px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <button onClick={() => setNotifOpen(true)} style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "10px 12px", borderRadius: 10,
            background: "transparent", border: "none", cursor: "pointer", width: "100%", marginBottom: 4, position: "relative",
          }}>
            <Bell size={18} color="rgba(255,255,255,0.55)" />
            <span style={{ color: "rgba(255,255,255,0.55)", fontSize: 14 }}>Notifications</span>
            {unreadCount > 0 && (
              <span style={{
                background: "#E74C3C", color: "#fff", borderRadius: "50%",
                width: 18, height: 18, fontSize: 10, fontWeight: 700,
                display: "flex", alignItems: "center", justifyContent: "center", marginLeft: "auto",
              }}>{unreadCount}</span>
            )}
          </button>
          <button onClick={() => navigate("/profil")} style={{
            display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", marginBottom: 4,
            background: location.pathname === "/profil" ? "rgba(255,255,255,0.18)" : "transparent",
            border: "none", cursor: "pointer", width: "100%", borderRadius: 10,
          }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: config.colors.accent, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ color: "#fff", fontSize: 12, fontWeight: 600 }}>{initials}</span>
            </div>
            <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
              <div style={{ color: "#fff", fontSize: 13, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.prenom} {user?.nom}</div>
              <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 11, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.email}</div>
            </div>
          </button>
          <button onClick={handleLogout} style={{
            display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10,
            background: "transparent", border: "none", cursor: "pointer", width: "100%",
          }}>
            <LogOut size={18} color="rgba(255,255,255,0.35)" />
            <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 14 }}>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* ═══ MOBILE HEADER ═══ */}
      <div className="mobile-header" style={{
        position: "fixed", top: 0, left: 0, right: 0,
        height: "calc(52px + env(safe-area-inset-top))",
        display: "flex", alignItems: "flex-end", justifyContent: "space-between",
        paddingLeft: 16, paddingRight: 16,
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: 8,
        zIndex: 50,
        opacity: headerVisible ? 1 : 0,
        transform: headerVisible ? "translateY(0)" : "translateY(-100%)",
        transition: "opacity 0.3s ease, transform 0.3s ease",
        pointerEvents: headerVisible ? "auto" : "none",
      }}>
        <button onClick={() => setMenuOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex" }}>
          <Menu size={24} color="rgba(255,255,255,0.9)" />
        </button>
        <HilbertLogo height={32} white={true} />
        <button onClick={() => setNotifOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex", position: "relative" }}>
          <Bell size={24} color="rgba(255,255,255,0.9)" />
          {unreadCount > 0 && (
            <span style={{
              position: "absolute", top: 0, right: 0,
              background: "#E74C3C", color: "#fff", borderRadius: "50%",
              width: 16, height: 16, fontSize: 9, fontWeight: 700,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>{unreadCount}</span>
          )}
        </button>
      </div>

      {/* ═══ MOBILE MENU SLIDE-IN ═══ */}
      {menuOpen && (
        <>
          <div onClick={() => setMenuOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, animation: "fadeIn 0.2s ease" }} />
          <div style={{
            position: "fixed", top: 0, left: 0, bottom: 0, width: 280,
            background: "rgba(3,51,74,0.97)", backdropFilter: "blur(16px)",
            zIndex: 101, display: "flex", flexDirection: "column", padding: "24px 0",
            animation: "slideInLeft 0.3s ease",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px 24px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
              <HilbertLogo height={34} white={true} />
              <button onClick={() => setMenuOpen(false)} style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <X size={16} color="#fff" />
              </button>
            </div>
            <nav style={{ flex: 1, padding: "16px 12px" }}>
              {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
                const isActive = location.pathname === path;
                return (
                  <NavLink key={path} to={path} onClick={() => setMenuOpen(false)} style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "12px 14px", borderRadius: 12, textDecoration: "none", marginBottom: 4,
                    background: isActive ? "rgba(255,255,255,0.15)" : "transparent",
                  }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: `${PAGE_BG[path]}60`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon size={18} color="#fff" />
                    </div>
                    <span style={{ color: "#fff", fontSize: 15, fontWeight: isActive ? 600 : 400 }}>{label}</span>
                    {isActive && <ChevronRight size={14} color="rgba(255,255,255,0.3)" style={{ marginLeft: "auto" }} />}
                  </NavLink>
                );
              })}
            </nav>
            <div style={{ padding: "16px 12px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
              <button onClick={() => { setMenuOpen(false); navigate("/profil"); }} style={{
                display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", marginBottom: 8,
                background: "rgba(255,255,255,0.05)", border: "none", cursor: "pointer", width: "100%", borderRadius: 12,
              }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: config.colors.accent, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{initials}</span>
                </div>
                <div style={{ textAlign: "left" }}>
                  <div style={{ color: "#fff", fontSize: 13, fontWeight: 500 }}>{user?.prenom} {user?.nom}</div>
                  <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 11 }}>{user?.email}</div>
                </div>
              </button>
              <button onClick={handleLogout} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 12,
                background: "rgba(255,255,255,0.05)", border: "none", cursor: "pointer", width: "100%",
              }}>
                <LogOut size={18} color="rgba(255,255,255,0.4)" />
                <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>Déconnexion</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* ═══ CONTENU PRINCIPAL ═══ */}
      <main ref={mainRef} className="main-content" style={{
        flex: 1, height: "100dvh", overflowY: "auto",
        position: "relative", zIndex: 1,
      }}>
        {children}
      </main>

      {/* ═══ MOBILE BOTTOM NAV ═══ */}
      <nav className="mobile-bottom-nav" style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        background: "#fff",
        boxShadow: "0 -1px 12px rgba(0,0,0,0.07)",
        zIndex: 50,
        paddingBottom: "env(safe-area-inset-bottom)",
      }}>
        {/* Zone icônes : hauteur fixe 52px, indépendante du safe area */}
        <div style={{
          height: 52,
          display: "flex", alignItems: "center", justifyContent: "space-around",
        }}>
          {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
            const isActive = location.pathname === path;
            return (
              <NavLink key={path} to={path} title={label} style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                textDecoration: "none", flex: 1, height: "100%",
              }}>
                <div style={{
                  width: 38, height: 36, borderRadius: 10,
                  background: isActive ? config.colors.pageGradient : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "background 0.2s",
                }}>
                  <Icon size={19} color={isActive ? "#fff" : "#b0b8c1"} />
                </div>
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Panel notifications */}
      {notifOpen && (
        <NotificationPanel notifications={notifications} onClose={() => setNotifOpen(false)} onMarkRead={onMarkRead} />
      )}

      <style>{`
        @keyframes fadeIn { from{opacity:0}to{opacity:1} }
        @keyframes slideInLeft { from{transform:translateX(-100%)}to{transform:translateX(0)} }
        @keyframes slideInRight { from{transform:translateX(100%)}to{transform:translateX(0)} }

        .desktop-sidebar { display: flex !important; }
        .mobile-header { display: none !important; }
        .mobile-bottom-nav { display: none !important; }

        @media (max-width: 768px) {
          .desktop-sidebar { display: none !important; }
          .mobile-header { display: flex !important; }
          .mobile-bottom-nav { display: flex !important; }
          .main-content {
            padding-top: calc(52px + env(safe-area-inset-top)) !important;
            padding-bottom: calc(56px + env(safe-area-inset-bottom)) !important;
          }
        }
      `}</style>
    </div>
  );
}
