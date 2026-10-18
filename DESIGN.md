---
name: Festolândia Premium Natal Encantado
description: Landing page de Natal da Festolândia, um espetáculo de teatro em bordô de veludo, verde pinheiro, dourado de enfeite e marfim de neve, com elenco real em cena.
colors:
  bordo: "#3B0A12"
  bordo-fundo: "#2A060C"
  bordo-rodape: "#22050A"
  bordo-claro: "#5B1521"
  vermelho: "#B3172F"
  vermelho-vivo: "#D02A42"
  verde: "#123A2B"
  dourado: "#D9B25C"
  dourado-hover: "#E4C072"
  dourado-claro: "#F4DC96"
  dourado-escuro: "#B88C3E"
  marfim: "#FFF8EE"
  creme: "#F6EADB"
  branco: "#FFFFFF"
  tinta: "#2B1712"
  texto: "#5C4036"
  texto-claro: "rgb(255 248 238 / .84)"
  fio: "#EAD9C2"
  fio-campo: "#E2CDB0"
  fio-escuro: "rgb(255 248 238 / .14)"
  verde-zap: "#15803D"
typography:
  display:
    fontFamily: "'Lilita One', 'Lilita fallback', 'Arial Black', sans-serif"
    fontSize: "clamp(44px, 2.6vw + 24px, 66px)"
    fontWeight: 400
    lineHeight: 0.96
    letterSpacing: ".002em"
  headline:
    fontFamily: "'Lilita One', 'Lilita fallback', 'Arial Black', sans-serif"
    fontSize: "clamp(34px, 2.4vw + 18px, 60px)"
    fontWeight: 400
    lineHeight: 1.02
    letterSpacing: ".004em"
  numeral:
    fontFamily: "'Lilita One', 'Lilita fallback', 'Arial Black', sans-serif"
    fontSize: "clamp(84px, 5vw + 30px, 124px)"
    fontWeight: 400
    lineHeight: 0.9
  title:
    fontFamily: "'Lilita One', 'Lilita fallback', 'Arial Black', sans-serif"
    fontSize: "clamp(21px, .5vw + 16px, 26px)"
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: ".01em"
  subtitle:
    fontFamily: "'Montserrat', 'Montserrat fallback', system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 700
    lineHeight: 1.3
  body-lead:
    fontFamily: "'Montserrat', 'Montserrat fallback', system-ui, sans-serif"
    fontSize: "clamp(15.5px, .25vw + 14.5px, 18px)"
    fontWeight: 400
    lineHeight: 1.65
  body:
    fontFamily: "'Montserrat', 'Montserrat fallback', system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.65
  body-sm:
    fontFamily: "'Montserrat', 'Montserrat fallback', system-ui, sans-serif"
    fontSize: "14.5px"
    fontWeight: 400
    lineHeight: 1.55
  label-botao:
    fontFamily: "'Montserrat', 'Montserrat fallback', system-ui, sans-serif"
    fontSize: "15.5px"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: ".01em"
  label-campo:
    fontFamily: "'Montserrat', 'Montserrat fallback', system-ui, sans-serif"
    fontSize: "13.5px"
    fontWeight: 700
    lineHeight: 1.3
  label-caixa-alta:
    fontFamily: "'Montserrat', 'Montserrat fallback', system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: ".12em"
rounded:
  pilula: "999px"
  circulo: "50%"
  cartao-grande: "26px"
  cartao: "22px"
  item: "18px"
  icone: "16px"
  foto: "14px"
  campo: "12px"
spacing:
  container: "1240px"
  margem: "clamp(16px, 4.4vw, 96px)"
  secao-y: "clamp(72px, 7vw, 120px)"
  altura-topo: "78px"
  altura-topo-celular: "64px"
  cabecalho-gap: "14px"
  cabecalho-base: "clamp(36px, 4vw, 56px)"
  gap-cartoes: "18px"
  gap-elenco: "24px"
