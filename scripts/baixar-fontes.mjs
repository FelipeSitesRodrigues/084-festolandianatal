/**
 * Baixa as fontes do Google Fonts e grava no próprio site (src/assets/fonts), com o
 * @font-face em src/css/_fontes.css (base do 080).
 *
 * Fontes escolhidas pelo Felipe em 2026-10-17 (rodada 2 do mockup):
 * - 'Lilita One' 400: títulos, números e o "4,8". É a mais próxima, no Google Fonts, da
 *   referência "BRAVE TREAT" que ele mandou (display pesada, condensada, canto macio).
 * - 'Montserrat' variável, peso de 400 a 800: texto, botões, menu, rótulos e formulário.
 * - Fallbacks com size-adjust medidos contra a fonte real (Arial Black pros títulos, Arial
 *   pro texto): enquanto a fonte chega, a linha não quebra diferente (CLS).
 *
 * Uso: node scripts/baixar-fontes.mjs   (ou npm run fontes)
 */
import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'node:fs'
import subsetFont from 'subset-font'
import opentype from 'opentype.js'

const CACHE = 'scripts/.cache'
mkdirSync('src/assets/fonts', { recursive: true })
mkdirSync(CACHE, { recursive: true })

// letras do site: ASCII, Latin-1 (acentos do português) e a pontuação tipográfica usada
let LETRAS = ''
for (let c = 0x20; c <= 0x7e; c++) LETRAS += String.fromCharCode(c)
for (let c = 0xa0; c <= 0xff; c++) LETRAS += String.fromCharCode(c)
LETRAS += '‘’“”•…·→©ªº'

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'

async function baixar(familia, arq, { navegador = false } = {}) {
  const destino = `${CACHE}/${arq}`
  if (existsSync(destino)) return readFileSync(destino)
  const css = await (await fetch(`https://fonts.googleapis.com/css2?family=${familia}`, navegador ? { headers: { 'User-Agent': UA } } : {})).text()
  const bloco = navegador ? [...css.matchAll(/\/\*\s*([\w-]+)\s*\*\/\s*@font-face\s*{([^}]*)}/g)].find(([, sub]) => sub === 'latin')?.[2] : css
  const url = bloco?.match(/url\((https:[^)]+)\)/)?.[1]
  if (!url) throw new Error(`sem url de fonte para ${familia}:\n${css.slice(0, 300)}`)
  const buf = Buffer.from(await (await fetch(url)).arrayBuffer())
  writeFileSync(destino, buf)
  console.log('baixada', arq, Math.round(buf.length / 1024) + ' KB')
  return buf
}

const kb = (b) => (b.length / 1024).toFixed(1) + ' KB'
const ab = (buf) => buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength)

const AMOSTRA_TITULO = 'O PAPAI NOEL EM QUEM A CRIANÇA ACREDITA. ONDE O NATAL ACONTECE. CONHEÇA O ELENCO. DO PEDIDO À NOITE DE NATAL.'
const AMOSTRA_TEXTO = 'Papai Noel, Mamãe Noel, duendes músicos e o espetáculo do Quebra-Nozes para o seu Natal em casa, no condomínio, na empresa ou no shopping, em São Paulo.'
const largura = (fonte, texto) => fonte.getAdvanceWidth(texto, fonte.unitsPerEm) / fonte.unitsPerEm

function fallback(nome, fonte, local, arqLocal, amostra) {
  const ref = opentype.parse(ab(readFileSync(arqLocal)))
  const ajuste = largura(fonte, amostra) / largura(ref, amostra)
  const upm = fonte.unitsPerEm
  const hhea = fonte.tables.hhea
  const pct = (v) => (v * 100).toFixed(2) + '%'
  return `@font-face {
  font-family: '${nome}';
  src: ${local.map((l) => `local('${l}')`).join(', ')};
  size-adjust: ${pct(ajuste)};
  ascent-override: ${pct(hhea.ascender / upm / ajuste)};
  descent-override: ${pct(Math.abs(hhea.descender) / upm / ajuste)};
  line-gap-override: ${pct((hhea.lineGap || 0) / upm / ajuste)};
}`
}

async function variavel(buf, eixos) {
  try {
    return await subsetFont(buf, LETRAS, { targetFormat: 'woff2', variationAxes: eixos })
  } catch (e) {
    console.log('aviso: subset-font não limitou os eixos, vai a variável inteira:', e.message)
    return subsetFont(buf, LETRAS, { targetFormat: 'woff2' })
  }
}

const saida = ['/* Gerado por scripts/baixar-fontes.mjs. Não editar à mão. */']

// ---------------------------------------------------------------- Lilita One (títulos)
const lilita = await baixar('Lilita+One', 'lilita-latin.woff2', { navegador: true })
const lilitaWoff2 = await subsetFont(lilita, LETRAS, { targetFormat: 'woff2' })
writeFileSync('src/assets/fonts/lilita-one.woff2', lilitaWoff2)
console.log('ok lilita-one.woff2', kb(lilitaWoff2))
saida.push(`@font-face {
  font-family: 'Lilita One';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('/assets/fonts/lilita-one.woff2') format('woff2');
}`)
const lilitaTtf = opentype.parse(ab(await baixar('Lilita+One', 'lilita-one.ttf')))
saida.push(fallback('Lilita fallback', lilitaTtf, ['Arial Black', 'Arial-BoldMT', 'Arial'], 'C:/Windows/Fonts/ariblk.ttf', AMOSTRA_TITULO))

// ---------------------------------------------------------------- Montserrat variável 400 a 800 (texto e botões)
const montserrat = await baixar('Montserrat:wght@400..800', 'montserrat-var-latin.woff2', { navegador: true })
const montserratWoff2 = await variavel(montserrat, { wght: { min: 400, max: 800, default: 400 } })
writeFileSync('src/assets/fonts/montserrat-var.woff2', montserratWoff2)
console.log('ok montserrat-var.woff2', kb(montserratWoff2))
saida.push(`@font-face {
  font-family: 'Montserrat';
  font-style: normal;
  font-weight: 400 800;
  font-display: swap;
  src: url('/assets/fonts/montserrat-var.woff2') format('woff2');
}`)
const montserrat400 = opentype.parse(ab(await baixar('Montserrat:wght@400', 'montserrat-400.ttf')))
saida.push(fallback('Montserrat fallback', montserrat400, ['Arial', 'Helvetica', 'Roboto'], 'C:/Windows/Fonts/arial.ttf', AMOSTRA_TEXTO))

writeFileSync('src/css/_fontes.css', saida.join('\n') + '\n')
console.log('src/css/_fontes.css gravado')
