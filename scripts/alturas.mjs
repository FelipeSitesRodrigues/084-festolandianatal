/**
 * Mede a altura do CONTEÚDO de cada seção abaixo da dobra (sem o padding, que o navegador
 * soma por cima do contain-intrinsic-size, bug do 076) em 1440, 1100, 800 e 390, e imprime o
 * bloco pronto pro 99-desempenho.css. Rodar de novo quando uma seção mudar muito de tamanho.
 * Uso: node scripts/alturas.mjs
 */
import puppeteer from 'puppeteer-core'

const SECOES = ['.servicos', '.elenco', '.encanto', '.passos', '.galeria', '.depoimentos', '.faq', '.orc', '.rodape']
const FAIXAS = [
  [1440, ''],
  [1100, '@media (max-width: 79.99em)'],
  [800, '@media (max-width: 63.99em)'],
  [390, '@media (max-width: 39.99em)'],
]
const navegador = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', args: ['--force-prefers-reduced-motion'] })
const page = await navegador.newPage()
const saida = []
for (const [w, mq] of FAIXAS) {
  await page.setViewport({ width: w, height: 900 })
  await page.goto('http://localhost:3084/#orcamento', { waitUntil: 'networkidle0' })
  await page.evaluate(() => document.fonts.ready)
  // tudo desenhado e o formulário montado (o #orcamento no endereço monta)
  await page.evaluate(() => document.documentElement.classList.add('cv-pronto'))
  const alturas = await page.evaluate((sel) =>
    sel.map((s) => {
      const el = document.querySelector(s)
      const cs = getComputedStyle(el)
      return [s, Math.round(el.getBoundingClientRect().height - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom) - parseFloat(cs.borderTopWidth))]
    }),
  SECOES)
  const linhas = alturas.map(([s, h]) => `${mq ? '  ' : ''}${s} { contain-intrinsic-size: auto ${h}px; }`)
  saida.push(mq ? `${mq} {\n${linhas.join('\n')}\n}` : linhas.join('\n'))
}
await navegador.close()
console.log(saida.join('\n'))