components:
  button-primary:
    backgroundColor: "{colors.dourado}"
    textColor: "{colors.tinta}"
    typography: "{typography.label-botao}"
    rounded: "{rounded.pilula}"
    padding: "0 28px"
    height: "54px"
  button-primary-hover:
    backgroundColor: "{colors.dourado-hover}"
    textColor: "{colors.tinta}"
  button-small:
    rounded: "{rounded.pilula}"
    padding: "0 18px"
    height: "44px"
  button-outline-light:
    backgroundColor: "rgb(42 6 12 / .28)"
    textColor: "{colors.marfim}"
    rounded: "{rounded.pilula}"
    padding: "0 28px"
    height: "54px"
  button-outline-red:
    backgroundColor: "transparent"
    textColor: "{colors.vermelho}"
    rounded: "{rounded.pilula}"
    padding: "0 18px"
    height: "44px"
  button-outline-red-hover:
    backgroundColor: "{colors.vermelho}"
    textColor: "{colors.marfim}"
  card-servico:
    backgroundColor: "{colors.bordo}"
    textColor: "{colors.marfim}"
    rounded: "{rounded.cartao}"
    padding: "22px"
  card-personagem:
    backgroundColor: "{colors.branco}"
    textColor: "{colors.texto}"
    rounded: "{rounded.cartao}"
    padding: "10px 10px 18px"
  card-avaliacao:
    backgroundColor: "{colors.branco}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.cartao}"
    padding: "26px 26px 22px"
  selo-nota:
    backgroundColor: "{colors.bordo}"
    textColor: "{colors.texto-claro}"
    rounded: "{rounded.cartao}"
    padding: "40px 28px"
  faixa-provas:
    backgroundColor: "{colors.marfim}"
    textColor: "{colors.texto}"
    rounded: "{rounded.cartao}"
    padding: "26px 12px"
  faq-item:
    backgroundColor: "{colors.marfim}"
    textColor: "{colors.bordo}"
    rounded: "{rounded.item}"
    padding: "16px 20px 16px 22px"
  faq-item-aberto:
    backgroundColor: "{colors.branco}"
    textColor: "{colors.bordo}"
  cartao-formulario:
    backgroundColor: "{colors.marfim}"
    textColor: "{colors.texto}"
    rounded: "{rounded.cartao-grande}"
    padding: "clamp(24px, 2.6vw, 38px)"
  campo:
    backgroundColor: "{colors.branco}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.campo}"
    padding: "12px 14px"
    height: "50px"
  chip:
    backgroundColor: "{colors.branco}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.pilula}"
    padding: "0 14px"
    height: "40px"
  chip-selecionado:
    backgroundColor: "{colors.vermelho}"
    textColor: "{colors.marfim}"
  passo-numero:
    backgroundColor: "{colors.marfim}"
    textColor: "{colors.vermelho}"
    rounded: "{rounded.circulo}"
    size: "76px"
  zap-flutuante:
    backgroundColor: "{colors.verde-zap}"
    textColor: "{colors.branco}"
    rounded: "{rounded.circulo}"
    size: "60px"
---

# Design System: Festolândia Premium Natal Encantado

## Overview

**Creative North Star: "O Palco de Veludo"**

A página é uma noite de teatro de Natal. Abre com a cortina de veludo bordô em tela cheia, neve caindo e o Papai Noel Imperial de lanterna acesa, e fecha na mesma cortina, mais escura, no orçamento. No meio, o palco acende e apaga: fundos marfim e creme para ler, bordô e verde pinheiro para os momentos de luz baixa, sempre com uma luz de palco (gradiente radial dourado ou marfim) pousando no alto da seção. Quem segura a cena é o elenco real em foto. Não há ilustração, clip-art nem ícone no lugar de pessoa.

A densidade é de landing page de venda: seções altas com respiro (72 a 120 px de padding vertical), um cabeçalho centrado por seção e um único gesto de composição em cada uma (bento de fotos, faixa de cartões, lista em duas colunas, linha de passos, faixa contínua de fotos). O dourado é enfeite e botão, não texto no claro. O vermelho é a voz do destaque no claro. A estrelinha de quatro pontas da logo é a assinatura, usada com parcimônia.

Divergência registrada: o comentário de `05-encanto.css` chama o encanto de "a única seção escura no meio", mas a galeria também é escura (bordô). O build vale: há duas pausas escuras no meio, uma verde e uma bordô.

**Key Characteristics:**
- Palco que abre e fecha na mesma cortina bordô (hero e orçamento usam a mesma foto de fundo).
- Fundos alternando claro e escuro, com luz de palco em gradiente radial no topo das seções.
- Títulos em Lilita One caixa alta com uma palavra de destaque; texto em Montserrat.
- Botão em pílula dourada com texto tinta; cartões de 22 px com foto real.
- Movimento de cena: neve, bolas balançando, lanterna piscando como chama, tudo só em `transform` e `opacity`.

## Colors

Paleta de Natal de teatro: dois bordôs de veludo e um verde pinheiro para o escuro, marfim e creme para o claro, dourado de enfeite e um vermelho de destaque. Contrastes abaixo medidos em 2026-10-17 a partir dos hex.

