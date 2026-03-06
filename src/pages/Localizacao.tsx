import { MapPin, Clock, Phone, Navigation } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";

const WHATSAPP_URL = "https://api.whatsapp.com/send/?phone=556592824709&text=Olá%2C+gostaria+de+fazer+um+orçamento&type=phone_number&app_absent=0";
const MAPS_URL = "https://www.google.com/maps/dir/?api=1&destination=Rua+Olinda+Jardim+União+Várzea+Grande+MT+78118-720";
const MAPS_EMBED = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3842.0!2d-56.13!3d-15.65!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sRua+Olinda%2C+Jardim+União%2C+Várzea+Grande+-+MT%2C+78118-720!5e0!3m2!1spt-BR!2sbr!4v1600000000000!5m2!1spt-BR!2sbr";

const horarios = [
  { dia: "Segunda-feira", hora: "08:00 – 18:00" },
  { dia: "Terça-feira",   hora: "08:00 – 18:00" },
  { dia: "Quarta-feira",  hora: "08:00 – 18:00" },
  { dia: "Quinta-feira",  hora: "08:00 – 18:00" },
  { dia: "Sexta-feira",   hora: "08:00 – 18:00" },
  { dia: "Sábado",        hora: "08:00 – 12:00" },
  { dia: "Domingo",       hora: "Fechado" },
];

const Localizacao = () => {
  const hoje = new Date().getDay(); // 0=Dom, 1=Seg...

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-20">
        <div className="container px-4 max-w-5xl mx-auto">

          {/* Header */}
          <ScrollReveal>
            <div className="text-center mb-14">
              <h1 className="font-heading text-4xl md:text-5xl font-black mb-4">
                Nossa{" "}
                <span className="text-gradient-neon">Localização</span>
              </h1>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                Estamos em Várzea Grande — MT. Mas se preferir, buscamos o seu equipamento na sua porta!
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Mapa */}
            <ScrollReveal>
              <div className="rounded-2xl overflow-hidden neon-border-cyan h-80 lg:h-full min-h-[320px]">
                <iframe
                  title="Localização Maker Info"
                  src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY&q=Rua+Olinda,+Jardim+União,+Várzea+Grande,+MT,+78118-720&language=pt-BR`}
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: "320px" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  onError={(e) => {
                    // fallback to static map link if embed fails
                    (e.target as HTMLIFrameElement).style.display = "none";
                  }}
                />
              </div>

              {/* Fallback caso embed não carregue */}
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-border text-muted-foreground hover:text-primary hover:border-primary transition-colors text-sm"
              >
                <Navigation size={16} />
                Abrir no Google Maps
              </a>
            </ScrollReveal>

            {/* Infos */}
            <div className="flex flex-col gap-6">

              {/* Endereço */}
              <ScrollReveal delay={100}>
                <div className="p-6 rounded-2xl bg-card neon-border-purple">
                  <div className="flex items-start gap-3">
                    <MapPin size={22} className="text-primary shrink-0 mt-0.5" />
                    <div>
                      <h2 className="font-heading font-bold text-lg mb-1">Endereço</h2>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Rua Olinda, Q: V L: 11<br />
                        Jardim União — Várzea Grande, MT<br />
                        CEP: 78118-720
                      </p>
                      <a
                        href={MAPS_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 mt-3 text-primary text-sm font-semibold hover:brightness-125 transition-all"
                      >
                        <Navigation size={14} />
                        Como chegar
                      </a>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              {/* Horários */}
              <ScrollReveal delay={200}>
                <div className="p-6 rounded-2xl bg-card neon-border-purple">
                  <div className="flex items-center gap-3 mb-4">
                    <Clock size={22} className="text-primary shrink-0" />
                    <h2 className="font-heading font-bold text-lg">Horário de Atendimento</h2>
                  </div>
                  <ul className="space-y-2">
                    {horarios.map((item, i) => {
                      // hoje: 0=Dom(6), 1=Seg(0)...
                      const diaIndex = i === 6 ? 0 : i + 1;
                      const isHoje = diaIndex === hoje;
                      return (
                        <li
                          key={i}
                          className={`flex justify-between text-sm py-1.5 border-b border-border last:border-0 ${
                            isHoje ? "text-primary font-semibold" : "text-muted-foreground"
                          }`}
                        >
                          <span>{item.dia} {isHoje && <span className="ml-1 text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded">hoje</span>}</span>
                          <span className={item.hora === "Fechado" ? "text-destructive" : ""}>{item.hora}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </ScrollReveal>

              {/* WhatsApp CTA */}
              <ScrollReveal delay={300}>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full py-4 rounded-xl bg-[#25D366] text-white font-heading font-bold text-base hover:brightness-110 transition-all shadow-lg shadow-[#25D366]/20"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.554 4.103 1.523 5.824L.057 23.273a.75.75 0 0 0 .92.92l5.455-1.466A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.713 9.713 0 0 1-4.953-1.355l-.355-.211-3.676.988.995-3.591-.232-.371A9.712 9.712 0 0 1 2.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/>
                  </svg>
                  Prefere que buscamos aí? Fale conosco!
                </a>
              </ScrollReveal>

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Localizacao;
