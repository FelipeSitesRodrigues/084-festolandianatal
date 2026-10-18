/**
 * Gera as imagens do site a partir de "../084- festolandia premium natal encantado/Recursos
 * Site", em src/assets/img, em AVIF e WebP e em várias larguras pra srcset. Grava
 * src/assets/img/manifesto.json com largura e altura de cada arquivo (base do 080).
 *
 * - Hero: o fundo da cortina (FUNDO HERO.png) e o Papai Noel Imperial recortado (PAPAI NOEL
 *   HERO.png), os dois gerados no mesmo chat do mockup. O PNG recortado pode guardar cor nos
 *   pixels transparentes (memória do 080): aqui ela é zerada antes de comprimir.
 * - Logo (LOGO.png): veio branca sobre preto, sem transparência. O brilho vira o alfa, a cor
 *   é pintada aqui: dourado na palavra, o cone do gorro em vermelho e a pelúcia e o pompom em
 *   marfim (componentes conexos dentro da caixa do gorro). Sai em duas versões: inteira
 *   (rodapé) e sem a linha "PREMIUM · NATAL ENCANTADO", que some no tamanho do topo.
 * - Bolinhas: as duas bolas de Natal penduradas da logo viram enfeite do hero.
 * - Favicons: o F com o gorro, sobre o bordô.
 * - Fotos reais do elenco (IMAGENS DE PERSONAGENS, fotos do WhatsApp de 2026-10-15): recorte
 *   por foto em FOTOS, abaixo (tira texto de story e marca d'água de terceiro).
 *
 * Uso: node scripts/processar-imagens.mjs   (ou npm run imagens)
 */
import sharp from 'sharp'
import { mkdirSync, writeFileSync, rmSync, readdirSync, existsSync } from 'node:fs'
import path from 'node:path'

const R = '../084- festolandia premium natal encantado/Recursos Site'
const OUT = 'src/assets/img'
const RAIZ = 'src/raiz'
const BORDO = { r: 59, g: 10, b: 18 } // #3B0A12

const foto = (n) => path.join(R, 'IMAGENS DE PERSONAGENS', `WhatsApp Image 2026-10-15 at 16.${n}.jpeg`)

mkdirSync(OUT, { recursive: true })
mkdirSync(RAIZ, { recursive: true })
for (const f of readdirSync(OUT)) if (!f.startsWith('og-')) rmSync(path.join(OUT, f), { recursive: true, force: true })
const manifesto = {}

async function gravar(pipeline, nome) {
  const info = await pipeline.toFile(path.join(OUT, nome))
  manifesto[nome] = { w: info.width, h: info.height, kb: Math.round(info.size / 1024) }
}

// uma imagem (arquivo ou buffer) em várias larguras, AVIF e WebP
async function variantes(origem, nome, larguras, { q = 74, alfa = false, avif = null } = {}) {
  const m = await sharp(origem).metadata()
  for (const w of larguras.filter((w, i, a) => w <= m.width || i === 0 || a[i - 1] < m.width)) {
    for (const f of ['avif', 'webp']) {
      let p = sharp(origem).resize({ width: Math.min(w, m.width), withoutEnlargement: true, kernel: 'lanczos3' })
      p =
        f === 'avif'
          ? p.avif(avif || { quality: Math.round(q - 22), effort: 7, chromaSubsampling: alfa ? '4:4:4' : '4:2:0' })
          : p.webp({ quality: q, effort: 6, smartSubsample: true, ...(alfa ? { alphaQuality: 90 } : {}) })
      await gravar(p, `${nome}-${Math.min(w, m.width)}.${f}`)
    }
  }
}

// recorte por fração da foto: [esquerda, topo, largura, altura], de 0 a 1
async function recorte(arq, [x, y, w, h]) {
  const m = await sharp(arq).metadata()
  const left = Math.round(x * m.width)
  const top = Math.round(y * m.height)
  return sharp(arq)
    .extract({ left, top, width: Math.min(m.width - left, Math.round(w * m.width)), height: Math.min(m.height - top, Math.round(h * m.height)) })
    .toBuffer()
}

// recorte na proporção pedida, centrado no foco (fx, fy de 0 a 1)
async function proporcao(buf, razao, fx = 0.5, fy = 0.5) {
  const m = await sharp(buf).metadata()
  let w = m.width
  let h = Math.round(w / razao)
  if (h > m.height) {
    h = m.height
    w = Math.round(h * razao)
  }
  const left = Math.max(0, Math.min(m.width - w, Math.round(fx * m.width - w / 2)))
  const top = Math.max(0, Math.min(m.height - h, Math.round(fy * m.height - h / 2)))
  return sharp(buf).extract({ left, top, width: w, height: h }).toBuffer()
}