### Primary
- **Dourado de Enfeite** (dourado): o botão principal chapado (sempre com texto tinta, 8,49:1), ícones e destaque de título no escuro (8,46:1 no bordô, 6,29:1 no verde, 9,27:1 no bordô de fundo), estrelas da nota, fio das bolas. No claro, como texto, reprova (1,90:1 no marfim).
- **Dourado Aceso** (dourado-hover): o hover do botão dourado.
- **Dourado de Luz** (dourado-claro): brilhos (estrelinhas) e anel de foco no escuro.
- **Ouro Velho** (dourado-escuro): o filete com a estrelinha nos cabeçalhos claros. Decorativo e `aria-hidden` (2,90:1 no marfim), nunca texto.

### Secondary
- **Vermelho Natal** (vermelho): o destaque de título no claro (6,46:1 no marfim, 5,75:1 no creme), ícones das provas, número dos passos, contorno do botão "Quero este", chip selecionado, foco e erro de formulário, seleção de texto. Marfim sobre vermelho dá 6,46:1.
- **Vermelho Vivo** (vermelho-vivo): só o hover do sinal de mais aberto no FAQ.

### Tertiary
- **Verde Pinheiro** (verde): o fundo da seção do encanto. Marfim nele dá 11,95:1; texto-claro, 8,93:1.
- **Verde do WhatsApp escuro** (verde-zap): só o botão flutuante do WhatsApp, com ícone branco (5,02:1).

### Neutral
- **Veludo Bordô** (bordo): títulos no claro (16,08:1 no marfim, 14,30:1 no creme), fundo dos cartões de serviço, do selo da nota e do topo da galeria, nome dos personagens.
- **Bordô de Coxia** (bordo-fundo): fundo do hero, do orçamento, do `html`, do menu do celular e do topo rolado (a 96%). Base dos véus em `rgb(34 5 10 / ...)` sobre as fotos.
- **Bordô de Rodapé** (bordo-rodape): só o rodapé, o tom mais fundo da página.
- **Bordô de Cortina Clara** (bordo-claro): fundo de espera das fotos da galeria e barra de rolagem.
- **Marfim de Neve** (marfim): fundo claro principal, cartão de provas, item do FAQ fechado, cartão do formulário, título no escuro.
- **Creme** (creme): o segundo fundo claro, alternando com o marfim; fundo de espera das fotos do elenco.
- **Branco** (branco): o cartão que precisa saltar do marfim (personagem, avaliação, FAQ aberto, campo, chip).
- **Tinta** (tinta): texto do botão dourado, das avaliações e dos campos (17,02:1 no branco).
- **Texto** (texto): texto corrido no claro (8,88:1 no marfim, 7,90:1 no creme, 9,37:1 no branco).
- **Texto Claro** (texto-claro): texto corrido no escuro (12,43:1 no bordô de fundo, 8,93:1 no verde).
- **Fio** (fio) e **Fio Escuro** (fio-escuro): divisórias e bordas de cartão no claro e no escuro. **Fio de Campo** (fio-campo): borda de campo e chip.

### Named Rules
**A Regra do Dourado Calado.** Dourado nunca é texto em fundo claro (1,90:1). No claro, o destaque é o vermelho; o dourado entra como preenchimento de botão com texto tinta, como filete decorativo ou como ícone e texto no escuro.

**A Regra da Troca de Papéis.** Seção escura não pinta cor por cor: a classe de seção escura troca os papéis (`--cor-titulo` vira marfim, `--cor-texto` vira texto-claro, `--cor-destaque` e `--cor-icone` viram dourado, `--cor-foco` vira dourado-claro) e o cabeçalho, o apoio e o foco seguem sozinhos.

**A Regra do Verde Que Passa.** O `#25D366` com ícone branco dá 1,98:1 e reprova. O botão flutuante usa o verde-zap.

## Typography

**Display Font:** Lilita One (com fallback métrico sobre Arial Black, `size-adjust` 76,47%)
**Body Font:** Montserrat variável 400 a 800 (com fallback métrico sobre Arial, `size-adjust` 110,83%)

**Character:** Lilita One em caixa alta é o letreiro do teatro, gordo e festivo sem cair no infantil; Montserrat é a voz clara da bilheteria. As duas são servidas pelo próprio site em woff2, com `preload` e `font-display: swap`.

