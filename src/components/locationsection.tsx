import { MapPin, Clock, Navigation } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import SpotlightCard from "./SpotlightCard";

const WHATSAPP_URL = "https://api.whatsapp.com/send/?phone=556592824709&text=Olá%2C+gostaria+de+fazer+um+orçamento&type=phone_number&app_absent=0";
const MAPS_URL = "https://www.google.com/maps/search/?api=1&query=Rua+Olinda+Jardim+União+Várzea+Grande+MT+78118-720";

const LAT = -15.6540;
const LON = -56.0925;
const BBOX = `${LON - 0.008},${LAT - 0.005},${LON + 0.008},${LAT + 0.005}`;
const MAP_SRC = `https://www.openstreetmap.org/export/embed.html?bbox=${BBOX}&layer=mapnik&marker=${LAT},${LON}`;

const LocationSection = () => (
  <section id="localizacao" className="py-20 md:py-28 bg-card">
    <div className="container px-4 max-w-5xl mx-auto">
      <ScrollReveal>
        <h2 className="font-heading text-3xl md:text-4xl font-black text-center mb-4">
          Onde nos{" "}
          <span className="text-gradient-neon">Encontrar</span>
        </h2>
        <p className="text-muted-foreground text-center mb-12 text-sm">
          Venha nos visitar ou solicite a busca na sua porta 🛵
        </p>
      </ScrollReveal>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <ScrollReveal>
          <div className="rounded-2xl overflow-hidden neon-border-cyan h-72">
            <iframe
              title="Localização Maker Info"
              src={MAP_SRC}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "288px" }}
              allowFullScreen
              loading="lazy"
            />
          </div>
          <a
            href={MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-border text-muted-foreground hover:text-primary hover:border-primary transition-colors text-sm"
          >
            <Navigation size={16} />
            Abrir rota no Google Maps
          </a>
        </ScrollReveal>

        <div className="flex flex-col gap-5">
          <ScrollReveal delay={100}>
            <SpotlightCard className="p-6 rounded-2xl bg-background neon-border-purple">
              <div className="flex items-start gap-3">
                <MapPin size={22} className="text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-heading font-bold text-base mb-1">Endereço</h3>
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
            </SpotlightCard>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <SpotlightCard className="p-6 rounded-2xl bg-background neon-border-purple">
              <div className="flex items-center gap-3 mb-3">
                <Clock size={22} className="text-primary shrink-0" />
                <h3 className="font-heading font-bold text-base">Horário de Atendimento</h3>
              </div>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                <li className="flex justify-between border-b border-border pb-1.5">
                  <span>Segunda a Sexta</span>
                  <span className="text-foreground font-medium">08:00 – 18:00</span>
                </li>
                <li className="flex justify-between border-b border-border pb-1.5">
                  <span>Sábado</span>
                  <span className="text-foreground font-medium">08:00 – 12:00</span>
                </li>
                <li className="flex justify-between">
                  <span>Domingo</span>
                  <span className="text-destructive font-medium">Fechado</span>
                </li>
              </ul>
            </SpotlightCard>
          </ScrollReveal>

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
  </section>
);

export default LocationSection;
