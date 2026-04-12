import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import Portefeuille from "./pages/Portefeuille.jsx";
import Documents from "./pages/Documents.jsx";
import Contact from "./pages/Contact.jsx";
import Actualites from "./pages/Actualites.jsx";
import Login from "./pages/Login.jsx";
import Profil from "./pages/Profil.jsx";
import { useSupabase } from "./hooks/useSupabase.js";

// Enregistrement du Service Worker PWA
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => console.log("[PWA] Service Worker enregistré", reg))
      .catch((err) => console.warn("[PWA] Service Worker échec", err));
  });
}

function AppInner() {
  const { login, logout, fetchNotifications, markNotificationRead } = useSupabase();
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  // API V2: état auth depuis Supabase session (pas localStorage ni sessionStorage)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // API V2: supabase.auth.getSession() + onAuthStateChange
  useEffect(() => {
    // Mock V1 : pas de session persistante
    setAuthChecked(true);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications().then(setNotifications);
    }
  }, [isAuthenticated]);

  const handleLogin = async (email, password) => {
    const result = await login(email, password);
    if (result.success) {
      setUser(result.user);
      setIsAuthenticated(true);
    }
    return result;
  };

  const handleLogout = async () => {
    setUser(null);
    setIsAuthenticated(false);
    setNotifications([]);
  };

  const handleMarkRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, lu: true } : n))
    );
    markNotificationRead(id);
  };

  if (!authChecked) return null;

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Layout
      notifications={notifications}
      onMarkRead={handleMarkRead}
      user={user}
      onLogout={handleLogout}
    >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/portefeuille" element={<Portefeuille />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/actualites" element={<Actualites />} />
        <Route path="/profil" element={<Profil onLogout={handleLogout} />} />
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  );
}
