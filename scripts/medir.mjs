/**
 * Conferência rápida em várias larguras (Chrome da máquina, puppeteer-core): estouro
 * horizontal, linhas do título do hero, botão quebrado em duas linhas e elemento que passa
 * da borda direita. Uso: node scripts/medir.mjs [largura,largura,...]
 */
import puppeteer from 'puppeteer-core'

const larguras = (process.argv[2] || '320,360,390,768,1024,1280,1440,1920,2560').split(',').map(Number)
const navegador = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', args: ['--hide-scrollbars', '--force-prefers-reduced-motion'] })
const page = await navegador.newPage()
for (const w of larguras) {
  await page.setViewport({ width: w, height: w < 600 ? 844 : 900, deviceScaleFactor: 1 })
  await page.goto('http://localhost:3084/', { waitUntil: 'networkidle0' })
  await page.evaluate(() => document.fonts.ready)
  const r = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth
    const h1 = document.querySelector('.hero__titulo')
    const lh = parseFloat(getComputedStyle(h1).lineHeight)
    const linhas = Math.round(h1.getBoundingClientRect().height / lh)
    const botoes = [...document.querySelectorAll('.btn')].filter((b) => b.offsetParent && b.getBoundingClientRect().height > 62).map((b) => b.textContent.trim().slice(0, 30))
    const fora = [...document.querySelectorAll('body *')]
      .filter((el) => {
        if (!el.offsetParent || el.closest('.gal, .elenco__lista, .neve, .hero__bolas, .menu-cel, svg')) return false
        const b = el.getBoundingClientRect()
        return b.right > vw + 1 && b.width > 0
      })
      .slice(0, 5)
      .map((el) => `${el.tagName.toLowerCase()}.${[...el.classList].join('.')}`)
    const hero = document.querySelector('.hero').getBoundingClientRect().height
    const botoesHero = document.querySelector('.hero__botoes').getBoundingClientRect().bottom
    return { scroll: document.documentElement.scrollWidth - vw, linhas, fonte: getComputedStyle(h1).fontSize, botoes, fora, hero: Math.round(hero), ctaNaDobra: botoesHero <= innerHeight }
  })
  console.log(`${String(w).padStart(4)}: estouro ${r.scroll}px · h1 ${r.linhas} linhas (${r.fonte}) · hero ${r.hero}px · CTA na 1ª dobra ${r.ctaNaDobra ? 'sim' : 'NÃO'}${r.botoes.length ? ` · botão quebrado: ${r.botoes.join(' | ')}` : ''}${r.fora.length ? ` · passa da borda: ${r.fora.join(', ')}` : ''}`)
}
await navegador.close()
