import { useEffect } from "react";
import { X, FileText, Calendar, TrendingUp, Newspaper } from "lucide-react";
import config from "../config/cabinet.config.js";

const TYPE_META = {
  doc: { icon: FileText, label: "Document", color: config.colors.primary },
  rdv: { icon: Calendar, label: "Rendez-vous", color: config.colors.accent },
  perf: { icon: TrendingUp, label: "Performance", color: "#27AE60" },
  news: { icon: Newspaper, label: "Actualité", color: config.colors.primaryLight },
};

export default function NotificationPanel({ notifications, onClose, onMarkRead }) {
  const unread = notifications.filter((n) => !n.lu);

  // Fermer sur Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.4)",
          zIndex: 200,
          animation: "fadeIn 0.2s ease",
        }}
      />

      {/* Panel */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: "min(360px, 100vw)",
          height: "100dvh",
          background: "#FFFFFF",
          zIndex: 201,
          display: "flex",
          flexDirection: "column",
          boxShadow: "-4px 0 24px rgba(0,0,0,0.15)",
          animation: "slideInRight 0.3s ease",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 20px 16px",
            borderBottom: "1px solid #F0F0F0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h2 style={{ fontFamily: config.fonts.heading, fontSize: 20, margin: 0, color: config.colors.textDark }}>
              Notifications
            </h2>
            {unread.length > 0 && (
              <p style={{ margin: "2px 0 0", fontSize: 13, color: config.colors.textLight, fontFamily: config.fonts.body }}>
                {unread.length} non lue{unread.length > 1 ? "s" : ""}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            style={{
              background: "#F5F5F5",
              border: "none",
              borderRadius: "50%",
              width: 36,
              height: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <X size={18} color={config.colors.textDark} />
          </button>
        </div>

        {/* Liste */}
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
          {notifications.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 20px", color: config.colors.textLight, fontFamily: config.fonts.body }}>
              Aucune notification
            </div>
          ) : (
            notifications.map((notif) => {
              const meta = TYPE_META[notif.type] || TYPE_META.news;
              const Icon = meta.icon;
              return (
                <div
                  key={notif.id}
                  onClick={() => onMarkRead(notif.id)}
                  style={{
                    display: "flex",
                    gap: 12,
                    padding: "14px 20px",
                    cursor: "pointer",
                    background: notif.lu ? "transparent" : `${config.colors.primary}08`,
                    borderLeft: notif.lu ? "3px solid transparent" : `3px solid ${meta.color}`,
                    transition: "background 0.2s",
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: `${meta.color}15`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={18} color={meta.color} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                      <p style={{
                        margin: 0,
                        fontSize: 14,
                        fontWeight: notif.lu ? 400 : 600,
                        color: config.colors.textDark,
                        fontFamily: config.fonts.body,
                      }}>
                        {notif.titre}
                      </p>
                      <span style={{ fontSize: 11, color: config.colors.textLight, flexShrink: 0, fontFamily: config.fonts.body }}>
                        {formatDate(notif.date)}
                      </span>
                    </div>
                    <p style={{
                      margin: "3px 0 0",
                      fontSize: 13,
                      color: config.colors.textLight,
                      fontFamily: config.fonts.body,
                      lineHeight: 1.4,
                    }}>
                      {notif.message}
                    </p>
                  </div>
                  {!notif.lu && (
                    <div style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: meta.color,
                      flexShrink: 0,
                      marginTop: 6,
                    }} />
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {unread.length > 0 && (
          <div style={{ padding: "16px 20px", borderTop: "1px solid #F0F0F0" }}>
            <button
              onClick={() => notifications.forEach((n) => !n.lu && onMarkRead(n.id))}
              style={{
                width: "100%",
                padding: "10px",
                background: "transparent",
                border: `1px solid ${config.colors.primary}`,
                borderRadius: 8,
                color: config.colors.primary,
                fontFamily: config.fonts.body,
                fontSize: 14,
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              Tout marquer comme lu
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideInRight { from { transform: translateX(100%) } to { transform: translateX(0) } }
      `}</style>
    </>
  );
}
