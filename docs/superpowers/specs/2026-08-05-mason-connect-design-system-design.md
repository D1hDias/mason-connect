# Design: `design-system/` — Biblioteca de Componentes Mason Connect

**Data:** 2026-08-05
**Status:** Aprovado para planejamento

## 1. Objetivo

Construir uma biblioteca de componentes React/TypeScript real e compilável (com `dist/` publicável) que formalize a identidade visual já oficializada do Mason Connect, para servir de insumo ao `/design-sync`.

Fluxo completo pretendido (apenas os dois primeiros passos são escopo desta spec):
1. **Esta spec + plano** → construir o pacote `design-system/`.
2. Rodar a skill `/design-sync` apontando para esse pacote → sincroniza os componentes reais com um projeto em claude.ai/design.
3. (Fora de escopo aqui) Usar o claude.ai/design para prototipar as telas do app mobile-first, compondo os componentes sincronizados. Decisões de composição de tela (layout exato, navegação entre estados, etc.) serão validadas nesse momento, olhando o resultado — não são travadas nesta spec.
4. (Fora de escopo aqui) Construir a aplicação real a partir do que for validado no protótipo.

## 2. Fontes usadas

- `Documentos/Identidade visual MASON/mason-connect-tokens.json` e `.css` — tokens oficiais de cor, tipografia, espaçamento, raio, sombra (inclui tema claro "brand" e tema escuro "deck").
- `Documentos/MC_BlocoC_08_Prototipo_Navegavel.jsx` — protótipo de alta fidelidade de um dashboard desktop, usado como catálogo do vocabulário visual (quais componentes existem, como se comportam), **não** como fonte de layout de tela para o produto final (que é mobile-first).
- `Documentos/Identidade visual MASON/Manual_Identidade_Visual_MasonConnect.{docx,pdf}` — manual de marca (não lido em profundidade nesta fase; revisar durante implementação se houver diretrizes adicionais de contraste/acessibilidade não capturadas nos tokens).

## 3. Escopo do v1

**Fiel ao protótipo, com adaptação mobile-first.** Cobre exatamente os padrões visuais já existentes no protótipo (nenhum componente novo "especulativo" como modal, toast, paginação — fica para v2), mas:
- Cores, tipografia, espaçamento e componentes de conteúdo seguem o protótipo/tokens tal como estão.
- Padrões de **navegação e layout de tela** (sidebar fixa, grids de 3-4 colunas) são reprojetados para mobile-first: viram referência de conteúdo, não de estrutura.
- Tema "deck" (escuro, para apresentações) fica **fora do v1** — documentado nos tokens exportados, sem componentes dedicados.

## 4. Estrutura do pacote

```
design-system/
  src/
    tokens/           # cores, tipografia, espaçamento, raio, sombra (TS + CSS)
    components/
      Button/
        Button.tsx
        Button.stories.tsx
        Button.test.tsx
        index.ts
      Badge/
      Card/
      SectionTitle/
      Stat/
      Avatar/
      Input/
      Select/
      FilterTabs/
      List/
      ListRow/
      ProgressBar/
      EmptyState/
      BottomNav/
      NavTab/
      TrendLineChart/
      CategoryBarChart/
    index.ts          # barrel export público do pacote
  styles.css           # importa tokens.css + estilos gerados do Tailwind
  tailwind-preset.ts   # preset exportado (consumidores/Storybook estendem este preset)
  .storybook/
  package.json
  tsup.config.ts
  tailwind.config.ts
  vitest.config.ts
```

- **Nome do pacote:** `mason-connect-design-system`.
- **Convenção de nomes:** sem prefixo (`Button`, não `McButton`) — o pacote já é o escopo/namespace.
- **Gerenciador de pacotes:** npm (não há preferência prévia no repo).

## 5. Tooling

| Preocupação | Escolha | Motivo |
|---|---|---|
| Build | `tsup` (esbuild) | Saída ESM+CJS+`.d.ts`; mesma base (esbuild) que o `/design-sync` já usa para compilar o `dist/` depois |
| Estilo | Tailwind, tema estendido a partir dos tokens oficiais (não valores arbitrários) | Mesma linguagem visual já validada no protótipo, alta velocidade |
| Tokens brutos | `tokens.css` (custom properties) importado por `styles.css` | Fonte única, também consumível fora do React se necessário |
| Documentação/preview | Storybook (`@storybook/react-vite`) | Caminho de maior fidelidade no `/design-sync` (compara preview gerado com render real do Storybook) |
| Testes | Vitest + React Testing Library | Padrão leve, roda bem com Vite/esbuild |

## 6. Tokens — fonte da verdade e divergência resolvida

Os arquivos `mason-connect-tokens.{css,json}` são a fonte oficial (não o protótipo). Divergência encontrada e resolvida:

- **Cor `cream`**: protótipo usa `#F5EFE3`; token oficial é `#F7F1E4`. **A biblioteca segue o token oficial (`#F7F1E4`)**. Registrar essa correção no changelog/notas do pacote.

Todas as demais cores, a tipografia (Georgia para headings, Verdana/Segoe UI para corpo) e a escala de espaçamento/raio/sombra vêm diretamente dos tokens.

**Item aberto para verificar na implementação:** o manual de identidade visual não foi lido em detalhe; conferir se há diretrizes de contraste (WCAG) além dos tokens antes de finalizar as combinações cor-de-texto/fundo dos componentes.

## 7. Inventário de componentes

Cada componente exporta props tipadas via TypeScript, documentadas com JSDoc (isso vira a base do `.prompt.md` que o `/design-sync` gera depois). Nenhum componente aceita `style`/cores soltas como no protótipo — variantes semânticas substituem os pares `bg`/`fg` ad hoc do protótipo.

| Componente | Origem no protótipo | Props principais (sketch) |
|---|---|---|
| `Button` | botões primário/secundário em todas as telas | `variant: 'primary'\|'secondary'`, `disabled?`, altura mínima 44px |
| `Badge` | status pills (Ativo, Pendente, SLA vencido, Presente/Falta, Justificada...) | `variant: 'success'\|'warning'\|'critical'\|'neutral'\|'accent'` |
| `Card` | container em todas as telas | `padded?: boolean` |
| `SectionTitle` | título de tela + sublinha + traço dourado | `subtitle?: string` |
| `Stat` | KPI tiles (Painel, Financeiro) | `label`, `value`, `hint?`, `tone?: 'default'\|'success'\|'accent'` |
| `Avatar` | iniciais circulares (lista de Membros, marca do login) | `initials` ou `name`, `tone?: 'active'\|'pending'` |
| `Input` | campos de formulário (login, nova indicação) | `label`, `value`, `onChange`, `placeholder?` |
| `Select` | seleção de perfil no login | `label`, `value`, `onChange`, `options` |
| `FilterTabs` | alternância "todos/pendentes" (Membros); reutilizável para trocar categorias de status | `options`, `value`, `onChange` |
| `List` | container com zebra-striping automático + faixa de título opcional (ex.: "Extrato do caixa") | `header?: string`, `children` |
| `ListRow` | linha zebrada dentro de `List` (Membros, Config, extrato Financeiro) | `leading?`, `title`, `subtitle?`, `trailing?` |
| `ProgressBar` | funil em Relatórios | `label`, `value: number`, `percent: number`, `tone?: 'accent'\|'success'` |
| `EmptyState` | "Nada por aqui..." (colunas de Indicações) | `message`, `hint?` |
| `BottomNav` | ~~sidebar~~ → barra de abas fixa mobile | `children` (lista de `NavTab`) |
| `NavTab` | item de navegação (ativo = destaque dourado) | `label`, `icon?`, `active`, `onClick` |
| `TrendLineChart` | evolução no Painel | `data: {label, value}[]`, `valueFormatter?` |
| `CategoryBarChart` | indicações por membro em Relatórios | `data: {label, value}[]`, `valueFormatter?` |

Telas completas do protótipo (Login, Painel, Membros, Reunião, Indicações, Financeiro, Relatórios, Config) **não** viram componentes exportados — servem apenas de referência para as stories de composição no Storybook (mostrando os primitivos combinados). Essas composições são ilustrativas, não vinculantes: a composição real das telas mobile será decidida durante a prototipagem no claude.ai/design.

## 8. Regra transversal: mobile-first

- Todo alvo interativo (`Button`, `Input`, `Select`, `ListRow`, `NavTab`, `FilterTabs`) tem altura mínima de 44px, substituindo as alturas de 36-40px do protótipo desktop.
- Nenhum componente de conteúdo (`Stat`, `Card`, gráficos) assume grade lateral — todos renderizam bem em largura total/coluna única por padrão.
- `BottomNav` substitui a sidebar como padrão de navegação primária.

## 9. Qualidade

- Cada componente: TypeScript estrito, props documentadas via JSDoc, teste de render (Vitest + RTL) cobrindo as variantes principais e, quando aplicável, uma interação (ex.: `FilterTabs` alterna seleção ao clicar), e ≥1 story com um caso de uso real extraído do protótipo.
- Semântica HTML básica: `<button>`, `<nav>`, `label` associado a `input`/`select` via `htmlFor`/`id`, `aria-current="page"` no `NavTab` ativo.

## 10. Fora de escopo (v1)

Modais, toasts, tabs genéricas (fora do padrão `FilterTabs`), paginação, tema "deck" (escuro), qualquer componente sem lastro direto no protótipo ou nos tokens.

## 11. Próximos passos após esta spec

1. Plano de implementação (via `writing-plans`) para construir `design-system/` conforme este desenho.
2. Build + Storybook rodando localmente, testes passando.
3. Rodar `/design-sync` apontando para `design-system/`.
