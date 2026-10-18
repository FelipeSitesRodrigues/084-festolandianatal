# 084 Festolândia Premium Natal Encantado: código do site

Página única, HTML, CSS e JS estático montado por `build.mjs` (base do 080), saída em `dist/`.
Nenhuma dependência em tempo de execução: o `package.json` só tem ferramenta de build.
A documentação do cliente (copy, mockup, memória) fica em `../084- festolandia premium natal encantado/`.

## Comandos

| Comando | O que faz |
|---|---|
| `npm run imagens` | gera todas as imagens a partir de `Recursos Site` (AVIF + WebP, várias larguras, `manifesto.json`) |
| `node scripts/og.mjs` | imagem de compartilhamento `og-natal.jpg` (rodar depois do `imagens`) |
| `npm run fontes` | baixa e corta Lilita One e Montserrat, grava `src/css/_fontes.css` |
| `npm run build` | monta `dist/index.html` e avisa travessão, alt, âncora, h1 e pendências |
| `npm run serve` | servidor local em http://localhost:3084 (ou `ABRIR-SITE.bat`) |
| `node scripts/print.mjs / --largura 390 --inteira --saida x.png` | print de revisão (com `--movimento` pra ver animação) |
| `node scripts/medir.mjs` | estouro horizontal, linhas do título e botão quebrado de 320 a 2560 |
| `node scripts/alturas.mjs` | alturas das seções pro `99-desempenho.css` (content-visibility) |
| `npm run lighthouse` | Lighthouse local, celular e computador |

## Onde mexer

- Textos de serviço, elenco, galeria, depoimentos e dúvidas: `src/dados/*.json`
- Telefone, e-mail, mensagens de WhatsApp, domínio e pendências: `site.config.json`
- Uma seção: `src/partials/NN-nome.html` + `src/css/NN-nome.css` (+ `src/js/NN-nome.js`)
- Fotos e recortes: a lista `FOTOS` em `scripts/processar-imagens.mjs`

## Origem das imagens

- `hero-fundo*`, `hero-noel*`: geradas no ChatGPT, no mesmo chat do mockup v2 (prompts em
  `../084- festolandia premium natal encantado/prompt-mockup.md`), a partir da foto real do
  Papai Noel Imperial (`WhatsApp Image 2026-10-15 at 16.40.24 (7).jpeg`)
- `logo*`, `bola-*`, favicons: logo gerada no ChatGPT (branca sobre preto) e pintada no
  `processar-imagens.mjs` (dourado, gorro vermelho, pelúcia marfim)
- `srv-*`, `el-*`, `dif-*`, `gal-*`: fotos reais do elenco da Festolândia, mandadas pela
  Sabrina no WhatsApp em 2026-10-15 (`Recursos Site/IMAGENS DE PERSONAGENS`), só recortadas
- `og-natal.jpg`: montagem do `scripts/og.mjs` com as imagens acima

## Antes de publicar

1. Preencher `dominio` no `site.config.json` (sai canonical, sitemap e og:image absoluto)
2. `npm run publicar` e conferir os avisos
3. Mudou o tamanho de uma seção: `node scripts/alturas.mjs` e atualizar o `99-desempenho.css`
4. PageSpeed no pagespeed.web.dev com o site no ar, celular e computador (meta: 95 ou mais)
