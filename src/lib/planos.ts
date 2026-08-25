/**
 * Fonte única dos planos mensais.
 *
 * Planos.tsx e AceiteContrato.tsx consomem daqui. Antes cada um tinha a própria
 * cópia da tabela, e as duas divergiram — o contrato prometia uma coisa e o card
 * mostrava outra. Mexer em plano é mexer aqui, em um lugar só.
 */

export type Nivel = "I" | "II" | "III" | "IV" | "V";

export type Plano = {
  nivel: Nivel;
  /** Nome comercial completo, usado como chave em URLs e no contrato. */
  nome: string;
  apelido: string;
  /** O que a palavra promete — vira a frase do card. */
  promessa: string;
  preco: string;
  slaWhatsapp: string;
  reuniao: string;
  cotacao: string;
  especialista: string;
  alimenta: string;
  descricao: string;
  destaques: string[];
  escopo: string[];
  incluso: string;
  naoIncluso: string;
  /**
   * Link público do checkout, completo. É a URL usada de fato — os formatos
   * variam por plano (`/checkout/x` e `/checkout/plan/x`), então guardar o link
   * inteiro evita montá-lo errado. Ausente = não dá para assinar sozinho.
   */
  checkoutUrl?: string;
  /**
   * Identificadores numéricos da Cyclopay, usados só para gerar o checkout já
   * com os dados do cliente. Sem eles, cai direto no checkoutUrl público.
   */
  pagamento?: { planId: number; checkoutId: number };
  destaque?: boolean;
  premium?: boolean;
};

/** Vale para todos os cinco níveis. */
export const BENEFICIOS_COMUNS = [
  "Contato por WhatsApp ilimitado em quantidade, com o prazo de resposta do seu nível.",
  "Acesso ao site e a todas as ferramentas completas da plataforma.",
  "Vídeos explicativos de cada ferramenta e a vídeo-trilha de como montar e acompanhar sozinho o seu planejamento.",
  "Relatórios do sistema — de orçamento e das tarefas ligadas aos seus objetivos.",
  "Um contato de acompanhamento a cada 15 dias, para saber como você está e se dá para ajudar em algo.",
];