### Hierarchy
- **Display** (400, `clamp(44px, 2.6vw + 24px, 66px)`, 0,96): só o h1 do hero, em três linhas soltas, caixa alta, marfim com a última linha em dourado e sombra de texto suave. Linha sem quebra a partir de 1024 px; no celular, `min(10.6vw, 64px)` com entrelinha 0,98.
- **Headline** (400, `clamp(34px, 2.4vw + 18px, 60px)`, 1,02): título de seção, caixa alta, `text-wrap: balance`. O do orçamento cresce para `clamp(36px, 2.6vw + 18px, 64px)`.
- **Numeral** (400, `clamp(84px, 5vw + 30px, 124px)`, 0,9): o 4,8 do selo do Google (76 px no celular).
- **Title** (400, `clamp(21px, .5vw + 16px, 26px)`, 1,05): nome de serviço, de personagem (22 px), número das provas (20 a 25 px, `tabular-nums`), número dos passos (34 px) e links do menu do celular (30 px). Sempre Lilita caixa alta. O cartão grande e a faixa do espetáculo sobem para 30 a 42 px e 28 a 40 px.
- **Subtitle** (Montserrat 700, 17 a 18 px, 1,3): h3 do encanto e dos passos, pergunta do FAQ (16 px). Caixa normal.
- **Body lead** (400, `clamp(15.5px, .25vw + 14.5px, 18px)`, 1,65): o apoio sob o título, até 40em, `text-wrap: pretty`. O subtítulo do hero é a versão 500, `clamp(16px, .35vw + 14.6px, 19px)`, até 33em.
- **Body** (400, 16 px, 1,65): texto base.
- **Body sm** (400 a 500, 14 a 15,5 px, 1,5 a 1,6): linha de cartão, resposta do FAQ, texto da avaliação (15,5 px, 500).
- **Label** (700): botão 15,5 px com `.01em` (14 px no pequeno), rótulo de campo 13,5 px, link do topo 600 a 14,5 px, título de coluna do rodapé 13 px caixa alta com `.12em`.

### Named Rules
**A Regra da Palavra Acesa.** Todo título de seção tem uma palavra ou trecho de destaque, e só um: vermelho no claro, dourado no escuro. Ex.: "Onde o Natal *acontece*", "Uma *só*".

**A Regra do Letreiro.** Lilita One só em caixa alta e só em peso 400. Nada de Lilita em parágrafo, rótulo ou botão; botão é Montserrat 700.

## Layout

Container de 1240 px com margem lateral `clamp(16px, 4.4vw, 96px)`; padding vertical de seção `clamp(72px, 7vw, 120px)`. Topo fixo de 78 px (64 px abaixo de 1024), descontado pelo `scroll-padding-top`. Cabeçalho de seção centrado (gap 14 px, margem de baixo `clamp(36px, 4vw, 56px)`); no encanto ele vai à esquerda. Gaps de grade: 18 px nos cartões de serviço, galeria e avaliações, 24 px no elenco, 28 px nos passos.

**Ordem e fundo das seções:**
1. Hero: bordô de coxia com a cortina em foto, véu à esquerda e no pé, neve, bolas da logo (escuro).
2. Provas: cartão marfim que sobe 78 px (64 no celular) por cima do pé do hero, sobre faixa creme.
3. Onde o Natal acontece: creme.
4. Elenco: marfim com foco de luz dourado e marfim descendo do alto.
5. Encanto: verde pinheiro com brilho dourado no canto e vermelho no canto oposto (escuro).
6. Como funciona: marfim.
7. Galeria: bordô em degradê até o bordô de coxia, luz dourada no alto (escuro).
8. Depoimentos: marfim.
9. Dúvidas: creme.
10. Orçamento: a cortina do hero de novo, a 55% sob véu de bordô de coxia, com neve (escuro).
11. Rodapé: bordô de rodapé com fio dourado no topo.

**Pontos de quebra observados:** 360 e 400 px (ajuste fino do topo), abaixo de 640 px (celular), 768 px (troca da foto de fundo do hero), abaixo de 1024 px (tablet e celular, uma coluna), abaixo de 1100 px (menu vira tela cheia), abaixo de 1280 px (alturas de `content-visibility`) e acima de 1920 px (raiz escala com a tela).

