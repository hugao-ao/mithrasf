import { CheckCircle2, MessageCircle } from "lucide-react";

const WHATSAPP_URL =
  "https://wa.me/5581994297920?text=Oi%2C%20acabei%20de%20me%20tornar%20cliente%20e%20estou%20precisando%20falar%20com%20voc%C3%AA%2C%20Hugo.";

export default function BemVindo() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-xl w-full text-center space-y-8">

        {/* Ícone */}
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
          </div>
        </div>

        {/* Título */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white">Pronto!</h1>
          <p className="text-lg text-primary font-medium">
            Já temos condições de começar.
          </p>
        </div>

        {/* Mensagem */}
        <div className="bg-card/60 border border-white/10 rounded-2xl p-6 text-left space-y-3">
          <p className="text-muted-foreground leading-relaxed">
            Recebi suas respostas e já vou analisar tudo com calma antes do nosso primeiro contato.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            A partir de agora, pode me chamar no WhatsApp sempre que precisar — seja pra tirar uma dúvida
            rápida, agendar uma conversa ou resolver qualquer coisa.
          </p>
          <p className="text-white font-medium">Estou aqui.</p>
        </div>

        {/* Botão WhatsApp */}
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors shadow-lg shadow-green-900/30"
        >
          <MessageCircle className="h-5 w-5" />
          Falar no WhatsApp
        </a>

        <p className="text-xs text-muted-foreground">
          Ao clicar, você será direcionado para uma conversa no WhatsApp com a mensagem já preenchida.
        </p>

      </div>
    </div>
  );
}
