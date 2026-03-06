import { MessageCircle } from "lucide-react";

const WhatsAppFab = () => {
  const whatsappUrl = "https://api.whatsapp.com/send/?phone=556592824709&text=Olá%2C+gostaria+de+fazer+um+orçamento&type=phone_number&app_absent=0";

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110 active:scale-95"
      aria-label="Contato via WhatsApp"
    >
      <MessageCircle size={32} fill="white" stroke="white" />
    </a>
  );
};

export default WhatsAppFab;