async function rgba(origem) {
  const { data, info } = await sharp(origem).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  return { px: data, W: info.width, H: info.height }
}
const png = ({ px, W, H }) => sharp(px, { raw: { width: W, height: H, channels: 4 } }).png().toBuffer()

// ---------------------------------------------------------------- hero
const FUNDO = path.join(R, 'FUNDO HERO.png')
// fundo escuro e desfocado: AVIF leve (é o LCP do computador)
await variantes(FUNDO, 'hero-fundo', [960, 1440, 1832], { q: 62, avif: { quality: 34, effort: 8, chromaSubsampling: '4:2:0' } })
// celular: só a metade da direita (a árvore e o brilho), que é o que o cover mostra em pé
{
  const meio = await recorte(FUNDO, [0.46, 0, 0.54, 1])
  await variantes(meio, 'hero-fundo-cel', [480, 760, 990], { q: 58, avif: { quality: 30, effort: 8, chromaSubsampling: '4:2:0' } })
}
// Papai Noel recortado: zera a cor escondida nos pixels transparentes
{
  const img = await rgba(path.join(R, 'PAPAI NOEL HERO.png'))
  let escondidos = 0
  for (let i = 0; i < img.px.length; i += 4) {
    if (img.px[i + 3] === 0 && (img.px[i] || img.px[i + 1] || img.px[i + 2])) {
      img.px[i] = img.px[i + 1] = img.px[i + 2] = 0
      escondidos++
    }
  }
  console.log(`papai noel: ${escondidos} pixels transparentes com cor escondida zerados`)
  await variantes(await png(img), 'hero-noel', [420, 560, 640, 860, 1122], { q: 76, alfa: true, avif: { quality: 48, effort: 9, chromaSubsampling: '4:4:4' } })
}

