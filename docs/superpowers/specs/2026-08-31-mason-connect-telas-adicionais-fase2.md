# Spec: Telas adicionais do Mason Connect (Fase 2) — pedido de prototipagem para claude.ai/design

**Data:** 2026-08-31
**Status:** Pronto para prototipagem no claude.ai/design

## 1. Objetivo

As 4 telas já implementadas (Painel, Membros, Financeiro, Perfil) cobrem só uma fatia do escopo do PRD. Este documento especifica os **7 módulos restantes**, para você levar ao claude.ai/design e prototipar — do mesmo jeito que Painel/Membros/Financeiro/Perfil foram prototipados antes de virarem código:

1. Login / Autenticação por perfil
2. Fila de Aprovação de Membros pendentes
3. Reuniões e Presença ao vivo
4. Indicações e Negócios
5. Onboarding
6. Configurações do Gestor
7. Ocorrências de conduta

Fluxo pretendido: **esta spec** → você prototipa no claude.ai/design (projeto "Mason Connect Design System", já sincronizado com os 15 componentes reais) → handoff de volta pro repo → implementação em código, no mesmo padrão SDD usado nas 4 telas atuais.

## 2. Achado importante: já existe um protótipo de referência para 5 dos 7 módulos

`Documentos/MC_BlocoC_08_Prototipo_Navegavel.jsx` (496 linhas, o protótipo navegável desktop original que fundamentou a spec do design-system) já tem JSX funcional e completo para:

- **Login** (função `MasonConnectPrototipo`, ramo `tela === "login"`, linhas 434-457)
- **Aprovação de Membros** — embutida na tela `Membros` (linhas 142-185): botão "Aprovar cadastro" visível só para perfil Gestor, ao lado de cada membro pendente
- **Reuniões e Presença** (função `Reuniao`, linhas 187-233) — inclui o **chip cíclico de 4 estados** (Presente/Falta/Justificada/Representado, um toque avança o ciclo) e uma seção de convidados
- **Indicações e Negócios** (função `Indicacoes`, linhas 235-311) — quadro Kanban de 4 colunas por estágio, formulário de registro, botão "Confirmar fechamento"
- **Configurações** (função `Config`, linhas 389-426) — planos de mensalidade editáveis, regras parametrizáveis, trilha de auditoria

**Como usar esse arquivo**: mesmo tratamento dado ao `MC_BlocoC_08_Prototipo_Navegavel.jsx` na primeira spec do design-system — é **catálogo de conteúdo e interação** (que dado aparece, que texto, que estados, que fluxo), **não** fonte de layout final (é desktop com sidebar; o produto é mobile-first, então cada tela precisa de reprojeção, igual foi feito nas 4 telas atuais). Ele também usa cores hex cruas e `style` inline — isso é do protótipo React ilustrativo original, não deve ser copiado; a prototipagem em claude.ai/design usa os componentes reais do design-system sincronizado, com suas classes Tailwind/tokens.

Os módulos **Onboarding** e **Ocorrências de conduta** não têm nenhum precedente visual neste arquivo — vêm só do texto do PRD (seção 4 abaixo), então pedem mais julgamento de design por parte de quem prototipar.

## 3. Estado atual do design-system: o que reaproveitar, o que falta

Os 15 componentes já existem e estão sincronizados: `Avatar`, `Badge`, `BottomNav`+`NavTab`, `Button` (com `fullWidth`), `Card`, `CategoryBarChart`, `EmptyState`, `FilterTabs`, `Input`, `List`+`ListRow`, `ProgressBar`, `SectionTitle`, `Select`, `Stat`, `TrendLineChart`. Reaproveitar ao máximo.

**Gaps de componente identificados** (documento original do design-system, Bloco C.07, e confirmados como necessários por estas novas telas):

