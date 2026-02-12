import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Planos from "./pages/Planos";
import Ferramentas from "./pages/Ferramentas";
import ComparadorPrecos from "./pages/ferramentas/ComparadorPrecos";
import CalculadoraJuros from "./pages/ferramentas/CalculadoraJuros";
import SimuladorImobiliario from "./pages/ferramentas/SimuladorImobiliario";
import ComparadorCartoes from "./pages/ferramentas/ComparadorCartoes";
import FluxoCaixa from "./pages/ferramentas/FluxoCaixa";
import Oraculo from "./pages/ferramentas/Oraculo";
import UnderConstruction from "./pages/UnderConstruction";
import { Layout } from "./components/Layout";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path={"/"} component={Home} />
        <Route path={"/planos"} component={Planos} />
        
        {/* Ferramentas Routes */}
        <Route path={"/ferramentas"} component={Ferramentas} />
        <Route path={"/ferramentas/comparador-precos"} component={ComparadorPrecos} />
        <Route path={"/ferramentas/calculadora-juros"} component={CalculadoraJuros} />
        <Route path={"/ferramentas/simulador-imobiliario"} component={SimuladorImobiliario} />
        <Route path={"/ferramentas/comparador-cartoes"} component={ComparadorCartoes} />
        <Route path={"/ferramentas/fluxo-caixa"} component={FluxoCaixa} />
        <Route path={"/ferramentas/oraculo"} component={Oraculo} />

        <Route path={"/conheca-me"} component={UnderConstruction} />
        <Route path={"/404"} component={NotFound} />
        {/* Final fallback route */}
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
