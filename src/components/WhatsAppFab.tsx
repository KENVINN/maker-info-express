import { MessageCircle } from "lucide-react";

const WHATSAPP_URL = "https://wa.me/5565999999999?text=Olá! Gostaria de fazer um orçamento.";

const WhatsAppFab = () => {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Fale pelo WhatsApp"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary flex items-center justify-center animate-pulse-neon hover:scale-110 transition-transform"
    >
      <MessageCircle size={26} className="text-primary-foreground" />
    </a>
  );
};

export default WhatsAppFab;