- **"Chip de presença"** — componente novo, ainda não existe. É citado no documento original do design-system como "o componente-assinatura" do produto: ciclo de 4 estados (Presente → Falta → Justificada → Representado) avançado por um único toque, cada estado com cor/badge própria. O protótipo de referência (`Reuniao`, linhas 187-196) mostra a lógica exata do ciclo.
- **Modal de confirmação** — não existe ainda. O documento original do design-system pede um modal para "atos definitivos" (aprovar membro, confirmar fechamento de negócio, estornar). O protótipo de referência NÃO usa modal (o botão "Aprovar cadastro"/"Confirmar fechamento" age direto) — decisão em aberto para quem prototipar: seguir o protótipo (mais simples, um toque) ou adicionar confirmação via modal (mais seguro para ações irreversíveis, como o documento original recomenda). Minha recomendação: usar modal — os RPCs reais por trás dessas ações (`aprovar_membro`, `confirmar_fechamento`) são definitivos e auditados, um modal de confirmação é barato e evita toque acidental.
- **Toast** — não existe ainda. Mesmo documento pede um toast curto (~4s) para confirmar o resultado de um ato definitivo (ex.: "Fechamento confirmado. O indicador foi notificado."). Recomendo incluir.

Se algum desses três componentes for necessário para prototipar as telas abaixo, é esperado — adicione ao design-system na fonte (`design-system/`) depois, e re-sincronize, do mesmo jeito que os tokens financeiros e o `Button.fullWidth` foram adicionados quando as 4 telas atuais precisaram.

## 4. Os 7 módulos

Para cada um: propósito, perfis com acesso, referência visual (quando existe), dados envolvidos (nomes de campo do modelo real, mesmo que a implementação em código continue usando dados mock por enquanto), e regras de negócio que a UI precisa refletir.

### 4.1 Login / Autenticação

**Referência:** `MasonConnectPrototipo`, ramo `tela === "login"` (linhas 434-457) — tela cheia, fundo escuro, card branco centralizado, logo, campo de seleção de perfil, botão "Entrar no sistema".

**Importante:** no protótipo de referência, o campo "Entrar como" é um `<select>` de perfil (Gestor/Administrativo/Empresário) — isso é um atalho do protótipo para navegar sem backend real ("Protótipo navegável · Fase 1 · dados de exemplo", linha 452). **Em produção isso não existe** — login é só e-mail + senha; o perfil vem do campo `categoria` do membro autenticado, não é escolhido manualmente. Ao prototipar, troque o seletor de perfil por: campo E-mail, campo Senha, botão "Entrar". Sem "esqueci minha senha" nem cadastro (RF-01 já cobre cadastro pela via de Membros/Aprovação) — a menos que queira incluir "esqueci minha senha" como uma segunda tela simples.

**Perfis com acesso:** todos (é a porta de entrada).

**Dados:** e-mail, senha (nunca exibidos após digitados — campo tipo password).

**Regras:** RNF-02 (autenticação individual, hash forte — não visível na UI, mas a UI não deve sugerir armazenamento de senha em claro); sessão carrega o perfil (Gestor/Administrativo/Empresário) do membro autenticado.

### 4.2 Fila de Aprovação de Membros pendentes

**Referência:** `Membros` (linhas 142-185) — o botão "Aprovar cadastro" ao lado de cada linha com `st === "pendente"`, visível só quando `perfil === "Gestor"`.

**Decisão de escopo:** pode ser uma tela própria (fila dedicada só de pendentes) ou uma extensão da tela Membros já existente (adicionar a ação "Aprovar"/"Recusar" às linhas já marcadas como pendentes, hoje só exibidas como Badge estático). Recomendo a segunda opção — é uma extensão pequena da tela que já existe, não uma tela nova do zero, e é assim que o protótipo de referência faz.

**Perfis com acesso:** ação de aprovar/recusar é exclusiva do Gestor. Administrativo e Empresário não veem a ação (Empresário nem deveria ver membros pendentes de todo — RN-02: "invisível a outros membros").

**Dados:** os mesmos já usados em `members.ts` (nome, CIM, loja, potência, empresa, plano, segmento) + campo de motivo de recusa (texto livre, opcional).

**Regras:** RF-02, RN-02 — aprovação/recusa registra autor+data+hora (trilha de auditoria, não precisa aparecer na UI de aprovação em si, mas a Configurações/Auditoria em 4.6 mostra esse rastro). Recusa tem motivo opcional. Com múltiplos Gestores, aprovação de um já basta.