// ---------------------------------------------------------------- logo
const DOURADO_ALTO = [244, 220, 150] // #F4DC96
const DOURADO = [217, 178, 92] // #D9B25C
const DOURADO_BAIXO = [184, 140, 62] // #B88C3E
const VERMELHO = [200, 32, 52] // #C82034
const MARFIM = [255, 247, 230] // #FFF7E6
{
  const { data, info } = await sharp(path.join(R, 'LOGO.png')).greyscale().raw().toBuffer({ resolveWithObject: true })
  const W = info.width
  const H = info.height
  // alfa pelo brilho, com o preto e o branco firmes (tira o chuvisco da compressão)
  const alfa = new Uint8Array(W * H)
  for (let i = 0; i < W * H; i++) alfa[i] = Math.max(0, Math.min(255, Math.round(((data[i] - 24) / (232 - 24)) * 255)))

  // componentes conexos dentro da caixa do gorro (cone, barra de pelúcia e pompom)
  const GORRO = { x0: 220, y0: 100, x1: 700, y1: 345 }
  const rotulo = new Int32Array(W * H).fill(-1)
  const comps = []
  for (let y = GORRO.y0; y < GORRO.y1; y++)
    for (let x = GORRO.x0; x < GORRO.x1; x++) {
      const i0 = y * W + x
      if (alfa[i0] < 128 || rotulo[i0] !== -1) continue
      const id = comps.length
      const fila = [i0]
      rotulo[i0] = id
      let n = 0
      let sx = 0
      let sy = 0
      let minY = H
      let maxY = 0
      let toca = false
      while (fila.length) {
        const i = fila.pop()
        const cx = i % W
        const cy = (i - cx) / W
        n++
        sx += cx
        sy += cy
        if (cy < minY) minY = cy
        if (cy > maxY) maxY = cy
        if (cy >= GORRO.y1 - 1 || cx <= GORRO.x0 || cx >= GORRO.x1 - 1) toca = true
        for (const j of [i - 1, i + 1, i - W, i + W]) {
          const jx = j % W
          const jy = (j - jx) / W
          if (jx < GORRO.x0 || jx >= GORRO.x1 || jy < GORRO.y0 || jy >= GORRO.y1) continue
          if (alfa[j] >= 128 && rotulo[j] === -1) {
            rotulo[j] = id
            fila.push(j)
          }
        }
      }
      comps.push({ id, n, cx: sx / n, cy: sy / n, minY, maxY, toca })
    }
  const grandes = comps.filter((c) => c.n > 800 && !c.toca).sort((a, b) => b.n - a.n)
  console.log('gorro, componentes:', grandes.map((c) => `#${c.id} ${c.n}px centro ${Math.round(c.cx)},${Math.round(c.cy)} y ${c.minY}-${c.maxY}`).join(' | '))
  // o cone é o que fica mais alto (menor minY); o resto (barra e pompom) é pelúcia
  const cone = [...grandes].sort((a, b) => a.minY - b.minY)[0]
  const pelucia = new Set(grandes.filter((c) => c !== cone).map((c) => c.id))

  // cor de cada pixel: dourado em degradê vertical, gorro em vermelho e marfim. A borda
  // anti-serrilhada do gorro herda a cor do vizinho firme mais perto (raio 3)
  const corDe = (x, y) => {
    for (let r = 0; r <= 3; r++)
      for (let dy = -r; dy <= r; dy++)
        for (let dx = -r; dx <= r; dx++) {
          const xx = x + dx
          const yy = y + dy
          if (xx < 0 || yy < 0 || xx >= W || yy >= H) continue
          const l = rotulo[yy * W + xx]
          // o pompom é a ponta do cone que cai à esquerda: marfim, como num gorro de verdade
          if (l === cone?.id) return xx < 336 && yy > 232 ? MARFIM : VERMELHO
          if (pelucia.has(l)) return MARFIM
        }
    return null
  }
  const TOPO = 107
  const BASE = 760
  const px = Buffer.alloc(W * H * 4)
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      const i = y * W + x
      const a = alfa[i]
      if (!a) continue
      let c = y >= GORRO.y0 - 4 && y <= GORRO.y1 + 4 && x >= GORRO.x0 - 4 && x <= GORRO.x1 + 4 ? corDe(x, y) : null
      if (!c) {
        const t = Math.max(0, Math.min(1, (y - TOPO) / (BASE - TOPO)))
        const [c0, c1, u] = t < 0.5 ? [DOURADO_ALTO, DOURADO, t / 0.5] : [DOURADO, DOURADO_BAIXO, (t - 0.5) / 0.5]
        c = c0.map((v, k) => Math.round(v + (c1[k] - v) * u))
      }
      px[i * 4] = c[0]
      px[i * 4 + 1] = c[1]
      px[i * 4 + 2] = c[2]
      px[i * 4 + 3] = a
    }
  const logo = await sharp(px, { raw: { width: W, height: H, channels: 4 } }).png().toBuffer()
  // inteira, aparada no conteúdo (rodapé)
  const inteira = await sharp(logo).extract({ left: 96, top: 96, width: 1590, height: 676 }).png().toBuffer()
  await variantes(inteira, 'logo', [300, 460, 640, 920], { q: 88, alfa: true, avif: { quality: 70, effort: 8, chromaSubsampling: '4:4:4' } })
  // topo: sem a linha de apoio (a faixa onde ela mora vira transparente)
  const semLinha = Buffer.from(px)
  for (let y = 680; y < 740; y++) for (let x = 450; x < 1320; x++) semLinha[(y * W + x) * 4 + 3] = 0
  const topo = await sharp(await sharp(semLinha, { raw: { width: W, height: H, channels: 4 } }).png().toBuffer())
    .extract({ left: 96, top: 96, width: 1590, height: 676 })
    .png()
    .toBuffer()
  await variantes(topo, 'logo-topo', [240, 360, 480], { q: 88, alfa: true, avif: { quality: 70, effort: 8, chromaSubsampling: '4:4:4' } })

  // as duas bolinhas penduradas (com o fio), pintadas: a listrada em dourado, a lisa em vermelho
  const bola = async (caixa, cor, nome) => {
    const { left, top, width, height } = caixa
    const b = Buffer.alloc(width * height * 4)
    for (let y = 0; y < height; y++)
      for (let x = 0; x < width; x++) {
        const a = alfa[(top + y) * W + left + x]
        const o = (y * width + x) * 4
        b[o] = cor[0]
        b[o + 1] = cor[1]
        b[o + 2] = cor[2]
        b[o + 3] = a
      }
    const buf = await sharp(b, { raw: { width, height, channels: 4 } }).png().toBuffer()
    await variantes(buf, nome, [120, 200], { q: 88, alfa: true, avif: { quality: 70, effort: 8, chromaSubsampling: '4:4:4' } })
  }
  await bola({ left: 1366, top: 566, width: 130, height: 196 }, DOURADO, 'bola-listrada')
  await bola({ left: 1516, top: 580, width: 78, height: 115 }, [214, 52, 70], 'bola-lisa')

  // favicons: o gorro, centrado num quadrado bordô (o F da logo é colado no "e" e não sai sozinho)
  const quadro = async (lado, arq, margem = 0.1) => {
    const miolo = Math.round(lado * (1 - margem * 2))
    const f = await sharp(logo).extract({ left: 228, top: 100, width: 380, height: 236 }).resize(miolo, miolo, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer()
    await sharp({ create: { width: lado, height: lado, channels: 4, background: { ...BORDO, alpha: 1 } } })
      .composite([{ input: f, gravity: 'center' }])
      .png()
      .toFile(path.join(RAIZ, arq))
  }
  await quadro(32, 'favicon-32.png', 0.04)
  await quadro(180, 'apple-touch-icon.png')
  await quadro(192, 'icon-192.png')
  await quadro(512, 'icon-512.png')
}

