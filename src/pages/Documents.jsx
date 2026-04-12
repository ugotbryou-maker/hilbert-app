import { useState, useEffect, useRef } from "react";
import { Download, Upload } from "lucide-react";
import config from "../config/cabinet.config.js";
import { useSupabase } from "../hooks/useSupabase.js";
import FournisseurLogo from "../components/FournisseurLogo.jsx";

const FILTRES = [
  { key: "tous",        label: "Tous" },
  { key: "rapport",     label: "Rapport" },
  { key: "attestation", label: "Attestation" },
  { key: "releve",      label: "Relevé" },
  { key: "fiscal",      label: "Fiscal" },
  { key: "contrat",     label: "Contrat" },
];

// ── Carte document — style identique aux cartes placement Figma ──
function DocCard({ doc, onDownload }) {
  return (
    <div className="card-hover" style={{
      background: "#fff",
      borderRadius: 7, height: 68,
      padding: "0 12px",
      display: "flex", alignItems: "center", gap: 10,
      boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
      position: "relative",
    }}>
      {/* Logo/icône fournisseur dans carré gris */}
      <div style={{
        width: 43, height: 43, borderRadius: 5,
        background: "#e8e8e8", flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
      }}>
        <FournisseurLogo
          fournisseurLogo={doc.fournisseurLogo || "hilbert"}
          fournisseurCouleur={doc.fournisseurCouleur}
          nom={doc.fournisseur}
          size={29}
        />
      </div>

      {/* Textes */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <span style={{
          background: config.colors.nameGradient,
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          fontSize: 12, fontWeight: 600, fontFamily: config.fonts.body,
          lineHeight: 1.3, display: "block",
          overflow: "hidden", textOverflow: "ellipsis",
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
        }}>
          {doc.nom}
        </span>
        <span style={{
          color: "#1c1d1e", fontSize: 10, fontWeight: 300,
          fontFamily: config.fonts.body, lineHeight: 1.3, display: "block",
        }}>
          {new Date(doc.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
          {doc.fournisseur ? ` - ${doc.fournisseur}` : ""}
        </span>
      </div>

      {/* Bouton téléchargement — carré gris 30x30 */}
      <button
        onClick={() => onDownload(doc)}
        style={{
          width: 30, height: 30, borderRadius: 5,
          background: "#d9d9d9",
          border: "none",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", flexShrink: 0,
        }}
      >
        <Download size={16} color={config.colors.gradientStart} />
      </button>

      {/* Badge nouveau — point rouge en haut à droite */}
      {doc.nouveau && (
        <div style={{
          position: "absolute", top: -5, right: -5,
          width: 16, height: 16, borderRadius: "50%",
          background: "#E74C3C",
          border: "2px solid transparent",
          display: "flex", alignItems: "center", justifyContent: "center",
        }} />
      )}
    </div>
  );
}

// ── Zone upload ──
function UploadZone({ onUpload }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState(null);

  const handleFile = (file) => {
    if (!file) return;
    setFileName(file.name);
    onUpload(file);
  };

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
      style={{
        borderRadius: 20,
        border: `2px dashed rgba(255,255,255,${dragging ? 0.5 : 0.25})`,
        background: dragging ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.07)",
        padding: "28px 20px",
        cursor: "pointer",
        textAlign: "center",
        transition: "all 0.2s",
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.png"
        style={{ display: "none" }}
        onChange={e => handleFile(e.target.files[0])}
      />
      <Upload size={24} color="rgba(255,255,255,0.4)" style={{ marginBottom: 8 }} />
      {fileName ? (
        <p style={{ margin: "4px 0 0", fontSize: 12, color: "rgba(255,255,255,0.8)", fontFamily: config.fonts.body }}>
          {fileName}
        </p>
      ) : (
        <>
          <p style={{ margin: "4px 0 2px", fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.6)", fontFamily: config.fonts.body }}>
            Déposer un fichier ici
          </p>
          <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.35)", fontFamily: config.fonts.body }}>
            PDF, Word, Excel — max 500 Mo
          </p>
        </>
      )}
    </div>
  );
}

export default function Documents() {
  const { fetchDocuments } = useSupabase();
  const [documents, setDocuments] = useState([]);
  const [filtreActif, setFiltreActif] = useState("tous");
  const [uploadStatus, setUploadStatus] = useState(null);

  useEffect(() => {
    fetchDocuments().then(setDocuments);
  }, []);

  const filtered = filtreActif === "tous"
    ? documents
    : documents.filter((d) => d.type === filtreActif);

  const unreadCount = documents.filter((d) => !d.lu).length;

  const handleDownload = (doc) => {
    // API V2: supabase.storage.from('documents').getPublicUrl(doc.storagePath)
    alert(`Téléchargement de "${doc.nom}" — Disponible en V2 avec Supabase Storage`);
  };

  const handleUpload = (file) => {
    // API V2: supabase.storage.from('documents').upload(path, file) + notif conseiller
    setUploadStatus(`"${file.name}" envoyé à votre conseiller`);
    setTimeout(() => setUploadStatus(null), 4000);
  };

  return (
    <div className="page-enter" style={{ padding: "20px 16px 40px", maxWidth: 480, margin: "0 auto" }}>

      {/* Titre — ExtraLight 25px */}
      <h1 style={{
        fontFamily: config.fonts.heading,
        color: "#fff", fontSize: 25, fontWeight: 200,
        margin: "0 0 4px",
      }}>
        Mes documents
      </h1>

      {/* Compteur nouveaux docs */}
      {unreadCount > 0 && (
        <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 12, margin: "0 0 14px", fontFamily: config.fonts.body, fontWeight: 200 }}>
          {unreadCount} nouveau{unreadCount > 1 ? "x" : ""} document{unreadCount > 1 ? "s" : ""}
        </p>
      )}

      {/* Filtres — scroll horizontal avec pill style Figma */}
      <div style={{
        display: "flex", gap: 6,
        overflowX: "auto", marginBottom: 16, paddingBottom: 2,
        scrollbarWidth: "none",
      }}>
        {FILTRES.map(({ key, label }) => {
          const isActive = key === filtreActif;
          return (
            <button
              key={key}
              onClick={() => setFiltreActif(key)}
              style={{
                padding: "6px 14px",
                borderRadius: 17,
                border: "none",
                cursor: "pointer",
                background: isActive ? config.colors.nameGradient : "#fff",
                color: isActive ? "#fff" : "#666",
                fontFamily: config.fonts.body,
                fontSize: 11,
                fontWeight: isActive ? 300 : 500,
                whiteSpace: "nowrap",
                flexShrink: 0,
                boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                transition: "all 0.2s",
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Liste documents */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 20px", color: "rgba(255,255,255,0.4)", fontFamily: config.fonts.body }}>
          Aucun document dans cette catégorie
        </div>
      ) : (
        <div className="stagger" style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 32 }}>
          {filtered.map((doc) => (
            <DocCard key={doc.id} doc={doc} onDownload={handleDownload} />
          ))}
        </div>
      )}

      {/* Upload section */}
      <h2 style={{
        fontFamily: config.fonts.heading,
        color: "#fff", fontSize: 25, fontWeight: 200,
        margin: "0 0 14px", lineHeight: 1.2,
      }}>
        Vous souhaitez<br />partager un document&nbsp;?
      </h2>

      {uploadStatus ? (
        <div style={{
          borderRadius: 12, background: "rgba(0,240,114,0.15)",
          border: "1px solid rgba(0,240,114,0.3)",
          padding: "14px 16px",
          color: config.colors.perfGreen,
          fontFamily: config.fonts.body, fontSize: 13,
          textAlign: "center",
        }}>
          ✓ {uploadStatus}
        </div>
      ) : (
        <UploadZone onUpload={handleUpload} />
      )}
    </div>
  );
}
