# Design do CRM Alexandre Souza Studio

Esta referência orienta o fork do Studio e complementa o [design system do Deskcomm](docs/design-system/README.md). A casca de trabalho usa Makking e superfícies neutras. As medidas saem de [`app/globals.css`](app/globals.css) e os ajustes da casca vivem em [`workspace.css`](app/app/_components/workspace.css). O [estudo de UI do Studio](../alexandre-arquivos-preservados/estudo-design-ui.md) serve de base para proximidade, densidade e revisão em navegador.

## Marca do Studio

A referência oficial é o [repositório da plataforma de agendamento](https://github.com/acssjr/alexandre-souza-studio), disponível localmente em `C:\dev\alexandre-souza-studio`. Os vetores ficam na pasta `public/brand` desse repositório. O componente de marca do agendamento usa variantes horizontais próprias para os temas claro e escuro.

A [barra lateral do CRM](components/shell/Sidebar.tsx) usa [`public/studio-scissors.svg`](public/studio-scissors.svg), uma cópia do símbolo oficial do Studio. Para atualizar a marca do CRM, confira primeiro o vetor na pasta do agendamento e copie a variante adequada para `public/` do Deskcomm. A cópia local permite que a barra carregue o SVG junto com o CRM.

## Espaçamento

| Relação | Medida | Implementação |
| --- | ---: | --- |
| Estado e contador, ícone decorativo pequeno | 4 px | `gap-1` |
| Ícone e rótulo, filtros auxiliares, título e texto de apoio | 8 px | `gap-2` |
| Inset do painel de trabalho, filtros e linhas densas | 12 px | `px-3` ou `p-3` |
| Card comum, espaço entre cards e margem lateral no celular | 16 px | `p-4`, `gap-4` |
| Margem lateral da casca a partir de `sm`, card amplo, grupos de formulário | 24 px | `sm:p-6`, `gap-6` |
| Distância entre seções independentes | 32 px | `gap-8` |
| Separação entre blocos de uma página de apresentação | 48–64 px | `gap-12` a `gap-16` |

O contêiner da lista ou grade controla o `gap`. Cada card controla seu padding interno. Título e descrição ficam no mesmo grupo. Entre grupos, use o próximo passo da escala. Ao encostar dois componentes, confira a soma dos paddings no navegador.

Use 4 px para ajustes internos e 8 px como base das relações. Alturas de controle seguem 32 px para filtros densos, 40 px para busca e ações frequentes no desktop e meta de 44 px em superfícies de toque. Use borda de 1 px, áreas seguras e medidas de posicionamento quando forem necessárias ao componente. Documente a razão de uma medida específica junto ao código.

## Tipografia, superfície e estados

| Papel | Tamanho / entrelinha | Peso |
| --- | --- | --- |
| Título de página | 24–28 / 32–36 px | 600–700 |
| Título de painel | 16–18 / 24 px | 600 |
| Linha de lista, botão ou texto principal | 14 / 20 px | 400–600 |
| Filtro compacto e informação auxiliar | 12 / 16 px | 400–500 |

Makking é a fonte da interface. Atkinson cobre caracteres ausentes. IBM Plex Mono atende códigos e campos técnicos. Use números tabulares em contagens que mudam. Priorize quebra ou redução de conteúdo secundário quando um rótulo de ação precisar de espaço.

- `bg-background` no fundo de trabalho, `bg-card` na lista e no painel, `bg-surface-elevated` em controles selecionados e grupos discretos.
- `text-text` para informação principal, `text-text-muted` para apoio, `border-border` para divisórias e `border-border-strong` para limites que precisam ser percebidos.
- Raio de 8 px para controles e 12 px para painéis. Reserve cápsulas para filtros rápidos, marcadores e contadores.
- A seleção combina superfície e peso do texto. Estados críticos combinam rótulo com cor ou ícone. O foco de teclado permanece visível em ambos os temas. Verifique 4,5:1 para texto comum e 3:1 para limites necessários à identificação do controle. [WCAG 2.2](https://www.w3.org/TR/WCAG22/)

## Composição das páginas

| Tela | Estrutura |
| --- | --- |
| Inbox | Lista com ação, busca em largura total, filtros auxiliares e filas. Conversa no centro e ficha do contato quando houver espaço. Use 12 px no cabeçalho da lista, 8 px entre grupos e 4 px entre abas. As abas quebram em mais de uma linha em listas estreitas. No celular, lista e conversa ocupam a tela em momentos diferentes. |
| Funil | Uma barra para busca e filtros. Colunas com nome, contagem e cor cadastrada da etapa. Use 8 px entre cards e 12 px no cabeçalho. Preserve a rolagem dentro do quadro. Dê prioridade ao contato, à próxima ação e à origem. |
| Automações | Lista e estado da regra, canvas para o fluxo e painel para configurar o bloco selecionado. Separe condição, ação e resultado pelo rótulo e pela forma. Preserve espaço para ver a regra inteira e consultar sua última execução. |
| Configurações | Agrupe campos por tarefa. Use 8 px entre rótulo e campo, 16 px entre campos e 24 px entre grupos. A ação de salvar fica associada ao grupo que altera. |

## Revisão no navegador

1. Confira a rota e a versão usadas para a comparação. Use 360, 768, 1159 e 1440 px, mais os dois lados do breakpoint alterado. Em 320 px, verifique que os controles ficam alcançáveis.
2. Meça a área clicável, o alinhamento dos insets e a rolagem. Em telas baixas, a lista do Inbox e a navegação devem continuar acessíveis.
3. Passe por estado vazio, carregamento, erro e conteúdo longo. No Inbox, teste busca, mudança de fila, foco por teclado e o arraste da divisória. No funil, confira colunas vazias e cartões com títulos longos.
4. Registre rota, viewport e comportamento observado. Use a interface autenticada para revisar a estrutura real do aplicativo.
