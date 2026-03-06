import { MessageCircle } from "lucide-react";

const WhatsAppFab = () => {
  const whatsappUrl = "https://api.whatsapp.com/send/?phone=556592824709&text=Olá%2C+gostaria+de+fazer+um+orçamento&type=phone_number&app_absent=0";

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 hover:shadow-[#25D366]/50 animate-bounce-slow"
      aria-label="Contato via WhatsApp"
    >
      <MessageCircle size={36} fill="white" stroke="white" />
    </a>
  );
};

export default WhatsAppFab;
