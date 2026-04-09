import { useEffect, useState } from "react";

// Horário de atendimento (fuso America/Cuiaba = UTC-4)
// seg–sex: 8h–18h | sáb: 8h–12h | dom: fechado
const isOpen = (): boolean => {
  const now = new Date(
    new Date().toLocaleString("en-US", { timeZone: "America/Cuiaba" })
  );
  const day  = now.getDay();   // 0 = dom, 6 = sáb
  const hour = now.getHours() + now.getMinutes() / 60;

  if (day === 0) return false;                       // domingo
  if (day === 6) return hour >= 8 && hour < 12;     // sábado
  return hour >= 8 && hour < 18;                     // seg–sex
};

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.554 4.103 1.523 5.824L.057 23.273a.75.75 0 0 0 .92.92l5.455-1.466A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.713 9.713 0 0 1-4.953-1.355l-.355-.211-3.676.988.995-3.591-.232-.371A9.712 9.712 0 0 1 2.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/>
  </svg>
);

const WHATSAPP_URL = "https://api.whatsapp.com/send/?phone=556592824709&text=Olá%2C+gostaria+de+fazer+um+orçamento&type=phone_number&app_absent=0";

const StatusBadge = () => {
  const open = isOpen();
  const [visible, setVisible] = useState(false);
  const isMakerGym = window.location.pathname.startsWith("/makergym");

  // aparece suavemente após 2s
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(t);
  }, []);

  if (isMakerGym) return null;

  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed bottom-24 left-4 z-[9990] flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-card/95 backdrop-blur border shadow-xl transition-all duration-700 ease-out group ${
        open
          ? "border-green-500/30 hover:border-green-500/60"
          : "border-border hover:border-primary/30"
      } ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"}`}
    >
      {/* status dot */}
      <span className="relative flex h-2.5 w-2.5 shrink-0">
        {open && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
        )}
        <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${open ? "bg-green-400" : "bg-muted-foreground/50"}`} />
      </span>

      <div>
        <p className="text-xs font-bold text-foreground leading-tight">
          {open ? "Atendendo agora" : "Fora do horário"}
        </p>
        <p className="text-[11px] text-muted-foreground leading-tight">
          {open ? "Resposta em até 10 min · WhatsApp" : "Seg–Sex 8h–18h · Sáb 8h–12h"}
        </p>
      </div>

      <WhatsAppIcon className={`transition-colors ${open ? "text-green-400" : "text-muted-foreground"} group-hover:text-primary`} />
    </a>
  );
};

export default StatusBadge;