### 4.3 Reuniões e Presença ao vivo

**Referência:** `Reuniao` (linhas 187-233) — cabeçalho com nome/data/hora da reunião + contador "presentes/total"; grade de cards por membro, cada um com o chip cíclico de presença (toque avança o ciclo); seção de convidados no rodapé.

**Perfis com acesso:** registro de presença é ação de Gestor/Administrativo (RF-07 a RF-11). Empresário provavelmente só vê sua própria presença histórica (não esta tela de registro ao vivo).

**Dados:** reunião (tipo, data, local, pauta — `TIPOS_REUNIAO`/`REUNIOES`), presença por membro (`PRESENCAS`: status presente/falta/justificada/representado, suplente_id se representado), convidados (`CONVIDADOS`: nome, empresa, contato, anfitrião, compareceu).

**Regras:**
- RNF-01: fluxo tem que ser executável em até 3 toques — o chip cíclico de um toque já resolve isso.
- Contador de faltas consecutivas (view materializada RN-08b): 2ª falta gera alerta, 3ª é crítica — worth destacar visualmente no card do membro quando alcançado (o protótipo de Painel, linha 120, mostra esse alerta na tela de Painel — replicar visualmente algo parecido aqui também, no card do próprio membro).
- Convidado recorrente (2ª participação) é sinalizado para o Gestor formalizar candidatura (RN-21 no protótipo, RF-26 no PRD).
- "Representado" exige selecionar o suplente responsável (campo extra ao marcar esse estado — o protótipo não modela isso, é uma decisão de UI em aberto).
- Considerar também: tela/seção de agendamento de reunião (criar uma nova reunião: tipo, data, local, pauta) — não está no protótipo de referência, mas é RF-07. Pode ser um formulário simples separado desta tela de presença ao vivo.

### 4.4 Indicações e Negócios

**Referência:** `Indicacoes` (linhas 235-311) — botão "Registrar indicação" abre formulário inline (destinatário, descrição); quadro de 4 colunas por estágio (Registrada/Em contato/Em andamento/Fechado); cada card mostra indicador→destinatário (com selo ⚿ de imutabilidade), descrição truncada, badge de estágio, alerta de SLA vencido/próximo do vencimento; botão "Confirmar fechamento" nos cards em andamento; valor de negócio fechado só visível a quem não é Empresário (ou é parte envolvida — regra de sigilo).

**Perfis com acesso:** todos podem registrar indicação e ver o próprio funil; sigilo de valores individuais restringe a visualização (RN-26) — só indicador, partes envolvidas e Gestão veem o valor; demais veem "valor restrito" (o protótipo já modela isso exatamente, linha 289-291).

**Dados:** `INDICACOES` (indicador — imutável, co-indicador opcional, destinatário, descrição, data, status, primeiro_contato_em), `NEGOCIOS` (trabalho realizado, valor, comissão, status, motivo_perda).

**Regras:**
- RN-11: crédito do indicador é imutável e perpétuo — daí o selo ⚿ no card, sinalizando visualmente que aquele campo nunca muda.
- RN-23: SLA de 7 dias para primeiro contato — o protótipo já mostra "SLA vencido" (>7 dias sem contato) e contagem regressiva perto do limite (linhas 292-293).
- RN-24: ciclo Registrada → Em contato → Em andamento → Fechado/Perdido — falta a coluna/estado "Perdido" no protótipo de referência (só tem 4 colunas, sem Perdido) — considerar adicionar como uma 5ª coluna ou como uma badge/filtro separado, com `motivo_perda` obrigatório ao mover pra lá.
- RN-13: fechamento via "Confirmar fechamento" é definitivo — ver a discussão de Modal na seção 3.
- RN-26: sigilo de valor — já coberto acima.
- Co-indicador (RF-32, crédito dividido) — não está no protótipo de referência, é uma extensão a considerar no formulário de registro (campo opcional "co-indicador").

### 4.5 Onboarding

