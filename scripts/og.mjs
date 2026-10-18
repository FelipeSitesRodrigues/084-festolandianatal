/**
 * Imagem de compartilhamento (WhatsApp, Instagram, Facebook), 1200 x 630: a cortina do hero,
 * o Papai Noel Imperial à direita e a logo dourada à esquerda. Sai em src/assets/img/og-natal.jpg
 * (o processar-imagens.mjs preserva os arquivos og-*).
 * Uso: node scripts/og.mjs
 */
import sharp from 'sharp'
import path from 'node:path'

const R = '../084- festolandia premium natal encantado/Recursos Site'
const W = 1200
const H = 630

const fundo = await sharp(path.join(R, 'FUNDO HERO.png')).resize(W, H, { fit: 'cover', position: 'right' }).toBuffer()
// véu à esquerda, onde a logo pousa
const veu = Buffer.from(`<svg width="${W}" height="${H}"><defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="#22050A" stop-opacity=".92"/><stop offset=".5" stop-color="#22050A" stop-opacity=".55"/><stop offset=".75" stop-color="#22050A" stop-opacity="0"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/></svg>`)
const noel = await sharp('src/assets/img/hero-noel-860.webp').resize({ height: 600 }).toBuffer()
const noelMeta = await sharp(noel).metadata()
const logo = await sharp('src/assets/img/logo-920.webp').resize({ width: 600 }).toBuffer()
const logoMeta = await sharp(logo).metadata()

await sharp(fundo)
  .composite([
    { input: veu, left: 0, top: 0 },
    { input: noel, left: W - noelMeta.width + 30, top: H - noelMeta.height + 30 },
    { input: logo, left: 50, top: Math.round((H - logoMeta.height) / 2) },
  ])
  .jpeg({ quality: 84, mozjpeg: true })
  .toFile('src/assets/img/og-natal.jpg')
console.log('ok src/assets/img/og-natal.jpg')
