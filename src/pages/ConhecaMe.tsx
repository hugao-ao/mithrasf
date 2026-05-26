import { Instagram } from "lucide-react";

export default function ConhecaMe() {
  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center justify-center gap-3">
          <Instagram className="h-8 w-8 text-pink-500" />
          Conheça-me
        </h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Acompanhe meu conteúdo sobre educação financeira, planejamento e liberdade financeira no Instagram.
        </p>
      </div>

      {/* Instagram Embed */}
      <div className="w-full flex justify-center">
        <div className="w-full max-w-2xl rounded-xl overflow-hidden border border-border shadow-xl" style={{ minHeight: '600px' }}>
          <iframe
            src="https://www.instagram.com/hugovconsultor/embed/"
            className="w-full border-0"
            style={{ height: '800px', maxHeight: '80vh' }}
            allowTransparency={true}
            scrolling="yes"
            title="Perfil Instagram - Hugo Viana Consultor Financeiro"
          />
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <a
          href="https://www.instagram.com/hugovconsultor/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
        >
          <Instagram className="h-5 w-5" />
          Seguir no Instagram
        </a>
      </div>
    </div>
  );
}