**Sem protótipo de referência** — modelar a partir do texto do PRD.

**Perfis com acesso:** o próprio novo membro (visão de progresso do seu checklist) e o Gestor (visão de quem está com onboarding incompleto há mais de 30 dias).

**Dados:** `ONBOARDING` (membro_id, padrinho_id, etapa, concluido_em).

**Regras:** RN-15, RF-24 — checklist obrigatório: boas-vindas, apresentação dos 12 Pilares, 1ª reunião 1-a-1 com padrinho. Sinalização ao Gestor se incompleto após 30 dias. Sugestão de forma: um checklist simples (`List`/`ListRow` com `Badge` de concluído/pendente por etapa), reaproveitando componentes existentes — não deveria precisar de nada novo no design-system.

### 4.6 Configurações do Gestor

**Referência:** `Config` (linhas 389-426) — duas colunas: planos de mensalidade editáveis (nome, valor, botão "Editar valor") e regras parametrizáveis (nome, valor atual, código da regra — ex. "Limite de faltas consecutivas · 3 reuniões · RN-08b"); card de trilha de auditoria no rodapé (lista cronológica de ações críticas com autor/data/hora).

**Perfis com acesso:** exclusivo do Gestor (RNF-07 — "nenhuma regra de negócio fixada em código", precisa de interface editável).

**Dados:** `PLANOS` (nome, valor, periodicidade), tabela de parâmetros de configuração (SLA de indicação, limite de faltas, convidados por reunião, antecedência de falta justificada, política de comissão — ainda pendente de ratificação, RN-09), `AUDITORIA` (entidade, ação, autor, data, antes/depois — append-only).

**Regras:** edição de valor deve ser auditada (toda mudança gera entrada na trilha). Regras "pendentes de ratificação" (a política de comissão é uma delas, RN-09) devem aparecer com badge de alerta, não como se já estivessem decididas — o protótipo já faz isso (linha 415, `bg: warn` quando o valor contém "Pendente").

### 4.7 Ocorrências de conduta

**Sem protótipo de referência** — modelar a partir do texto do PRD. Tela sensível — só a gestão vê.

**Perfis com acesso:** exclusivo do Gestor.

**Dados:** `OCORRENCIAS_CONDUTA` (membro_id, tipo, descrição, validada_por).

**Regras:** RN-32, RF-36 — tipos fixos: networking por interesse imediato, falsidade relacional, promessas vazias, exposição desnecessária, pressão agressiva, manipulação emocional. 3 ocorrências validadas abrem processo de revisão de permanência do membro. Sugestão de forma: lista de ocorrências por membro (reaproveitando `List`/`ListRow`), botão de registrar nova (formulário: membro, tipo — `Select` com os 6 tipos fixos, descrição). Dado o caráter sensível, considerar se a tela precisa de algum aviso visual de confidencialidade — decisão de quem prototipar.

## 5. Notas transversais para quem for prototipar

- **Mobile-first**, mesmo tratamento das 4 telas atuais: o protótipo de referência é desktop com sidebar — reprojetar para navegação inferior/mobile, não copiar a estrutura de sidebar+grid de 2-3 colunas literalmente.
- **Navegação**: com 4 telas hoje cabendo direto nos 4 ícones do `BottomNav`, e agora até 7 módulos novos (nem todos vão virar itens de navegação de primeiro nível — Aprovação vira parte de Membros, por exemplo), o botão ☰ do header mobile (hoje decorativo, sem ação) é candidato natural a virar o gatilho de um menu/drawer com os itens que não cabem na barra inferior. Vale prototipar esse menu como parte desta leva, já que a necessidade dele nasce exatamente da chegada dessas novas telas.
- **Perfis**:Toda tela acima varia por perfil (Gestor/Administrativo/Empresário) — o protótipo de referência já modela isso extensivamente (props `perfil` entrando em quase toda função de tela). Preservar essa variação ao prototipar.
- **Tom/idioma**: português, mesmo vocabulário e tom já estabelecido nas 4 telas atuais (ex. "Irmão" no acolhimento, nunca em rótulo repetido — nota do documento original do design-system).