// ---------------------------------------------------------------- fotos do elenco
// [nome, arquivo, recorte em fração (ou null), proporção final (ou null), foco x, foco y, larguras]
const CARD = [360, 540, 720]
const FOTOS = [
  // onde o Natal acontece
  ['srv-visita', '40.24 (6)', null, 4 / 5, 0.5, 0.42, [480, 640, 760, 960]],
  ['srv-condominio', '40.23', [0, 0.236, 1, 0.764], null, 0.5, 0.5, [400, 560, 719]],
  ['srv-empresa', '41.27 (2)', [0, 0.1, 1, 0.8], 4 / 3, 0.5, 0.55, [400, 560, 720, 1100]],
  ['srv-shopping', '40.24 (9)', null, null, 0.5, 0.5, [400, 560, 720]],
  ['srv-escola', '40.24 (2)', [0, 0.06, 1, 0.82], 1, 0.5, 0.45, [400, 560, 720, 900]],
  ['srv-espetaculo', '40.24 (8)', [0, 0.12, 1, 0.76], 4 / 3, 0.5, 0.5, [480, 760, 1100]],
  // elenco (cartões em pé, 3:4)
  ['el-classico', '40.24 (3)', null, 3 / 4, 0.5, 0.45, CARD],
  ['el-imperial', '41.27 (1)', null, 3 / 4, 0.5, 0.4, CARD],
  ['el-mamae', '40.24 (4)', [0.38, 0.12, 0.62, 0.88], 3 / 4, 0.5, 0.42, CARD],
  ['el-duendes', '40.24 (11)', null, 3 / 4, 0.5, 0.4, CARD],
  ['el-noeletes', '40.24', null, 3 / 4, 0.5, 0.5, CARD],
  ['el-quebra-nozes', '40.24 (15)', [0.14, 0, 0.6, 1], 3 / 4, 0.5, 0.5, CARD],
  ['el-personagens', '41.26', [0, 0.1, 1, 0.84], 3 / 4, 0.5, 0.5, [360, 415]],
  // orçamento (só no computador): a lanterna e o rosto do Papai Noel Imperial, deitado, numa moldura
  ['orc-imperial', '41.27 (1)', null, 4 / 3, 0.5, 0.42, [420, 640]],
  // o que faz o Natal ser encantado: o figurino de perto
  ['dif-figurino', '41.27', null, 4 / 5, 0.5, 0.42, [480, 720, 960]],
  // galeria (faixa contínua, altura fixa: as larguras saem pela proporção)
  ['gal-violinista', '40.24 (13)', [0, 0.06, 1, 0.9], 3 / 4, 0.5, 0.45, [300, 480]],
  ['gal-mickey', '40.24 (1)', null, 4 / 3, 0.5, 0.5, [400, 640]],
  ['gal-noelete', '40.24 (12)', null, 3 / 4, 0.5, 0.35, [300, 480]],
  ['gal-imperial', '40.24 (7)', null, 3 / 4, 0.5, 0.4, [300, 480]],
  ['gal-duende-noel', '40.24 (10)', null, 3 / 4, 0.5, 0.45, [300, 480]],
  ['gal-bailarina', '40.24 (16)', null, 3 / 4, 0.5, 0.4, [300]],
  ['gal-soldadinho', '40.24 (14)', null, 3 / 4, 0.5, 0.35, [300]],
  ['gal-noeletes-dupla', '41.26 (1)', [0, 0.1, 1, 0.9], 3 / 4, 0.5, 0.4, [300, 480]],
  ['gal-sino', '40.24 (5)', null, 3 / 4, 0.5, 0.45, [300]],
]
for (const [nome, arq, corte, razao, fx, fy, larguras] of FOTOS) {
  let buf = corte ? await recorte(foto(arq), corte) : await sharp(foto(arq)).toBuffer()
  if (razao) buf = await proporcao(buf, razao, fx, fy)
  await variantes(buf, nome, larguras, { q: 72, avif: { quality: 50, effort: 7, chromaSubsampling: '4:2:0' } })
}

writeFileSync(path.join(OUT, 'manifesto.json'), JSON.stringify(manifesto, null, 1))
const total = Object.values(manifesto).reduce((s, m) => s + m.kb, 0)
console.log(`ok ${Object.keys(manifesto).length} arquivos em ${OUT} (${total} KB no total)`)
for (const n of ['hero-fundo-1440.avif', 'hero-fundo-cel-760.avif', 'hero-noel-640.avif', 'hero-noel-860.avif', 'logo-topo-360.avif'])
  if (manifesto[n]) console.log(`  ${n}: ${manifesto[n].kb} KB`)
if (!existsSync(path.join(RAIZ, 'favicon-32.png'))) console.log('aviso: favicon não gerado')