**Responsivo, regras fixas:**
- **Hero no celular e tablet (abaixo de 1024 px):** título, Papai Noel, subtítulo, botões. Os filhos ficam soltos na grade do hero e o `grid-template-areas` troca de `'titulo noel' / 'sub noel' / 'botoes noel'` para `'titulo' 'noel' 'sub' 'botoes'`, centrado. Abaixo de 640 px os botões ocupam a largura toda e as bolas somem. No computador, texto à esquerda (1,16fr) e o Papai Noel encostado no pé à direita (0,84fr, até 660 px).
- **Serviços:** bento de 6 colunas no computador (visita de Natal em 4 colunas por 2 linhas, dois cartões empilhados ao lado, dois deitados de 3 colunas, faixa do espetáculo na largura toda com painel bordô à esquerda); 2 colunas no tablet; 1 coluna no celular, com a faixa virando foto 3:2 em cima e texto embaixo.
- **Elenco:** 4 em cima e 3 centrados embaixo no computador; abaixo de 1024 px vira faixa de arrastar com `scroll-snap` e `scroll-padding-inline` na margem (sem isso o trilho rola 2 px sozinho e o Chrome para de medir o LCP).
- **Encanto:** foto 4:5 e lista em 2 colunas; abaixo de 1024 px, foto 5:4 em cima; abaixo de 640 px, lista em 1 coluna.
- **Passos:** 4 numa linha com fio pontilhado horizontal; abaixo de 1024 px, coluna com o fio na vertical à esquerda.
- **Depoimentos:** selo da nota à esquerda e 2 x 2 avaliações; empilha abaixo de 1024 px, avaliações em 1 coluna abaixo de 640 px.
- **Dúvidas:** 2 colunas; 1 coluna de até 720 px abaixo de 1024 px.
- **Orçamento:** texto e formulário lado a lado, com a coluna do texto `sticky` no computador e a foto em moldura só no computador.
- **Rodapé:** 4 colunas, 2 no tablet, 1 no celular.
- **Tela larga:** o build converte todo `px` do CSS em `rem` (16 px = 1 rem) e, acima de 1920 px, a raiz vale `.83333vw`. A página inteira escala junto; nunca usar a propriedade `zoom`.

## Elevation & Depth

Profundidade de palco: luz e sombra quentes, sem cinza. As sombras são sempre tingidas de bordô (`rgb(42 6 12)` ou `rgb(34 5 10)`), com espalhamento negativo forte, então ficam como uma poça de sombra embaixo do cartão, não um contorno. No escuro, a sombra vira preto. A outra metade da profundidade é luz: gradientes radiais dourados ou marfim no alto das seções, o halo da lanterna no hero e véus de bordô em degradê sobre as fotos de fundo. Não há `backdrop-filter`: o topo rolado é bordô a 96% chapado.

### Shadow Vocabulary
- **Botão dourado** (`box-shadow: 0 12px 24px -14px rgb(34 5 10 / .55)`, hover `0 18px 30px -14px rgb(34 5 10 / .7)`): só o botão principal.
- **Cartão claro** (`box-shadow: 0 1px 2px rgb(42 6 12 / .05), 0 24px 44px -32px rgb(42 6 12 / .5)`): personagem; avaliação usa `0 20px 40px -32px rgb(42 6 12 / .45)`.
- **Cartão bordô** (`box-shadow: 0 22px 44px -30px rgb(42 6 12 / .7)`, hover `0 32px 54px -30px rgb(42 6 12 / .85)`): serviços; o selo da nota usa `0 30px 60px -36px rgb(42 6 12 / .8)`.
- **Faixa de provas** (`box-shadow: 0 30px 60px -34px rgb(42 6 12 / .55), 0 2px 0 rgb(255 255 255 / .8) inset`): o cartão que sobe sobre o hero, com um fio de luz por dentro.
- **Foto no escuro** (`box-shadow: 0 40px 70px -40px rgb(0 0 0 / .8)`): foto do encanto, foto do orçamento, galeria (`0 24px 40px -26px rgb(0 0 0 / .8)`) e o cartão do formulário (`0 40px 80px -40px rgb(0 0 0 / .85)`).
- **Anel** (`box-shadow: 0 0 0 8px #FFF8EE`): o número do passo recorta o fio pontilhado atrás dele; o botão flutuante usa anel marfim de 4 px.

### Named Rules
**A Regra da Sombra Quente.** Sombra no claro é sempre bordô com espalhamento negativo; nunca `rgb(0 0 0)` sobre marfim ou creme.

**A Regra da Luz de Palco.** Seção escura ganha luz por gradiente radial dourado (12% a 22%) num canto ou no alto; seção clara, quando ganha luz, é o foco marfim do elenco. Luz é fundo, nunca camada animada.

## Shapes

Cantos generosos e um único raio de cartão. Cartão e foto solta: 22 px. Cartão grande que emoldura (formulário) e as molduras deslocadas: 26 px, o raio do cartão mais 4. Item do FAQ: 18 px. Caixa de ícone do encanto: 16 px. Foto dentro de cartão: 14 px, para o raio de dentro acompanhar o de fora com o padding de 10 px. Campo: 12 px. Botão, chip, botão de pausa e link de pular: pílula (999 px). Ícone de prova, número de passo, inicial do avaliador, sinal do FAQ e WhatsApp flutuante: círculo.

