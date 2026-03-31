import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Index from "./pages/Index";
import Servicos from "./pages/Servicos";
import Empresas from "./pages/Empresas";
import PainelEmpresa from "./pages/PainelEmpresa";
import Localizacao from "./pages/Localizacao";
import Pedido from "./pages/Pedido";
import Admin from "./pages/Admin";
import Dashboard from "./pages/Dashboard";
import MakerGym from "./pages/MakerGym";
import NotFound from "./pages/NotFound";
import CircuitBackground from "./components/CircuitBackground";

// Studio carrega só quando o usuário acessa /studio
// Fontes + modelos de IA NÃO pesam o site principal
const Studio = lazy(() => import("./pages/Studio"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <div className="relative min-h-screen bg-background">
        <CircuitBackground />
        <div className="relative z-10">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/servicos" element={<Servicos />} />
              <Route path="/empresas" element={<Empresas />} />
              <Route path="/empresa-painel" element={<PainelEmpresa />} />
              <Route path="/localizacao" element={<Localizacao />} />
              <Route path="/pedido" element={<Pedido />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/makergym" element={<MakerGym />} />

              {/* ── Maker Info Studio ── */}
              <Route
                path="/studio"
                element={
                  <Suspense fallback={
                    <div style={{
                      minHeight: "100vh", background: "#060a14",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexDirection: "column", gap: 16, fontFamily: "system-ui"
                    }}>
                      <div style={{ fontSize: 10, color: "#00d4ff", letterSpacing: 6 }}>MAKER INFO</div>
                      <div style={{ fontSize: 20, fontWeight: 900, color: "#fff" }}>
                        Studio <span style={{ color: "#00d4ff" }}>Pro</span>
                      </div>
                      <div style={{ width: 40, height: 3, background: "linear-gradient(90deg,#00d4ff,#c87cff)", borderRadius: 2 }}/>
                      <div style={{ fontSize: 11, color: "#2a3a5a" }}>Carregando editor...</div>
                    </div>
                  }>
                    <Studio />
                  </Suspense>
                }
              />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </div>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