export const PLANOS: Plano[] = [
  {
    nivel: "I",
    nome: "HV Nível I",
    apelido: "Autonomia",
    promessa: "Você faz; a gente ensina e tira dúvida.",
    preco: "29,90",
    slaWhatsapp: "30 dias",
    reuniao: "Não tem — acompanhamento por WhatsApp",
    cotacao: "—",
    especialista: "—",
    alimenta: "Você",
    descricao: "Para quem quer se virar sozinho, com quem tirar dúvida.",
    destaques: [
      "WhatsApp ilimitado",
      "Todas as ferramentas da plataforma",
      "Vídeo-trilha de como montar seu plano",
      "Contato de acompanhamento a cada 15 dias",
    ],
    escopo: [
      ...BENEFICIOS_COMUNS,
      "Orientação estratégica e resolução de dúvidas pontuais pelo WhatsApp.",
    ],
    incluso: "Orientação estratégica e resolução de dúvidas pontuais.",
    naoIncluso:
      "Reuniões, cotações, pesquisas de mercado, contato com terceiros, execução de tarefas operacionais.",
    checkoutUrl: "https://planofinanceiro.cyclopay.com/checkout/WrKjwGYR4p",
    pagamento: { planId: 11830, checkoutId: 11649 },
  },
  {
    nivel: "II",
    nome: "HV Nível II",
    apelido: "Companhia",
    promessa: "Você faz, e senta com a gente de tempos em tempos.",
    preco: "59,90",
    slaWhatsapp: "15 dias",
    reuniao: "A cada 120 dias",
    cotacao: "—",
    especialista: "—",
    alimenta: "Você",
    descricao: "Para quem quer conversar de tempos em tempos.",
    destaques: [
      "Tudo do Nível I",
      "Reunião a cada 120 dias",
      "Resposta no WhatsApp em 15 dias",
      "Qualquer demanda resolvida na reunião",
    ],
    escopo: [
      ...BENEFICIOS_COMUNS,
      "Reunião a cada 120 dias, pedida por você, estando em dia no período.",
      "Resolução de qualquer tipo de demanda durante a reunião.",
    ],
    incluso: "Tudo do Nível I + reunião a cada 120 dias.",
    naoIncluso:
      "Cotações, pesquisas de mercado, contato com terceiros, execução de tarefas operacionais.",
    checkoutUrl: "https://planofinanceiro.cyclopay.com/checkout/2GoFRSHleo",
    pagamento: { planId: 11831, checkoutId: 11650 },
  },
  {
    nivel: "III",
    nome: "HV Nível III",
    apelido: "Direção",
    promessa: "A gente aponta o caminho e quem procurar.",
    preco: "119,90",
    slaWhatsapp: "7 dias",
    reuniao: "A cada 60 dias",
    cotacao: "Contatos entregues a você",
    especialista: "—",
    alimenta: "Você",
    descricao: "Para quem quer saber com quem falar e o que pedir.",
    destaques: [
      "Tudo do Nível II",
      "Reunião a cada 60 dias",
      "Contatos de profissionais entregues",
      "O que seria ideal conseguir na negociação",
    ],
    escopo: [
      ...BENEFICIOS_COMUNS,
      "Reunião a cada 60 dias, pedida por você, estando em dia no período.",
      "Pesquisa e entrega dos contatos de profissionais adequados à sua demanda — ou, se você autorizar, repasse do seu contato a eles.",
      "Junto vai o que seria ideal conseguir naquela negociação.",
      "Disponibilidade para discutir o que você cotou e ajudar na decisão.",
    ],
    incluso:
      "Tudo do Nível II + reunião a cada 60 dias + pesquisa e entrega de contatos de profissionais, com o que seria ideal conseguir na negociação.",
    naoIncluso:
      "Condução da cotação pelo consultor, reunião com especialista, execução de tarefas operacionais em seu nome.",
    destaque: true,
    checkoutUrl: "https://planofinanceiro.cyclopay.com/checkout/kgl3pLDplo",
    pagamento: { planId: 11833, checkoutId: 11652 },
  },
  {
    nivel: "IV",
    nome: "HV Nível IV",
    apelido: "Representação",
    promessa: "A gente vai ao mercado no seu lugar.",
    preco: "179,90",
    slaWhatsapp: "72 horas",
    reuniao: "A cada 60 dias",
    cotacao: "Conduzida por nós",
    especialista: "1 por ano",
    alimenta: "Você",
    descricao: "Para quem não quer negociar com o mercado.",
    destaques: [
      "Tudo do Nível III",
      "Cotação conduzida por nós",
      "1 reunião por ano com especialista",
      "Resposta no WhatsApp em 72 horas",
    ],
    escopo: [
      ...BENEFICIOS_COMUNS,
      "Reunião a cada 60 dias, pedida por você, estando em dia no período.",
      "Cotação conduzida pelo consultor: levamos sua demanda ao mercado, questionamos e negociamos as condições, e entregamos as propostas junto com a nossa recomendação.",
      "Seu contato não é passado aos profissionais, nem o deles a você.",
      "1 reunião por ano com profissional especialista (contador, advogado ou outro), contratado e pago pelo consultor.",
    ],
    incluso:
      "Tudo do Nível III + cotação conduzida pelo consultor, entregue com recomendação + 1 reunião anual com especialista, paga pelo consultor.",
    naoIncluso:
      "Alimentação do sistema pelo consultor; atos que exijam presença física, assinatura biométrica ou senha pessoal intransferível.",
    checkoutUrl: "https://planofinanceiro.cyclopay.com/checkout/plan/YdaVhn2DBI",
    pagamento: { planId: 24015, checkoutId: 15652 },
  },
  {
    nivel: "V",
    nome: "HV Nível V",
    apelido: "Delegação",
    promessa: "A gente resolve, você valida.",
    preco: "349,90",
    slaWhatsapp: "72 horas",
    reuniao: "A cada 30 dias",
    cotacao: "Conduzida por nós",
    especialista: "2 por ano",
    alimenta: "Nós, por importação do extrato",
    descricao: "Para quem não quer nem anotar.",
    destaques: [
      "Tudo do Nível IV",
      "Nós alimentamos o sistema por você",
      "Relatório do orçamento toda sexta",
      "2 reuniões por ano com especialista",
    ],
    escopo: [
      ...BENEFICIOS_COMUNS,
      "Reunião a cada 30 dias, pedida por você, estando em dia no período.",
      "Cotação conduzida pelo consultor, entregue com recomendação.",
      "2 reuniões por ano com profissional especialista, contratado e pago pelo consultor.",
      "Nós alimentamos o sistema a partir dos seus extratos e faturas — só em CSV ou Excel, sem digitação manual.",
      "Enviados os arquivos até quinta à meia-noite, você recebe o relatório do orçamento do mês na sexta.",
    ],
    incluso:
      "Tudo do Nível IV + 2 reuniões anuais com especialista + alimentação do sistema pelo consultor, a partir de extratos em CSV ou Excel, com relatório do orçamento na sexta-feira.",
    naoIncluso:
      "Atos que exijam presença física, assinatura biométrica ou uso de senha pessoal intransferível do titular.",
    premium: true,
    checkoutUrl: "https://planofinanceiro.cyclopay.com/checkout/rHe327XILq",
    pagamento: { planId: 11835, checkoutId: 11653 },
  },
];

export const porNome = (nome: string): Plano =>
  PLANOS.find((p) => p.nome === nome) || PLANOS[0];

/** Preço fixo do Diagnóstico. Gratuito para quem chega por indicação de cliente. */
export const PRECO_DIAGNOSTICO = "250,00";

export const WHATSAPP_CONSULTOR = "5581994297920";

/** Usado quando o plano ainda não tem checkout com o preço vigente. */
export const linkWhatsapp = (texto: string) =>
  `https://wa.me/${WHATSAPP_CONSULTOR}?text=${encodeURIComponent(texto)}`;