Bordas são fios de 1 px (fio no claro, dourado a 45% a 50% nos cartões que pedem enfeite, fio-escuro no escuro) e 1,5 px nos campos e chips. A **moldura deslocada** é a assinatura de foto em destaque: um contorno dourado de 1,5 px a 55% ou 60%, deslocado 18 px para baixo e para a direita (14 px no orçamento, 10 a 12 px no celular), atrás da foto. Aparece no encanto e no orçamento. As fotos de pessoa ficam em retrato 3:4 (elenco) ou 4:5 (encanto); as da galeria mantêm a proporção própria, com altura fixa da faixa e as ímpares descidas 14 px.

## Components

### Buttons
Pílulas táteis que sobem no hover e afundam no clique.
- **Shape:** pílula (999 px), borda de 2 px transparente para todas as variantes terem a mesma caixa.
- **Primary (dourado):** dourado com texto tinta, 54 px de altura e 28 px de lado, Montserrat 700 15,5 px, ícone do WhatsApp de 20 px à esquerda. É o "Reservar meu Natal" e o "Pedir orçamento".
- **Contorno claro:** para o escuro (hero). Borda marfim a 75%, fundo bordô a 28%, texto marfim. Hover: borda marfim cheia, fundo marfim a 10%.
- **Contorno vermelho:** para o claro (cartão de personagem, "Quero este"). Borda e texto vermelhos, fundo transparente; hover preenche de vermelho com texto marfim.
- **Pequeno:** 44 px, 18 px de lado, 14 px, ícone de 18 px. No topo do celular cai para 40 px e 13 px, sem ícone.
- **Hover / Focus / Active:** hover sobe 2 px em `.4s` com o easing de saída (só com `hover: hover`); o dourado acende para o dourado-hover e a sombra cresce. Clique: `scale(.97)` em `.1s`. Foco: contorno de 2 px na cor de foco do contexto, 3 px de distância.

### Cabeçalho de seção
- **Estrutura:** filete (opcional), título headline, apoio body lead, centrados.
- **Filete:** a estrelinha de quatro pontas da logo (20 px, Phosphor sparkle fill) entre dois fios de 1,5 px em degradê que somem nas pontas (`clamp(36px, 5vw, 64px)` cada). Dourado no escuro, ouro velho no claro.
- **Uso:** só em quatro títulos: Onde o Natal acontece, Encanto, Galeria e Orçamento. Elenco, Passos, Depoimentos e Dúvidas não têm filete.

### Faixa de provas
Cartão marfim de 22 px com fio dourado a 45%, quatro provas separadas por fio vertical. Cada prova: círculo de 54 px em degradê creme com ícone vermelho de 28 px, número em Lilita bordô e rótulo de 13,5 px. Vira 2 x 2 no tablet e, no celular, ícone em cima do texto.

### Bento de serviços
Cartões bordô de 22 px com foto real cobrindo o cartão e véu de bordô subindo do pé (transparente até 30%, 94% no fim); texto marfim pousado embaixo: nome em Lilita, linha de 14 px a 86%, botão dourado pequeno. Linhas de `minmax(286px, 21vw)`. O cartão grande tem 34 px de padding e título de 30 a 42 px. A faixa do espetáculo põe a foto a partir de 42% da largura e um painel bordô com luz dourada no canto à esquerda, título em dourado. Hover: cartão sobe 5 px e a foto aproxima para 1,06 em `1.1s`.

### Cartões do elenco
Programa de teatro: cartão branco de 22 px com fio dourado a 50% e 10 px de passe-partout em volta da foto 3:4 (raio de 14 px, fundo creme até carregar). Nome Lilita bordô de 22 px, linha de 14 px, botão contorno vermelho pequeno no pé (a linha cresce e empurra o botão para baixo, alinhando os botões). Hover: sobe 6 px e inclina 1,6 grau, alternando o lado entre pares e ímpares, a borda vira dourado cheio e a foto aproxima para 1,07.

### Lista do encanto
Seis motivos em duas colunas, sem caixa em volta: caixa de ícone de 52 px (raio de 16 px, fio dourado a 38%, fundo marfim a 5%, ícone dourado de 28 px) ocupando duas linhas, título Montserrat 700 de 17 px em marfim e texto de 14,5 px a 78%. Ao lado, a foto do figurino com moldura deslocada e brilhos.

### Passos
Quatro círculos de 76 px (60 px no celular) com borda dourada de 2 px, fundo marfim, número Lilita vermelho de 34 px e anel marfim de 8 px que recorta o fio. O fio é um pontilhado dourado de 10 px com 8 px de vão, de centro a centro, desenhado com `scaleX` (ou `scaleY` no celular) em `1.6s` quando a lista entra.

