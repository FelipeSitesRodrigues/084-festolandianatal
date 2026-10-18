/**
 * Lighthouse local no Chrome da máquina, celular e computador, com o resumo no terminal
 * (base do 080). O servidor (scripts/serve.mjs) comprime com gzip como a Vercel.
 * Relatórios em lighthouse/<modo>[-nome].json.
 *
 * Uso: node scripts/lighthouse.mjs [celular|computador|ambos] [nome]
 *      METODO=devtools node scripts/lighthouse.mjs celular   (limitação real, não simulada)
 */
import { execFileSync } from 'node:child_process'
import { readFileSync, mkdirSync } from 'node:fs'

const modo = process.argv[2] || 'ambos'
const nome = process.argv[3] || ''
const BASE = (process.env.BASE_URL ?? 'http://localhost:3084').replace(/\/$/, '')
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
mkdirSync('lighthouse', { recursive: true })

for (const m of modo === 'ambos' ? ['celular', 'computador'] : [modo]) {
  const saida = `lighthouse/${m}${nome ? '-' + nome : ''}.json`
  const args = ['node_modules/lighthouse/cli/index.js', BASE + '/', '--quiet', '--output=json', `--output-path=${saida}`, '--chrome-flags=--headless=new --no-first-run', '--only-categories=performance,accessibility,best-practices,seo']
  if (m === 'computador') args.push('--preset=desktop')
  if (process.env.METODO) args.push(`--throttling-method=${process.env.METODO}`)
  try {
    execFileSync(process.execPath, args, { env: { ...process.env, CHROME_PATH: CHROME }, stdio: 'ignore' })
  } catch {
    /* no Windows o Lighthouse às vezes falha ao apagar a pasta temporária do Chrome depois de gravar: o relatório fica */
  }
  const r = JSON.parse(readFileSync(saida, 'utf8'))
  const a = r.audits
  // benchmarkIndex abaixo de 1.500: máquina ocupada, a nota de celular não vale (memória do 076)
  const bench = Math.round(r.environment?.benchmarkIndex || 0)
  const aviso = bench && bench < 1500 ? '  (MÁQUINA OCUPADA: nota não confiável)' : ''
  console.log(`\n${m.toUpperCase()}  ` + Object.values(r.categories).map((c) => `${c.id} ${Math.round(c.score * 100)}`).join(' · ') + `  · CPU ${bench}${aviso}`)
  console.log('  ' + ['first-contentful-paint', 'largest-contentful-paint', 'speed-index', 'total-blocking-time', 'cumulative-layout-shift'].map((k) => `${k.split('-').map((p) => p[0]).join('').toUpperCase()} ${a[k].displayValue}`).join(' · '))
  const lcp = a['largest-contentful-paint-element']?.details?.items?.[0]?.items?.[0]?.node?.snippet
  if (lcp) console.log('  LCP: ' + lcp.slice(0, 140))
  const ruins = Object.entries(a).filter(([, x]) => x.score !== null && x.score < 0.9 && !['informative', 'notApplicable', 'manual'].includes(x.scoreDisplayMode))
  for (const [id, x] of ruins) console.log(`  x ${id} (${x.score}) ${x.displayValue || ''}`)
}
