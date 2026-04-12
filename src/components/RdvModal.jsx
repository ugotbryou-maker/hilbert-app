import { useState } from "react";
import { X, ChevronLeft, ChevronRight, Check } from "lucide-react";
import config from "../config/cabinet.config.js";
import { mockCreneaux } from "../mock/data.js";

const MOIS = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
const JOURS = ["Dim","Lun","Mar","Mer","Jeu","Ven","Sam"];
const TYPES_RDV = ["Bilan patrimonial", "Point trimestriel", "Question fiscale", "Autre"];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}
function toDateStr(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export default function RdvModal({ onClose, onConfirm }) {
  const today = new Date();
  const [step, setStep] = useState(1); // 1=calendrier, 2=créneau, 3=confirmation
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedHeure, setSelectedHeure] = useState(null);
  const [typeRdv, setTypeRdv] = useState(TYPES_RDV[0]);
  const [confirmed, setConfirmed] = useState(false);

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
  };

  const handleDayClick = (day) => {
    const dateStr = toDateStr(currentYear, currentMonth, day);
    const isPast = new Date(dateStr) < today;
    const hasCreneaux = mockCreneaux[dateStr];
    if (!isPast && hasCreneaux) {
      setSelectedDate(dateStr);
      setSelectedHeure(null);
      setStep(2);
    }
  };

  const handleConfirm = async () => {
    setConfirmed(true);
    await onConfirm({ date: selectedDate, heure: selectedHeure, type: typeRdv });
    setTimeout(() => { onClose(); }, 2000);
  };

  const formatDateDisplay = (str) => {
    if (!str) return "";
    const d = new Date(str);
    return d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  };

  const btnStyle = {
    padding: "12px 24px",
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
    fontFamily: config.fonts.body,
    fontSize: 15,
    fontWeight: 600,
    transition: "opacity 0.2s",
  };

  return (
    <>
      <div
        onClick={onClose}
        style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:300,animation:"fadeIn 0.2s ease" }}
      />
      <div style={{
        position:"fixed",
        top:"50%",left:"50%",
        transform:"translate(-50%,-50%)",
        width:"min(440px, calc(100vw - 32px))",
        maxHeight:"90dvh",
        background:"#FFFFFF",
        borderRadius:20,
        zIndex:301,
        display:"flex",
        flexDirection:"column",
        overflow:"hidden",
        animation:"scaleIn 0.3s ease",
      }}>
        {/* Header */}
        <div style={{ padding:"20px 20px 16px", display:"flex", alignItems:"center", gap:12, borderBottom:"1px solid #F0F0F0" }}>
          {step > 1 && !confirmed && (
            <button onClick={() => setStep(s => s - 1)} style={{ background:"none",border:"none",cursor:"pointer",padding:4,display:"flex" }}>
              <ChevronLeft size={20} color={config.colors.textDark} />
            </button>
          )}
          <div style={{ flex:1 }}>
            <h3 style={{ margin:0, fontFamily:config.fonts.heading, fontSize:18, color:config.colors.textDark }}>
              {step === 1 && "Choisir une date"}
              {step === 2 && "Choisir un créneau"}
              {step === 3 && (confirmed ? "Demande envoyée !" : "Confirmer le rendez-vous")}
            </h3>
            <p style={{ margin:"2px 0 0", fontSize:12, color:config.colors.textLight, fontFamily:config.fonts.body }}>
              Étape {step} / 3
            </p>
          </div>
          <button onClick={onClose} style={{ background:"#F5F5F5",border:"none",borderRadius:"50%",width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer" }}>
            <X size={16} color={config.colors.textDark} />
          </button>
        </div>

        <div style={{ overflowY:"auto", flex:1 }}>
          {/* ÉTAPE 1 — Calendrier */}
          {step === 1 && (
            <div style={{ padding:"16px 20px 20px" }}>
              {/* Type de RDV */}
              <div style={{ marginBottom:16 }}>
                <label style={{ fontSize:12, color:config.colors.textLight, fontFamily:config.fonts.body, display:"block", marginBottom:6 }}>
                  Type de rendez-vous
                </label>
                <select
                  value={typeRdv}
                  onChange={e => setTypeRdv(e.target.value)}
                  style={{ width:"100%", padding:"10px 12px", borderRadius:8, border:"1px solid #E0E0E0", fontFamily:config.fonts.body, fontSize:14, color:config.colors.textDark, outline:"none" }}
                >
                  {TYPES_RDV.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>

              {/* Navigation mois */}
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
                <button onClick={prevMonth} style={{ background:"none",border:"none",cursor:"pointer",padding:4,display:"flex" }}>
                  <ChevronLeft size={18} color={config.colors.textDark} />
                </button>
                <span style={{ fontFamily:config.fonts.body, fontWeight:600, fontSize:15, color:config.colors.textDark }}>
                  {MOIS[currentMonth]} {currentYear}
                </span>
                <button onClick={nextMonth} style={{ background:"none",border:"none",cursor:"pointer",padding:4,display:"flex" }}>
                  <ChevronRight size={18} color={config.colors.textDark} />
                </button>
              </div>

              {/* Jours de la semaine */}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", marginBottom:4 }}>
                {JOURS.map(j => (
                  <div key={j} style={{ textAlign:"center", fontSize:11, color:config.colors.textLight, padding:"4px 0", fontFamily:config.fonts.body }}>
                    {j}
                  </div>
                ))}
              </div>

              {/* Grille jours */}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:4 }}>
                {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const dateStr = toDateStr(currentYear, currentMonth, day);
                  const isPast = new Date(dateStr) < today;
                  const hasSlots = !!mockCreneaux[dateStr];
                  const isSelected = selectedDate === dateStr;
                  return (
                    <button
                      key={day}
                      onClick={() => handleDayClick(day)}
                      disabled={isPast || !hasSlots}
                      style={{
                        aspectRatio:"1",
                        border:"none",
                        borderRadius:8,
                        cursor: isPast || !hasSlots ? "default" : "pointer",
                        background: isSelected ? config.colors.accent
                          : hasSlots && !isPast ? `${config.colors.primary}15`
                          : "transparent",
                        color: isSelected ? "#fff"
                          : isPast ? "#D0D0D0"
                          : hasSlots ? config.colors.primary
                          : config.colors.textLight,
                        fontFamily:config.fonts.body,
                        fontSize:13,
                        fontWeight: hasSlots && !isPast ? 600 : 400,
                        transition:"background 0.15s",
                      }}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
              <p style={{ marginTop:12, fontSize:12, color:config.colors.textLight, fontFamily:config.fonts.body, textAlign:"center" }}>
                Les dates colorées ont des créneaux disponibles
              </p>
            </div>
          )}

          {/* ÉTAPE 2 — Créneaux */}
          {step === 2 && (
            <div style={{ padding:"16px 20px 20px" }}>
              <p style={{ margin:"0 0 16px", fontSize:14, color:config.colors.textLight, fontFamily:config.fonts.body }}>
                {formatDateDisplay(selectedDate)}
              </p>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
                {(mockCreneaux[selectedDate] || []).map(h => (
                  <button
                    key={h}
                    onClick={() => { setSelectedHeure(h); setStep(3); }}
                    style={{
                      padding:"12px 8px",
                      border: selectedHeure === h ? `2px solid ${config.colors.accent}` : "1px solid #E0E0E0",
                      borderRadius:10,
                      background: selectedHeure === h ? `${config.colors.accent}15` : "#FAFAFA",
                      color: selectedHeure === h ? config.colors.accent : config.colors.textDark,
                      fontFamily:config.fonts.body,
                      fontSize:15,
                      fontWeight:600,
                      cursor:"pointer",
                      transition:"all 0.15s",
                    }}
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ÉTAPE 3 — Confirmation */}
          {step === 3 && (
            <div style={{ padding:"20px 20px 24px" }}>
              {confirmed ? (
                <div style={{ textAlign:"center", padding:"20px 0" }}>
                  <div style={{ width:64, height:64, borderRadius:"50%", background:`${config.colors.accent}20`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}>
                    <Check size={32} color={config.colors.accent} />
                  </div>
                  <h4 style={{ fontFamily:config.fonts.heading, fontSize:20, color:config.colors.textDark, margin:"0 0 8px" }}>
                    Demande envoyée !
                  </h4>
                  <p style={{ fontFamily:config.fonts.body, fontSize:14, color:config.colors.textLight, margin:0 }}>
                    Votre conseiller confirme sous 24h.
                  </p>
                </div>
              ) : (
                <>
                  <div style={{ background:"#F8F9FA", borderRadius:12, padding:16, marginBottom:20 }}>
                    <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                      {[
                        { label:"Type", value:typeRdv },
                        { label:"Date", value:formatDateDisplay(selectedDate) },
                        { label:"Heure", value:selectedHeure },
                        { label:"Statut", value:"En attente de confirmation" },
                      ].map(({ label, value }) => (
                        <div key={label} style={{ display:"flex", justifyContent:"space-between" }}>
                          <span style={{ fontSize:13, color:config.colors.textLight, fontFamily:config.fonts.body }}>{label}</span>
                          <span style={{ fontSize:13, color:config.colors.textDark, fontFamily:config.fonts.body, fontWeight:500, textAlign:"right", maxWidth:"60%" }}>{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <p style={{ fontSize:12, color:config.colors.textLight, fontFamily:config.fonts.body, marginBottom:20, lineHeight:1.5 }}>
                    Votre conseiller recevra une notification et confirmera ce créneau dans les 24h.
                  </p>
                  <button
                    onClick={handleConfirm}
                    style={{ ...btnStyle, width:"100%", background:config.colors.accent, color:"#fff" }}
                  >
                    Envoyer la demande
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes scaleIn { from { opacity:0; transform:translate(-50%,-50%) scale(0.95) } to { opacity:1; transform:translate(-50%,-50%) scale(1) } }
      `}</style>
    </>
  );
}
