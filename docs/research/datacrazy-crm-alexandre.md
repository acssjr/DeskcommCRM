# DataCrazy como referência para o CRM do Alexandre

## Fontes

- [Canal DataCrazy](https://www.youtube.com/@CRM.Datacrazy/videos). O catálogo inicial tem 304 títulos pesquisáveis. A seleção aprofundada começou por nove tutoriais de conexões, Instagram, funil, automações e agentes.
- [Notebook de referências](https://notebook.google.com/notebook/5e03b4d6-d4ce-4e90-9d22-3224c554d074), com nove vídeos e dois artigos. A transcrição do tutorial de comentários foi aberta e conferida.
- A galeria local em `Documents/Datacrazy-referencias/index.html` permite ampliar os frames ou ir ao timestamp no YouTube. As imagens ficam fora do repositório.

## O que aproveitar no Deskcomm

| Área | Padrão observado | Aplicação no Deskcomm |
| --- | --- | --- |
| Navegação | Trilho compacto, seleção legível e navegação de contexto separada nas telas complexas | Usar o menu recolhível existente, preservar atalhos de toque e tornar a página ativa visível por texto, peso e marcador. |
| Funil | Cabeçalhos de etapa com cor, contagem e ações no cartão | Usar as cores que a equipe já configurou. Manter oportunidade, próxima ação e origem visíveis no cartão. No celular, preservar rolagem e seleção por toque. [Configuração de pipelines](https://www.youtube.com/watch?v=MrB-o_FTrnw&t=205s) |
| Atendimento | Filas por situação, pausa de automação, transferência e notas no contexto da conversa | Reusar o Inbox e seus estados. Dar prioridade visual ao que exige ação do Alexandre. [Multiatendimento](https://help.datacrazy.io/pt-br/articles/10670761-aba-de-multiatendimento-visao-geral) |
| Automações | Gatilho, condição e ação no mesmo canvas, com contadores e configuração ao lado | Evoluir o editor em `app/app/webhooks/automacoes/[id]`. Nas caixas, mostrar condição de entrada, próxima ação, ramo de erro e resultado recente. [Editor](https://www.youtube.com/watch?v=B7oMdaamc0E&t=170s) · [Gatilhos de conversa](https://www.youtube.com/watch?v=Bd_pomw8Ljo&t=240s) |
| IA | Configuração por área, teste ao vivo e métricas do agente | Usar configurações e testes do módulo de IA existente. Priorizar taxa de handoff, tempo até primeira resposta e falhas por canal. [Interface do agente](https://www.youtube.com/watch?v=A3MqqtNk1EE&t=80s) |
| Medição | Separação por canal, funil e etapa | Medir Instagram e WhatsApp por origem, da conversa à avaliação agendada. Registrar `comentário recebido`, `DM enviada`, `resposta recebida` e `avaliação agendada` como eventos distintos. [Painel multicanal](https://www.youtube.com/watch?v=0KqFXBhhBac) |

## Instagram como canal de captação

O DataCrazy oferece **Configurações → Conexões → Criar → Instagram API**, com login pelo Instagram ou pelo Facebook. O tutorial de comentários configura a conta, o post ou Reel e o tipo de comparação da palavra-chave. O exemplo de seguidores começa por **Mensagem recebida** e consulta a condição de seguidor dentro do fluxo. [Conexão](https://help.datacrazy.io/pt-br/articles/10553236-como-integrar-o-instagram) · [Comentários](https://www.youtube.com/watch?v=LSRCIWPrhm4&t=480s) · [Condição de seguidor](https://www.youtube.com/watch?v=srCCAVpe0X8&t=105s)

No Deskcomm, o caminho implementado neste checkout passa por **Conexões → Redes sociais** e Zernio. A entrada de DMs reutiliza Inbox, registro de origem, pausa e opt-out. A conexão Meta direta aparece no catálogo, mas `lib/channels/social/porta.ts` ainda declara `implementada: false`. A ingestão de comentários e a criação de regras de comentário para DM também ainda faltam no Deskcomm. [Contrato de redes sociais](../specs/redes-sociais-nativas.md)

O Zernio já documenta regras de comentário para DM, logs, evento `comment.received` e uma API de resposta privada. Para a primeira entrega, usar a regra hospedada do provedor evita duplicar o disparador. Confirmar os escopos, o acesso ao recurso na conta e a correspondência entre o `accountId` autorizado e a sessão social antes de criar uma regra. [Changelog da API Zernio](https://docs.zernio.com/changelog) · [Coleção oficial da Meta](https://www.postman.com/meta/instagram/documentation/6yqw8pt/instagram-api)

### Piloto com um Reel de teste

1. Vincular uma conta profissional de teste pelo fluxo autorizado de Redes sociais. Manter a automação pausada e confirmar DM recebida, resposta manual e identidade correta no Inbox.
2. Associar uma única regra ao Reel de teste. Usar `AVALIAÇÃO` como palavra-chave, com comparação que reconheça maiúsculas e a variante sem acento. Começar com resposta privada em texto simples e confirmar que a regra ignora comentários do próprio perfil. Conferir também a janela permitida pelo provedor e impedir reenvio por comentário repetido.
3. Usar uma mensagem curta que peça uma escolha antes de qualificar. Exemplo para revisão: “Opa! Vi seu comentário sobre a avaliação. Você prefere entender como funciona online ou ver as opções presencialmente?” Esperar a pessoa responder antes de continuar com perguntas ou oferecer o agendamento.
4. Quando chegar a DM de volta, vincular origem e campanha ao contato, registrar a oportunidade no funil de prótese e mostrar a conversa na fila certa. Usar o identificador do Instagram até que a própria pessoa forneça um telefone. O mesmo telefone em canais diferentes requer vínculo confirmado.
5. Cobrir comentários correspondentes e divergentes, evento repetido, tentativa após o prazo, perfil próprio, conexão revogada, erro de entrega, resposta do cliente e handoff. No teste, usar post e perfis controlados. Desligar a regra no provedor deve suspender envios e aparecer no estado mostrado pelo CRM.

Para trazer a administração ao Deskcomm, a tela de regras deve exibir conta e mídia vinculadas, palavra-chave, prévia da mensagem, pausa e último resultado real. O servidor resolve conta e tenant a partir da sessão autenticada, guarda o ID da regra remota e reconcilia o estado após falhas. O registro de eventos deve distinguir aceitação pelo provedor de entrega quando esta estiver disponível. Qualquer condição de seguidor precisa de um caminho explícito para estado desconhecido.

## Transcrições e frames

No NotebookLM, adicionar o link público pela opção **Sites** e abrir a fonte para ler o texto importado. O serviço usa as legendas disponíveis para o vídeo. O CLI `notebooklm` foi instalado para gestão de fontes e exportação de texto. O uso por linha de comando depende de uma sessão autenticada separada. A skill `transcricao-local` usa Faster Whisper em CPU e gera SRT a partir de áudio ou vídeo local. O frame continua ligado ao timestamp do vídeo, mesmo quando a transcrição é obtida por outra via. [Tipos de fonte aceitos pelo Google](https://support.google.com/notebooklm/answer/16215270) · [Faster Whisper](https://github.com/SYSTRAN/faster-whisper)

## Auditoria do Studio em 11/11/2026

| Área | O que apareceu em produção | Pendência |
| --- | --- | --- |
| Instagram | A aba Redes sociais exibe **Vincular o provedor** e pede a chave de API do Zernio. | Vincular o perfil profissional e validar recebimento e resposta de DM. Só depois testar a regra de comentário para DM. |
| Funil | **Avaliação de prótese capilar** é o funil padrão. O quadro exibe oito etapas e quatro cards em Novo contato na consulta. | O agente precisa de escopo explícito no funil para mover cards. A Central registrou uma tentativa bloqueada por ausência de funil liberado. |
| Automações | Oito regras de WhatsApp ativas. Há primeiro contato para anúncio e Google, menu inicial e opções de 0 a 4. | A Central registra disparos do menu bloqueados pelo modo de teste do canal. Validar com destinatário autorizado e conferir o resultado de entrega antes de ampliar o alcance. |
| Conhecimento | Duas fontes de prótese aguardavam indexação por falta de chave de embeddings. | Cadastrar a credencial de embeddings escolhida e confirmar a indexação antes de avaliar a qualidade das respostas do agente. |

As etapas são Novo contato → Em conversa → Avaliação solicitada → Avaliação confirmada → Avaliação realizada → Proposta enviada → Venda concluída, com Sem avanço como desfecho separado. A consulta de produção foi feita pela interface autenticada. A prévia de desenvolvimento usa um Supabase local com dados E2E. A autenticação SSH na VPS recusou as chaves disponíveis durante a preparação da prévia.

## O que construir primeiro em automações

| Prioridade | Padrão de referência | Aplicação no Deskcomm | Como validar no Studio |
| --- | --- | --- | --- |
| 1. Resultado por execução | O DataCrazy relaciona gatilho, conexão, condições e sequência de blocos. O multiatendimento mostra falhas de envio e dá acesso à conversa. | Reaproveitar o canvas, **Webhooks → Atividade** e a Central de avisos. Na mesma linha, mostrar evento, regra, bloco, resultado e link para a conversa. Distinguir gatilho aceito, filtro sem correspondência, ação bloqueada e entrega confirmada. | Simular o menu com canal de teste, destinatário fora da lista e destinatário autorizado. Cada caso deve explicar a decisão e apontar para o card e a conversa certos. [Automações](https://help.datacrazy.io/pt-br/articles/10670845-mcp-automacoes) · [Filas de atendimento](https://help.datacrazy.io/pt-br/articles/10670761-aba-de-multiatendimento-visao-geral) |
| 2. Simulação e reentrada | O editor do DataCrazy permite combinar gatilhos, condições e blocos, inclusive espera e operação de campo. | Aproveitar a regra pausada e a validação de desenho que já existem. Acrescentar simulação por evento com o caminho percorrido e os efeitos previstos, incluindo qual regra venceu se anúncio, Google e menu coincidirem. Separar essa simulação da prévia existente de agentes de IA. | Repetir o mesmo evento e comparar os resultados. Uma mensagem com origem específica deve abrir um fluxo. Repetir a entrega do mesmo evento deve manter um único efeito. [Primeira automação](https://help.datacrazy.io/pt-br/articles/10670672-como-criar-a-primeira-automacao) |
| 3. Atendimento e retomada | O DataCrazy oferece ação manual no chat, pausa do robô, notas e mensagens agendadas. | Usar a conversa como ponto de operação. Exibir quem conduz o atendimento, a próxima ação e a origem. Trazer a execução manual para ações com propósito claro, como preparar avaliação ou criar tarefa. | Ao assumir a conversa, conferir que o follow-up elegível para aquele contato é revisto. Ao retomar, conferir qual gatilho pode iniciar uma nova execução. [Ações no chat](https://help.datacrazy.io/pt-br/articles/10670613-introducao-ao-multiatendimento) |
| 4. Avanço com confirmação | O histórico do lead conecta mudanças, notas e negócios. | Usar a resposta do cliente para registrar intenção e criar tarefa. Usar o evento confirmado da agenda para avançar para Avaliação confirmada. Restringir o agente ao funil escolhido e registrar o motivo das movimentações. | Testar pedido de horário, confirmação efetiva, remarcação e cancelamento. Conferir o card existente em vez de gerar um duplicado. [Histórico do lead](https://help.datacrazy.io/pt-br/articles/10670814-leads-como-utilizar-essa-aba-no-datacrazy) |
| 5. Instagram com origem rastreável | O Zernio registra separadamente comentário, resposta privada e gatilhos de DM ou resposta a story, conforme a regra. | Começar por um Reel de teste e uma palavra-chave. Guardar origem e referência do conteúdo quando disponíveis. Conferir a primeira DM, a resposta da pessoa e a entrada na fila. | Testar comentário correspondente, palavra fora do filtro, repetição e resposta da pessoa. Confirmar o resultado no Zernio e no Deskcomm. [Changelog do Zernio](https://docs.zernio.com/changelog) |

Para o Inbox, os padrões mais úteis são separar fila de trabalho do histórico, mostrar a conexão no contexto da conversa e tornar a falha acionável. O Deskcomm já tem filtros, estados de atendimento e Central de avisos. O próximo passo de interface é fazer cada aviso abrir o ponto exato que precisa de ação e manter o contexto do lead à vista. [Multiatendimento](https://help.datacrazy.io/pt-br/articles/10670613-introducao-ao-multiatendimento)

### Evidência adicional dos tutoriais

- **Logs por bloco.** O tutorial mostra contadores de entradas, sucessos, alertas e erros em cada bloco. Abrir uma ocorrência mostra o caminho do lead e a causa do bloqueio. No Deskcomm, um aviso como “envio bloqueado pelo modo de teste” deve levar à execução e ao bloco de envio. Se houver retentativa, revalidar canal, destinatário e resultado anterior antes de tentar de novo. [Tutorial de logs](https://www.youtube.com/watch?v=vdRv1HhdQaQ&t=25s)
- **Ação após o último follow-up sem resposta.** O tutorial mostra uma decisão configurável no fim da cadência, com instrução, encerramento ou execução de ferramenta. Para o Studio, registrar uma tarefa de decisão quando a pessoa demonstrou interesse em avaliação. O próximo disparo depende do estado atual da conversa, do horário e da responsabilidade do atendente. [Tutorial de follow-up com ferramentas](https://www.youtube.com/watch?v=Hy9-IVSA6As&t=23s)