### Galeria
Faixa contínua de fotos de altura `clamp(260px, 22vw + 60px, 400px)`, raio de 22 px, ímpares descidas 14 px. A lista vai duas vezes no HTML e o trilho anda `-50%` em `translate3d`, 70 s por volta, linear. Pausa no hover, no botão de pausa (pílula de contorno marfim a 30%, ícone dourado, `aria-pressed`) e fora da tela. Com movimento reduzido ou sem JS: para, a cópia some e vira rolagem lateral com `scroll-snap`.

### Avaliações
- **Selo da nota:** cartão bordô de 22 px com luz dourada no alto, 4,8 em numeral marfim, cinco estrelas douradas de 26 px e uma linha de 15 px. No tablet fica em linha, número à esquerda.
- **Cartão de avaliação:** branco, 22 px, fio claro, aspas douradas de 34 px, texto tinta 500 de 15,5 px, pé com fio, inicial em círculo vermelho de 42 px (Lilita marfim), nome bordô e origem de 13 px.

### Acordeão de dúvidas
Item marfim de 18 px com fio claro; pergunta Montserrat 700 bordô de 16 px, mínimo de 64 px de altura; sinal de mais num círculo creme de 32 px com traços vermelhos. Aberto: fundo branco, fio dourado a 70%, sombra de cartão, o círculo vira vermelho com traços marfim e gira 180 graus enquanto o traço vertical deita, formando o menos. A resposta abre pela grade (`grid-template-rows` de 0fr para 1fr em `.5s`), sem medir altura em JS. Fechada, a resposta fica inerte; sem JS, tudo aberto.

### Formulário com chips
- **Cartão:** marfim, raio de 26 px, fio dourado a 55%, sombra de foto no escuro, tema claro forçado dentro da seção escura. Título Lilita bordô de 30 px.
- **Campo:** branco, borda de 1,5 px fio-campo, raio de 12 px, 50 px de altura, texto tinta 500 de 15,5 px. Rótulo sempre em cima (bordô 700 de 13,5 px), "opcional" em texto 500. Placeholder `#8A6E62` (4,68:1 no branco). Select com seta vermelha em SVG embutido.
- **Focus:** borda vermelha e halo `0 0 0 4px rgb(179 23 47 / .14)`, sem contorno.
- **Erro:** borda vermelha, fundo `#FFF4F4`, mensagem vermelha 600 de 13 px embaixo do campo, ligada por `aria-describedby` e `aria-live`. Nunca só o placeholder.
- **Chips:** pílulas brancas de 40 px com a mesma borda do campo, texto tinta 600 de 13,5 px. Selecionado: vermelho com texto marfim. Hover: borda vermelha. Clique: `scale(.96)`. O input real fica por cima, invisível, e o foco desenha o contorno vermelho no chip.
- **Envio e sucesso:** botão dourado na largura toda; carregando, opacidade 75% e `aria-busy`; sucesso numa caixa `#EAF6EE` com texto `#14532D` (8,21:1).

### Navigation
- **Topo:** transparente sobre o hero, com degradê de bordô a 72% para garantir leitura; ao sair do começo da página vira bordô de coxia a 96% com fio dourado de 1 px e sombra. Logo de 196 px (136 no celular, 118 abaixo de 360), que gira 2 graus no hover.
- **Links:** Montserrat 600 de 14,5 px, marfim a 88%; hover leva ao marfim e desenha um sublinhado dourado de 2 px da esquerda (`scaleX` em `.45s`).
- **Celular (abaixo de 1100 px):** botão de três traços que vira X; menu em tela cheia no bordô de coxia com luz dourada no canto, links em Lilita caixa alta de 30 px separados por fio-escuro, entrando um a um (45 ms de intervalo).

### WhatsApp flutuante
Círculo verde-zap de 60 px com ícone branco de 32 px e anel marfim de 4 px. Aparece só depois que os botões do hero saem da tela e some de novo no orçamento e no rodapé (`translateY(16px) scale(.7)` com opacidade zero).

