import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Servicos from "./pages/Servicos";
import Localizacao from "./pages/Localizacao";
import Pedido from "./pages/Pedido";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import CircuitBackground from "./components/CircuitBackground";
import ExitPopup from "./components/ExitPopup";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <div className="relative min-h-screen bg-background">
        <CircuitBackground />
        <ExitPopup />
        <div className="relative z-10">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/servicos" element={<Servicos />} />
              <Route path="/localizacao" element={<Localizacao />} />
              <Route path="/pedido" element={<Pedido />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </div>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
