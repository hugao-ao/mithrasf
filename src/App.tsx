import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Planos from "./pages/Planos";
import Sucesso from "./pages/Sucesso";
import Ferramentas from "./pages/Ferramentas";
import RotaFerramenta from "./pages/ferramentas/RotaFerramenta";
import ConhecaMe from "./pages/ConhecaMe";
import Login from "./pages/Login";
import AceiteContrato from "./pages/AceiteContrato";
import AguardandoFormulario from "./pages/AguardandoFormulario";
import BemVindo from "./pages/BemVindo";
import PlanejamentoReferencia from "./pages/PlanejamentoReferencia";
import { Layout } from "./components/Layout";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path={"/"} component={Home} />
        <Route path={"/planos"} component={Planos} />
        <Route path={"/sucesso"} component={Sucesso} />
        <Route path={"/login"} component={Login} />
        <Route path={"/aceite-contrato"} component={AceiteContrato} />
        <Route path={"/aguardando-formulario"} component={AguardandoFormulario} />
        <Route path={"/bem-vindo"} component={BemVindo} />
        <Route path={"/planejamento-de-referencia"} component={PlanejamentoReferencia} />

        {/* Ferramentas: índice + uma rota única resolvida pelo catálogo */}
        <Route path={"/ferramentas"} component={Ferramentas} />
        <Route path={"/ferramentas/:slug"} component={RotaFerramenta} />

        <Route path={"/conheca-me"} component={ConhecaMe} />
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
