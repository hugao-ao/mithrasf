import { AlertTriangle } from "lucide-react";
import { BENEFICIOS_COMUNS, PLANOS, PRECO_DIAGNOSTICO, type Plano } from "@/lib/planos";

/**
 * Texto do contrato, único para o site inteiro.
 *
 * Renderizado tanto no diálogo "Consultar Contrato Completo" (Planos) quanto na
 * tela de aceite. Manter em um lugar só é o que impede o card prometer uma coisa
 * e o contrato dizer outra.
 */

function Titulo({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="text-primary font-bold text-xs uppercase tracking-wider pt-2">
      {children}
    </h4>
  );
}

/** Cláusula que restringe direito — art. 54, §4º, do CDC pede destaque. */
function Limita({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-red-500/10 border border-red-500/30 rounded p-3 space-y-2">
      <span className="text-red-400 font-bold text-[0.7rem] uppercase tracking-wider flex items-center gap-1.5">
        <AlertTriangle className="h-3.5 w-3.5" /> Atenção — isto limita seus direitos
      </span>
      {children}
    </div>
  );
}

/** Tradução da regra para quem não lê contrato. */
function Simples({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs text-white bg-primary/10 border-l-2 border-primary pl-3 py-2 rounded-r">
      <strong className="text-primary">Em outras palavras:</strong> {children}
    </p>
  );
}