### Movimento
- **Easings:** saída `cubic-bezier(.16, 1, .3, 1)` para entradas de hero e estados; suave `cubic-bezier(.22, .9, .24, 1)` para a revelação no scroll; vai e volta `cubic-bezier(.65, 0, .35, 1)` para balanço e fio dos passos.
- **Revelação no scroll:** sobe 28 px com opacidade em `.95s`, 90 ms de intervalo entre irmãos; listas sobem 36 px com leve giro e `scale(.96)` em `.9s`, 80 ms de intervalo; variantes aparece (`1s`), cresce (`scale(.82)`, `1s`) e lateral (36 px, `1s`). Keyframes com `fill: backwards`, então o elemento volta ao estilo normal e o hover não fica preso. Disparo por IntersectionObserver com limiar de 12%.
- **Abertura do hero:** cortina assenta de `scale(1.07)` em `2.6s`; linhas do título sobem 42% com opacidade, `.95s`, a partir de `.12s` com `.11s` entre elas; Papai Noel sobe 46 px com `scale(.97)` em `1.25s` a partir de `.22s`; halo da lanterna acende em `1.4s` a `.9s` e depois pisca como chama (3,4 s, em loop); subtítulo a `.5s`, botões a `.62s`; bolas descem a `.5s` em `1.6s`; faixa de provas a `.7s`.
- **Loops:** neve em duas camadas (11 s e 16 s, linear, ladrilho de 260 e 420 px, `translate3d`), bolas balançando 3,2 graus (3,6 e 4,4 s), estrelinhas piscando (3,2 s), galeria (70 s).
- **Movimento reduzido:** nada fica escondido (o esconder só existe dentro de `prefers-reduced-motion: no-preference` e com JS), animações e transições caem para `.01ms`, a rolagem suave desliga, neve, bolas, brilhos e chama param, e a galeria vira rolagem lateral.

## Do's and Don'ts

### Do:
- **Do** usar o botão dourado com texto tinta (8,49:1) para toda ação de reserva, e o contorno vermelho para a ação secundária no claro.
- **Do** dar a cada título de seção exatamente uma palavra de destaque: vermelho no claro, dourado no escuro.
- **Do** manter o raio de 22 px em todo cartão e foto solta, 14 px na foto dentro de cartão, 12 px no campo e pílula no botão e no chip.
- **Do** alternar marfim e creme no claro e reservar o escuro para bordô de veludo e verde pinheiro, sempre com luz de palco em gradiente radial.
- **Do** manter o Papai Noel e a cortina do hero visíveis desde o primeiro quadro: eles entram só por `transform` (`noel-chega` e `fundo-assenta`), nunca por opacidade. São o LCP; imagem com opacidade zero não conta como pintada e o LCP espera a animação.
- **Do** animar só `transform` e `opacity` em entradas e loops (a neve anda em `translate3d`, o fio dos passos em `scaleX` e `scaleY`), e esconder elemento parado só com opacidade.
- **Do** manter no `99-desempenho.css` o `content-visibility: auto` nas seções abaixo do hero com `contain-intrinsic-size` medido pelo `scripts/alturas.mjs` em 1440, 1100, 800 e 390. A altura é só do conteúdo, sem o padding da seção. Mudou muito o tamanho de uma seção, medir de novo.
- **Do** montar o formulário a partir do `<template>` quando a seção chega a 900 px da tela (ou no clique em `#orcamento`), guardando a altura do lugar com `--reserva` (640 px, 900 px no celular).
- **Do** marcar imagem decorativa do hero com `data-adiar` (as bolas): ela só baixa depois do LCP e do carregamento, com limite de 1,5 s, e entra com fade de `.6s`.
- **Do** escrever CSS em `px` e deixar o build converter em `rem`; acima de 1920 px a raiz escala a página inteira.
- **Do** dar à seção logo abaixo do hero, no celular, `content-visibility: hidden` até a primeira pintura (classe `js-abrindo` no `<head>`, que sai na primeira pintura ou em 2,5 s).

### Don't:
- **Don't** usar dourado como texto em fundo claro (1,90:1 no marfim) nem o ouro velho como texto (2,90:1).
- **Don't** usar o `#25D366` com branco no botão do WhatsApp (1,98:1).
- **Don't** pôr o filete com a estrelinha em todo título: ele fica nos quatro cabeçalhos onde está (serviços, encanto, galeria, orçamento). A raridade é o que faz dele assinatura.
- **Don't** fazer grade de cartões só com ícone: serviço e personagem levam foto real.
- **Don't** trazer balão, confete ou cor saturada de festa infantil para a paleta (PRODUCT.md).
- **Don't** aplicar `backdrop-filter` no topo ou em superfície de fundo liso; o topo rolado é bordô chapado a 96%.
- **Don't** esconder elemento parado com `clip-path` antes da revelação: o IntersectionObserver não dispara.
- **Don't** usar a propriedade `zoom` para tela larga; a escala vem da raiz em `rem`.
- **Don't** colocar sombra preta sobre fundo claro; sombra no claro é bordô com espalhamento negativo.
- **Don't** usar Lilita One fora da caixa alta ou em texto corrido.
