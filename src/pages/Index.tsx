import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import BeforeAfterSection from "@/components/BeforeAfterSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import Footer from "@/components/Footer";
import WhatsAppFab from "https://api.whatsapp.com/send/?phone=556592824709&text=Ol%C3%A1%2C+gostaria+de+fazer+um+or%C3%A7amento&type=phone_number&app_absent=0";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <HowItWorksSection />
      <BeforeAfterSection />
      <Footer />
      <WhatsAppFab />
    </div>
  );
};

export default Index;