export default function ContratoTexto({ plano }: { plano: Plano }) {
  return (
    <div className="text-sm text-muted-foreground space-y-4 text-justify">
      <p className="text-xs italic">
        Contrato único. A <strong>Parte A</strong> trata do plano mensal, a{" "}
        <strong>Parte B</strong> do Planejamento Financeiro de Referência e a{" "}
        <strong>Parte C</strong> das regras comuns. Não contratando o Planejamento, a Parte B
        fica sem efeito até que ele seja contratado.
      </p>

      {/* ── PARTE A ────────────────────────────────────────────────── */}
      <Titulo>Parte A — O plano mensal</Titulo>

      <p>
        <strong>A.1 OBJETO:</strong> Prestação continuada de orientação em finanças pessoais,
        por assinatura mensal, compreendendo — conforme o nível contratado — atendimento por
        WhatsApp, reuniões, cotações, reuniões com especialista e alimentação do sistema. O
        plano mensal <strong>não inclui</strong> a elaboração do Planejamento Financeiro de
        Referência, que é objeto da Parte B e tem preço próprio.
      </p>

      <div className="bg-primary/10 p-3 rounded border border-primary/20 space-y-2">
        <p className="text-xs font-bold text-primary">
          A.2 ESCOPO DESTE NÍVEL — {plano.nome} · {plano.apelido}
        </p>
        <div className="grid grid-cols-2 gap-2 text-[0.7rem]">
          <div className="bg-black/20 p-2 rounded">
            <span className="block text-muted-foreground">WhatsApp responde em até</span>
            <span className="font-bold text-white">{plano.slaWhatsapp}</span>
          </div>
          <div className="bg-black/20 p-2 rounded">
            <span className="block text-muted-foreground">Reunião pedida por você</span>
            <span className="font-bold text-white">{plano.reuniao}</span>
          </div>
          <div className="bg-black/20 p-2 rounded">
            <span className="block text-muted-foreground">Cotação</span>
            <span className="font-bold text-white">{plano.cotacao}</span>
          </div>
          <div className="bg-black/20 p-2 rounded">
            <span className="block text-muted-foreground">Reunião com especialista</span>
            <span className="font-bold text-white">{plano.especialista}</span>
          </div>
          <div className="bg-black/20 p-2 rounded col-span-2">
            <span className="block text-muted-foreground">Quem alimenta o sistema</span>
            <span className="font-bold text-white">{plano.alimenta}</span>
          </div>
        </div>
        <ul className="space-y-1">
          {plano.escopo.map((item, i) => (
            <li key={i} className="flex gap-2 text-xs text-white">
              <span className="text-primary shrink-0">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="text-xs text-red-300">
          <strong>VEDAÇÕES:</strong> {plano.naoIncluso}
        </p>
      </div>

      <p>
        <strong>Cotação.</strong> No Nível III o CONSULTOR pesquisa e entrega os contatos dos
        profissionais adequados à demanda — ou, <strong>mediante autorização do CONTRATANTE</strong>,
        repassa o contato dele a esses profissionais —, informando o que seria ideal conseguir
        na negociação. Não se garante que o profissional indicado tratará o interesse do
        CONTRATANTE como prioridade: a indicação é de contato, não de resultado. Nos Níveis IV
        e V a cotação é conduzida pelo CONSULTOR, que leva a demanda ao mercado, questiona e
        negocia as condições e entrega as propostas junto com a sua recomendação, sem trocar
        contatos entre as partes. Conduzir a cotação não inclui assinar contrato, movimentar
        conta nem assumir obrigação em nome do CONTRATANTE.
      </p>

      <div className="bg-primary/10 border border-primary/20 rounded p-3 space-y-2">
        <span className="text-primary font-bold text-[0.7rem] uppercase tracking-wider">
          Como o CONSULTOR é remunerado nas cotações
        </span>
        <p className="text-xs text-white">
          Nas cotações conduzidas, <strong>o CONSULTOR paga os profissionais</strong> pelo
          trabalho de cotar, para que não trabalhem de graça e não precisem pressionar o
          CONTRATANTE a fechar. <strong>O CONSULTOR não recebe comissão de nenhum fornecedor
          cotado, em nenhum nível e em nenhuma hipótese</strong> — é remunerado apenas pelo
          CONTRATANTE, pelos valores deste contrato.
        </p>
      </div>

      <p>
        <strong>Reunião com especialista.</strong> Nos Níveis IV e V, o CONTRATANTE tem direito
        a reuniões com profissional especialista — contador, advogado ou outro conforme a
        necessidade —, contratado e pago pelo CONSULTOR: 1 por ano no Nível IV e 2 por ano no
        Nível V. São agendadas pelo CONSULTOR e não são cumulativas.
      </p>

      <p>
        <strong>Quem alimenta o sistema.</strong> Até o Nível IV, é o CONTRATANTE quem lança os
        dados nas ferramentas. No Nível V, o CONSULTOR alimenta o sistema a partir dos extratos
        e faturas enviados <strong>em CSV ou Excel</strong> — não há digitação manual. Enviados
        até quinta-feira à meia-noite, o relatório do orçamento do mês é entregue na sexta.
      </p>

      <p>
        <strong>A.3 REUNIÕES:</strong> Quem pede a reunião é o CONTRATANTE; ela não é marcada
        automaticamente. O intervalo mínimo conta da contratação, para a primeira — funcionando
        como carência —, e da reunião anterior, depois. As reuniões de elaboração do
        Planejamento de Referência não consomem nem reiniciam esse intervalo.
      </p>

      <Limita>
        <p className="text-xs text-white">
          <strong>É preciso estar em dia durante todo o intervalo</strong> para ter direito à
          reunião. Mês não pago dentro do período interrompe a contagem, que recomeça com a
          regularização. As reuniões <strong>não são cumulativas e não formam saldo</strong>:
          quem passou um ano sem se reunir tem direito a uma reunião, não a várias. O
          CONTRATANTE sai da reunião sem outra agendada.
        </p>
        <Simples>
          a reunião é um direito que se renova a cada período pago, não um crédito que se
          acumula. Ficar sem usar não vira bônus depois.
        </Simples>
      </Limita>

      <p>
        <strong>Reunião por iniciativa do CONSULTOR — regra geral deste contrato.</strong>{" "}
        Sempre que entender necessário, o CONSULTOR pode marcar reunião com o CONTRATANTE ainda
        que ela não esteja prevista ou permitida por este contrato, inclusive antes de vencido
        qualquer intervalo mínimo, em qualquer fase e qualquer que seja o nível.{" "}
        <strong>Reunião marcada por iniciativa do CONSULTOR nunca gera custo adicional.</strong>{" "}
        É faculdade do CONSULTOR e não direito do CONTRATANTE: não pode ser exigida, não gera
        obrigação de repetir e não altera os intervalos aplicáveis aos pedidos do CONTRATANTE.
      </p>

      <p>
        <strong>Falta sem aviso.</strong> O não comparecimento a reunião agendada, sem
        cancelamento com antecedência mínima de 24 horas, faz o serviço ser considerado
        prestado quanto àquela reunião e reinicia a contagem do intervalo mínimo.
      </p>

      <p>
        <strong>A.4 WHATSAPP:</strong> O contato é ilimitado em quantidade em todos os níveis;
        o que varia é o prazo de resposta. Para registro e contagem de prazos valem apenas as
        solicitações feitas em reunião ou pelo WhatsApp oficial. Áudios com mais de 2 minutos e
        mensagens fora do horário de atendimento podem ter o prazo estendido.
      </p>

      <Limita>
        <p className="text-xs text-white">
          <strong>A.5 O QUE NENHUM NÍVEL INCLUI:</strong> a elaboração do Planejamento de
          Referência (Parte B), a execução de investimentos, a intermediação ou venda de
          produto financeiro, a representação perante órgãos públicos e os atos privativos de
          contador, advogado ou corretor.
        </p>
        <Simples>
          quanto mais alto o nível, mais a gente faz por você. Nos níveis baixos a gente
          orienta e você executa.
        </Simples>
      </Limita>

      <p>
        <strong>A.6 VIGÊNCIA, TROCA DE NÍVEL E CANCELAMENTO:</strong> O plano vigora por prazo
        indeterminado, renovando-se a cada mês com a cobrança. A troca de nível pode ser pedida
        a qualquer tempo: subindo, os prazos do novo nível valem imediatamente; descendo, valem
        no ciclo seguinte. O cancelamento pode ser feito a qualquer momento pelo canal oficial,
        interrompendo as cobranças futuras, sem multa e sem devolução dos dias já utilizados no
        mês corrente.
      </p>

      {/* ── PARTE B ────────────────────────────────────────────────── */}
      <Titulo>Parte B — O Planejamento Financeiro de Referência</Titulo>

      <p>
        <strong>B.1 OBJETO:</strong> Elaboração, entrega e explicação de documento único e
        personalizado, disponibilizado na área logada. O trabalho do CONSULTOR é{" "}
        <strong>viabilizar os objetivos do CONTRATANTE por meio do Protocolo Argos</strong>:
        organizar a vida financeira de modo que os objetivos declarados caibam, na ordem e na
        forma mais saudável para a situação dele. O documento tem duas partes, que não são
        independentes — a Parte I é o destino, a Parte II é o caminho.
      </p>

      <p>
        <strong>Parte I — objetivos.</strong> Para cada objetivo declarado no Termo de
        Diagnóstico, uma estratégia escrita com, no mínimo: valor estimado, prazo pretendido,
        esforço mensal necessário e caminho recomendado. <strong>Não há limite de quantidade de
        objetivos.</strong> Quando, mesmo com a vida financeira organizada pelo Protocolo, um
        objetivo não couber nos números informados, a estratégia consiste em demonstrar isso e
        indicar o que precisaria mudar — o que é entrega regular e completa desse objetivo.
      </p>

      <p>
        <strong>Parte II — Protocolo Argos.</strong> Estrutura fixa de 6 tópicos e 18
        subtópicos: Gestão Financeira (dívidas, cortes de gastos, aumento de receita); Gestão
        de Risco (patrimônio, orçamento, saúde básica, doenças graves e acidentes, profissão);
        Gestão de Ativos (distribuição, aportes mensais); Longo Prazo e Pós-Aposentadoria
        (acúmulo mais vantajoso, análise, conclusão); Planejamento Tributário (forma de
        recebimento, forma de declaração, PGBL ou não); e Planejamento Sucessório (patrimônio
        estimado, soluções possíveis). Cada subtópico contém, no mínimo: a situação atual
        apurada, a recomendação, por que essa recomendação e o próximo passo prático.
      </p>

      <Limita>
        <p className="text-xs text-white">
          A lista de 18 subtópicos é <strong>fechada</strong>. Assunto que não caiba em um
          desses subtópicos nem em objetivo declarado no Diagnóstico não faz parte deste
          contrato e, se pedido, vira orçamento à parte.
        </p>
      </Limita>

      <p>
        <strong>B.2 O QUE SIGNIFICA "DE REFERÊNCIA":</strong> o documento registra a situação
        financeira em uma data e as recomendações que saem dela. Não é ordem de execução,
        promessa de resultado nem garantia de rentabilidade.{" "}
        <strong>A decisão de executar, adiar ou ignorar é sempre do CONTRATANTE</strong>, e as
        consequências dessa decisão também.
      </p>

      <p>
        <strong>B.3 COMO O DOCUMENTO É PRODUZIDO:</strong> os dados são lançados nas
        ferramentas; o sistema lê e <strong>propõe</strong> um texto de recomendação; um
        profissional da equipe <strong>lê, corrige e valida</strong>; e só então o texto é
        publicado. Nenhuma recomendação é publicada apenas porque o sistema a gerou. O CONSULTOR
        responde pelo conteúdo publicado como se o tivesse escrito por inteiro. Quando a equipe
        lança dados em nome do CONTRATANTE, o faz por acesso próprio — <strong>é vedado o uso da
        senha do CONTRATANTE</strong>.
      </p>

      <Limita>
        <p className="text-xs text-white">
          <strong>B.4 SEM DADOS, SEM RECOMENDAÇÃO.</strong> Não fornecida a informação, o
          subtópico é entregue com a marcação "sem dados suficientes", e essa entrega é regular
          e completa. Essa marcação <strong>só é válida</strong> se o CONSULTOR tiver pedido a
          informação pelos canais oficiais em pelo menos duas oportunidades registradas, com
          data, e se o próprio subtópico disser por escrito qual informação faltou.
        </p>
        <Simples>
          se você não mandar o dado, aquele pedaço sai vazio e conta como entregue — mas só se a
          gente tiver te cobrado duas vezes e deixado escrito exatamente o que faltou.
        </Simples>
      </Limita>

      <p>
        <strong>B.5 REUNIÕES DO PLANEJAMENTO:</strong> a primeira é o Diagnóstico Financeiro,
        que colhe e registra os objetivos e gera o Termo de Diagnóstico. Contratado o
        Planejamento — qualquer que seja o valor negociado —, a reunião inicial de entrega é
        marcada para no mínimo <strong>15 dias corridos</strong> do Diagnóstico. Depois, o
        CONTRATANTE tem direito a <strong>quantas reuniões forem necessárias</strong> até que lhe
        tenham sido explicados cada objetivo e cada um dos 18 subtópicos; o intervalo mínimo do
        plano mensal não se aplica aqui.{" "}
        <strong>Nenhuma reunião se encerra sem que a data da próxima esteja marcada</strong>, e a
        última só se encerra com a assinatura do Termo de Plano Entregue. Ao final de cada
        reunião o CONSULTOR envia uma <strong>ata</strong> com data, participantes, itens
        percorridos, pendências e a data da próxima.
      </p>

      <p>
        <strong>B.6 SE O CONTRATANTE SUMIR:</strong> passando 60 dias corridos sem entrega de
        dado e sem reunião, o CONSULTOR poderá encerrar a elaboração, após{" "}
        <strong>duas notificações registradas</strong> — a segunda com prazo de 15 dias e aviso
        expresso da consequência —, emitindo um Registro de Encerramento por Inércia, que
        registra apenas fatos. O que foi produzido continua disponível, e o encerramento não
        consome as reuniões de explicação: voltando dentro do prazo e completando o checklist, a
        elaboração é retomada sem custo adicional.
      </p>

      <p>
        <strong>B.7 TRAVA, CORREÇÃO E REVISÃO:</strong> até a assinatura do Termo o CONTRATANTE
        pode pedir correções e ajustes. A partir dela a versão é datada e travada, e um{" "}
        <strong>PDF completo do Planejamento é entregue junto com o Termo</strong>.{" "}
        <strong>A correção de erro material, de dado lançado errado pela equipe ou de
        recomendação incompatível com os dados declarados não é Revisão: é correção, feita sem
        custo e a qualquer tempo.</strong> Alteração que não seja correção constitui Revisão,
        que nasce pré-preenchida da versão travada.
      </p>

      <p>
        <strong>Quem tem direito à Revisão.</strong> A Revisão existe para quem tem plano mensal
        ativo, e não tem custo — <strong>não há Revisão avulsa</strong>. No Nível I ela é
        contínua, pelo WhatsApp, conforme as ferramentas vão sendo atualizadas. Nos Níveis II a
        V é conduzida nas reuniões de acompanhamento. Sem plano mensal não há Revisão:
        precisando mexer no Planejamento, faz-se novo Diagnóstico e monta-se novo Planejamento,
        pelos preços vigentes à época.
      </p>

      {/* ── PARTE C ────────────────────────────────────────────────── */}
      <Titulo>Parte C — Regras comuns</Titulo>

      <p>
        <strong>C.1 PREÇO:</strong> São três serviços com preços distintos. O{" "}
        <strong>Diagnóstico Financeiro</strong> custa R$ {PRECO_DIAGNOSTICO}, é serviço autônomo
        e <strong>gratuito para quem chega por indicação de cliente do CONSULTOR</strong>. O{" "}
        <strong>Planejamento de Referência</strong> é definido caso a caso, em proporção à renda
        apurada no Diagnóstico. O <strong>plano mensal</strong> custa R$ {plano.preco} por mês
        neste nível. Sobre valor em atraso incidem multa de 2% e juros de 1% ao mês. Estorno,
        chargeback e boleto devolvido equiparam-se a pendência financeira.
      </p>

      <p>
        <strong>C.2 DESISTÊNCIA E ARREPENDIMENTO:</strong> tendo o contrato sido assinado pela
        internet, por telefone, por aplicativo de mensagens ou fora do escritório do CONSULTOR,
        o CONTRATANTE pode desistir em até <strong>7 dias corridos</strong>, contados da
        assinatura <strong>ou</strong> do dia em que o primeiro conteúdo ficar disponível na área
        logada — o que acontecer por último —, recebendo de volta tudo o que pagou, corrigido,
        sem precisar justificar (art. 49 do CDC). O plano mensal é cancelável a qualquer momento,
        na forma da Cláusula A.6.
      </p>

      <Limita>
        <p className="text-xs text-white">
          Assinado o Termo de Plano Entregue, o Planejamento está integralmente prestado e{" "}
          <strong>não há devolução de valores</strong>. Isso não afasta o direito de ter
          corrigido, sem custo, o que estiver errado.
        </p>
      </Limita>

      <p>
        <strong>C.3 SE DISCORDAR DO CONTEÚDO:</strong> discordar de uma recomendação não é
        defeito do serviço, já que a decisão de executar é sempre do CONTRATANTE. Ainda assim, a
        reclamação pode ser feita por escrito no canal oficial, apontando o objetivo ou
        subtópico e o motivo, em até <strong>90 dias</strong> da assinatura do Termo. O CONSULTOR
        tem <strong>30 dias</strong> para reexplicar, corrigir ou refazer aquele item, sem custo.
      </p>

      <p>
        <strong>C.4 LIMITES DO SERVIÇO:</strong> este serviço <strong>não</strong> é consultoria
        de valores mobiliários (Resolução CVM nº 19) nem gestão de carteira — o CONSULTOR não
        guarda dinheiro, não compra nem vende ativos, não recomenda ativo individualizado e não
        promete rentabilidade. A contratação de apólice deve ser feita por corretor habilitado na
        SUSEP. O tópico tributário é orientação geral e{" "}
        <strong>deve ser previamente validado por contador e/ou advogado do próprio
        CONTRATANTE</strong>; o CONSULTOR não responde por tributo, multa, juros ou autuação
        decorrentes de decisão do CONTRATANTE. O tópico sucessório não substitui advogado ou
        tabelião, e os custos de inventário apresentados são estimativas. As recomendações
        refletem a legislação vigente na data da versão travada.
      </p>

      <p>
        <strong>C.5 SEUS DADOS (LGPD):</strong> os dados são tratados exclusivamente para prestar
        os serviços deste contrato (art. 7º, V, da Lei nº 13.709/2018), com acesso restrito à
        equipe designada, sob dever de sigilo, e <strong>não são vendidos, cedidos nem
        compartilhados</strong> com fornecedores de produtos financeiros. O tratamento de dados
        de saúde, condição física e ocupação — necessários para dimensionar coberturas de risco —
        depende de <strong>autorização específica</strong>, revogável a qualquer tempo. Depoimento,
        imagem, nome ou caso do CONTRATANTE, ainda que anonimizado, só com autorização escrita.
      </p>

      <Limita>
        <p className="text-xs text-white">
          Ficando o CONTRATANTE <strong>60 dias ou mais em atraso</strong>, o CONSULTOR poderá
          eliminar definitivamente todos os registros — dados nas ferramentas, histórico, atas,
          relatórios e o próprio PDF do Planejamento —, conservando apenas os{" "}
          <strong>termos assinados</strong>, como prova do serviço prestado. A eliminação é
          irreversível e precedida de aviso com pelo menos 15 dias, para exportação.
        </p>
        <Simples>
          se ficar dois meses sem pagar, apagamos tudo, inclusive a nossa cópia do seu plano.
          O PDF que você recebeu continua com você — guarde bem, porque a nossa cópia deixa de
          existir.
        </Simples>
      </Limita>

      <Limita>
        <p className="text-xs text-white">
          <strong>C.6 PAGAMENTO EM DIA.</strong> Havendo atraso, o CONSULTOR avisará pelos canais
          oficiais. <strong>Não regularizado em 7 dias corridos do aviso</strong>, ficam
          suspensos o atendimento por WhatsApp, o agendamento de reuniões, a produção de tópicos
          ainda não publicados e a emissão de Revisões, até a regularização.{" "}
          <strong>O acesso à leitura das versões já travadas e já pagas, e o direito de pedir
          cópia dos próprios dados, não são suspensos em nenhuma hipótese.</strong>
        </p>
        <Simples>
          se atrasar, a gente avisa e te dá uma semana. Passando disso, paramos de atender até
          acertar — mas você continua podendo ler o que já pagou.
        </Simples>
      </Limita>

      <p>
        <strong>C.7 QUANDO O CONSULTOR PODE ENCERRAR:</strong> mediante aviso escrito com 15 dias
        de antecedência e devolução proporcional do que ainda não foi prestado, nos casos de
        informação comprovadamente falsa, solicitação de conduta contrária à lei, ou ofensa ou
        ameaça a integrante da equipe. Não há multa.
      </p>

      <p>
        <strong>C.8 DE QUEM É O DOCUMENTO:</strong> a estrutura do Protocolo Argos e os textos
        publicados são de autoria do CONSULTOR. O CONTRATANTE recebe licença pessoal, permanente
        e não exclusiva para uso próprio, podendo apresentar o documento aos seus profissionais
        de confiança. É vedada a reprodução pública, a revenda e o uso comercial do conteúdo.
      </p>

      <p>
        <strong>C.9 DISPOSIÇÕES FINAIS:</strong> valem as comunicações feitas em reunião ou pelo
        WhatsApp oficial. As partes aceitam assinatura eletrônica, inclusive sem certificado
        ICP-Brasil (MP 2.200-2/2001 e Lei nº 14.063/2020). Havendo divergência entre documentos,
        prevalece em primeiro lugar o que tiver sido registrado como{" "}
        <strong>negociação final</strong> no fechamento, depois as cláusulas deste contrato e por
        último os anexos. Alterações só valem por escrito e aceitas pelas duas partes. A
        invalidade de uma cláusula não afeta as demais. Este contrato não gera vínculo
        empregatício, societário ou de representação.
      </p>

      <p className="text-xs italic pt-2 border-t border-white/10">
        Os cinco níveis disponíveis são{" "}
        {PLANOS.map((p) => `${p.nome} (${p.apelido})`).join(", ")}. Todos incluem:{" "}
        {BENEFICIOS_COMUNS.join(" ")}
      </p>
    </div>
  );
}
