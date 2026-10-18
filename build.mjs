/**
 * Build do site da Festolândia Premium Natal Encantado. HTML, CSS e JS estático em dist/
 * (base do 080, enxugada pra uma página só).
 *
 *   node build.mjs                          dist/index.html
 *   node build.mjs --preview 01-hero        só aquela seção, em dist/preview/01-hero.html
 *   node build.mjs --publicar               tudo do zero, sem os previews (antes de subir)
 *
 * Como funciona:
 * - SECOES (abaixo) lista os parciais da página, na ordem. src/molde.html é o esqueleto.
 *   <!-- @parcial NOME --> puxa src/partials/NOME.html.
 * - CSS: src/css/_*.css (base e fontes), depois o arquivo de cada parcial (mesmo nome) e os
 *   que o parcial pede com <!-- @usa nome -->, e 99-*.css por último. Entra minificado num
 *   <style>, com todo px convertido em rem (tela larga e zoom-out, memória do 080).
 * - JS: mesma regra, em src/js, num <script> no fim do <body>. Cada arquivo é um IIFE.
 * - Dados em src/dados/*.json viram HTML no build (sai tudo no HTML, pro Google ler):
 *   <!-- @servicos -->, <!-- @elenco -->, <!-- @galeria -->, <!-- @depoimentos --> e <!-- @faq -->.
 * - {{wa:chave}} vira o link do WhatsApp com a mensagem mensagens.chave do config.
 *   {{cfg.caminho}} puxa qualquer valor do config; {{ano}} é o ano atual.
 * - <i data-i="nome" data-w="light" class="..."></i> vira <svg><use> apontando pro sprite
 *   de ícones (Phosphor), só com os ícones usados.
 * - <img data-img="nome" sizes="..." alt="..."> vira <picture> com AVIF e WebP em srcset,
 *   width e height, a partir de src/assets/img/manifesto.json. data-img-max limita o src de
 *   reserva. data-desk="nome" (+ data-desk-sizes, data-desk-media) troca a imagem a partir
 *   daquela largura. data-preload: é o LCP, e o pedido sai no topo do <head>. data-adiar:
 *   decorativa, só baixa depois do LCP (_base.js).
 * - Avisa: travessão no texto, img sem alt/width/height, id repetido, âncora sem destino,
 *   marcador {{...}} que sobrou, CSS com chave desbalanceada, mais de um h1 e o que falta o
 *   cliente confirmar.
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync, statSync, copyFileSync, renameSync, rmSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import * as cheerio from 'cheerio'

const RAIZ = path.dirname(fileURLToPath(import.meta.url))
const P = (...a) => path.join(RAIZ, ...a)
const DIST = P('dist')
const cfg = JSON.parse(readFileSync(P('site.config.json'), 'utf8'))
const dados = (nome) => JSON.parse(readFileSync(P('src/dados', `${nome}.json`), 'utf8')).itens
const servicos = dados('servicos')
const elenco = dados('elenco')
const galeria = dados('galeria')
const depoimentos = dados('depoimentos')
const faq = dados('faq')
const manifesto = existsSync(P('src/assets/img/manifesto.json')) ? JSON.parse(readFileSync(P('src/assets/img/manifesto.json'), 'utf8')) : {}
const avisos = []
const BASE = (cfg.dominio || '').replace(/\/$/, '')

const SECOES = ['00-header', '01-hero', '02-provas', '03-servicos', '04-elenco', '05-encanto', '06-passos', '07-galeria', '08-depoimentos', '09-faq', '10-orcamento', '11-rodape']
const PAGINA = {
  titulo: 'Contratar Papai Noel em SP | Festolândia Natal Encantado',
  descricao: 'Papai Noel, Mamãe Noel, duendes músicos e Quebra-Nozes para o Natal em casa, condomínio, empresa e shopping em São Paulo. 20 anos de Festolândia.',
  ogTitulo: 'Festolândia Premium Natal Encantado',
  ogDescricao: 'O Papai Noel em quem a criança acredita. Papai Noel, Mamãe Noel, duendes e Quebra-Nozes em São Paulo.',
}

const argPreview = (() => {
  const i = process.argv.indexOf('--preview')
  return i > -1 ? process.argv[i + 1].split(',').map((s) => s.trim()) : null
})()

// ---------------------------------------------------------------- utilidades
function gravar(arq, conteudo) {
  mkdirSync(path.dirname(arq), { recursive: true })
  const tmp = `${arq}.${process.pid}.${Math.random().toString(36).slice(2)}.tmp`
  writeFileSync(tmp, conteudo)
  for (let t = 0; t < 20; t++) {
    try {
      renameSync(tmp, arq)
      return
    } catch (e) {
      if (t === 19) throw e
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 50)
    }
  }
}

function copiarPasta(de, para) {
  if (!existsSync(de)) return
  mkdirSync(para, { recursive: true })
  for (const nome of readdirSync(de)) {
    if (nome.startsWith('.') || nome === 'manifesto.json') continue
    const a = path.join(de, nome)
    const b = path.join(para, nome)
    const st = statSync(a)
    if (st.isDirectory()) copiarPasta(a, b)
    else if (!existsSync(b) || statSync(b).size !== st.size || statSync(b).mtimeMs < st.mtimeMs) {
      try {
        copyFileSync(a, b)
      } catch {
        /* outro processo copiando o mesmo arquivo: ignora */
      }
    }
  }
}

function lerParcial(nome) {
  const arq = P('src/partials', `${nome}.html`)
  if (!existsSync(arq)) {
    avisos.push(`parcial ausente: ${nome}`)
    return `<!-- parcial ${nome} ainda não existe -->`
  }
  return readFileSync(arq, 'utf8')
}

function arquivos(pasta, ext, nomes) {
  if (!existsSync(P(pasta))) return []
  const todos = readdirSync(P(pasta)).filter((f) => f.endsWith(ext))
  const nome = (f) => f.slice(0, -ext.length)
  const base = todos.filter((f) => f.startsWith('_')).sort()
  const fim = todos.filter((f) => f.startsWith('99-')).sort()
  const meio = todos.filter((f) => !f.startsWith('_') && !f.startsWith('99-') && nomes.has(nome(f))).sort()
  return [...base, ...meio, ...fim]
}

function juntar(pasta, ext, nomes) {
  return arquivos(pasta, ext, nomes)
    .map((f) => {
      const c = readFileSync(P(pasta, f), 'utf8')
      if (ext === '.css') {
        const abre = (c.match(/{/g) || []).length
        const fecha = (c.match(/}/g) || []).length
        if (abre !== fecha) avisos.push(`CSS com chaves desbalanceadas: ${f} (${abre} abre, ${fecha} fecha)`)
      }
      return c
    })
    .join(ext === '.js' ? '\n;\n' : '\n')
}

// Todo px do CSS vira rem (16 px = 1rem; url() fica como está). Até 1920 de largura a raiz
// vale 16 px e nada muda; acima disso o _base.css faz a raiz crescer com a tela.
const remCss = (css) =>
  css.replace(/url\([^)]*\)|(?<![\w.])(\d*\.?\d+)px\b/g, (m, n) => {
    if (n === undefined) return m
    const r = String(Number((Number(n) / 16).toFixed(4)))
    return `${r.startsWith('0.') ? r.slice(1) : r}rem`
  })

function minCss(css) {
  return remCss(css.replace(/\/\*[\s\S]*?\*\//g, ''))
    .replace(/\s+/g, ' ')
    .replace(/\s*([{};])\s*/g, '$1')
    .replace(/,\s+/g, ',')
    .replace(/;}/g, '}')
    .trim()
}

function minJs(js) {
  return js
    .split('\n')
    .filter((l) => !/^\s*\/\//.test(l))
    .map((l) => l.trim())
    .filter((l) => l !== '')
    .join('\n')
}

function valor(caminho) {
  const v = caminho.split('.').reduce((o, k) => (o == null ? undefined : o[k]), cfg)
  if (v === undefined) avisos.push(`config sem o caminho: ${caminho}`)
  return v ?? ''
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const wa = (msg) => `https://wa.me/${cfg.whatsapp}?text=${encodeURIComponent(msg)}`
function linkWa(chave) {
  const msg = cfg.mensagens[chave]
  if (!msg) avisos.push(`mensagem de WhatsApp sem chave no config: ${chave}`)
  return wa(msg || '')
}
// regra da casa: cada serviço e cada personagem com a sua mensagem
const waDe = (molde, item) => wa(cfg.mensagens[molde].replace('{servico}', item.mensagem))
const url = (rota) => `${BASE}${rota}`

// ---------------------------------------------------------------- ícones (sprite com <use>)
let usados = new Map()
function icone(nome, peso = 'light', classe = '') {
  const id = `i-${nome}-${peso}`
  if (!usados.has(id)) {
    const arq = P('node_modules/@phosphor-icons/core/assets', peso, `${nome}${peso === 'regular' ? '' : '-' + peso}.svg`)
    if (!existsSync(arq)) {
      avisos.push(`ícone não existe: ${nome} (${peso})`)
      return ''
    }
    const miolo = readFileSync(arq, 'utf8').replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').replace(/\s+/g, ' ').trim()
    usados.set(id, `<symbol id="${id}" viewBox="0 0 256 256">${miolo}</symbol>`)
  }
  const cls = ['i', classe].filter(Boolean).join(' ')
  return `<svg class="${cls}" aria-hidden="true" focusable="false"><use href="#${id}"/></svg>`
}

// ---------------------------------------------------------------- imagens (<picture> com AVIF e WebP)
function versoes(nome, ext) {
  return Object.entries(manifesto)
    .map(([arq, m]) => ({ arq, m, w: Number((arq.match(new RegExp(`^${nome}-(\\d+)\\.${ext}$`)) || [])[1]) }))
    .filter((v) => v.w)
    .sort((a, b) => a.w - b.w)
}
const srcset = (vs) => vs.map((v) => `/assets/img/${v.arq} ${v.m.w}w`).join(', ')
const attr = (s, nome) => (s.match(new RegExp(`\\s${nome}="([^"]*)"`)) || [])[1]
const semAttr = (s, ...nomes) => nomes.reduce((t, n) => t.replace(new RegExp(`\\s${n}="[^"]*"`, 'g'), ''), s)

function fontesDe(nome, sizes, media = '') {
  const va = versoes(nome, 'avif')
  const vw = versoes(nome, 'webp')
  if (!vw.length) avisos.push(`imagem sem arquivo no manifesto: ${nome}`)
  const maior = vw[vw.length - 1]?.m || { w: 1, h: 1 }
  const mq = media ? ` media="${media}"` : ''
  return [
    va.length ? `<source${mq} type="image/avif" srcset="${srcset(va)}" sizes="${sizes}" width="${maior.w}" height="${maior.h}">` : '',
    `<source${mq} type="image/webp" srcset="${srcset(vw)}" sizes="${sizes}" width="${maior.w}" height="${maior.h}">`,
  ].join('')
}

function imagens(html, preloads) {
  return html.replace(/<img\b([^>]*?)\sdata-img="([\w-]+)"([^>]*)>/g, (tag, antes, nome, depois) => {
    let attrs = antes + depois
    const sizes = attr(attrs, 'sizes') || '100vw'
    const desk = attr(attrs, 'data-desk')
    const deskSizes = attr(attrs, 'data-desk-sizes') || sizes
    const deskMedia = attr(attrs, 'data-desk-media') || '(min-width: 64em)'
    const max = Number(attr(attrs, 'data-img-max') || Infinity)
    const classePicture = attr(attrs, 'data-picture')
    const lcp = /\sdata-preload(?=[\s/]|$)/.test(attrs)
    attrs = semAttr(attrs, 'data-desk', 'data-desk-sizes', 'data-desk-media', 'data-img-max', 'data-picture', 'sizes').replace(/\sdata-preload(?=[\s/]|$)/, '')
    const fontes = desk ? [fontesDe(desk, deskSizes, deskMedia)] : []
    const vw = versoes(nome, 'webp')
    const va = versoes(nome, 'avif')
    if (!vw.length) {
      avisos.push(`data-img sem arquivo no manifesto: ${nome}`)
      return tag
    }
    if (lcp) preloads.push({ nome, sizes, desk, deskSizes, deskMedia })
    const principal = [...vw].reverse().find((v) => v.w <= max) || vw[0]
    if (va.length) fontes.push(`<source type="image/avif" srcset="${srcset(va)}" sizes="${sizes}">`)
    const img = `<img src="/assets/img/${principal.arq}" srcset="${srcset(vw)}" sizes="${sizes}" width="${principal.m.w}" height="${principal.m.h}"${attrs}>`
    return `<picture${classePicture ? ` class="${classePicture}"` : ''}>${fontes.join('')}${img}</picture>`
  })
}

function linksPreload(lista) {
  const inversa = (m) => {
    const x = /\(min-width:\s*([\d.]+)em\)/.exec(m)
    return x ? `(max-width: ${(Number(x[1]) - 0.01).toFixed(2)}em)` : ''
  }
  const link = (nome, sizes, media) => {
    const va = versoes(nome, 'avif')
    return va.length ? `<link rel="preload" as="image" type="image/avif" imagesrcset="${srcset(va)}" imagesizes="${sizes}"${media ? ` media="${media}"` : ''} fetchpriority="high">` : ''
  }
  return lista
    .flatMap((p) => (p.desk ? [link(p.nome, p.sizes, inversa(p.deskMedia)), link(p.desk, p.deskSizes, p.deskMedia)] : [link(p.nome, p.sizes, '')]))
    .filter(Boolean)
    .join('\n  ')
}

// ---------------------------------------------------------------- onde o Natal acontece (src/dados/servicos.json)
// Mosaico com foto real em cada cartão. A visita da noite de Natal é o cartão grande (o
// pedido mais comum), o espetáculo fecha a grade numa faixa larga com o texto ao lado.
// Cada cartão tem o WhatsApp do próprio serviço (regra da casa).
const TAM_SRV = {
  visita: '(min-width: 80em) 600px, (min-width: 64em) 48vw, (min-width: 40em) 92vw, calc(100vw - 32px)',
  espetaculo: '(min-width: 80em) 680px, (min-width: 64em) 55vw, (min-width: 40em) 92vw, calc(100vw - 32px)',
  pequeno: '(min-width: 80em) 290px, (min-width: 64em) 23vw, (min-width: 40em) 46vw, calc(100vw - 32px)',
}
const cardServico = (s, i) => {
  const tipo = s.id === 'visita' ? 'grande' : s.id === 'espetaculo' ? 'faixa' : 'pequeno'
  const sizes = TAM_SRV[s.id] || TAM_SRV.pequeno
  return `
          <li class="srv srv--${tipo}" style="--i:${i}">
            <span class="srv__foto"><img data-img="${s.foto}" sizes="${sizes}" alt="${esc(s.alt)}" loading="lazy" decoding="async"></span>
            <div class="srv__corpo">
              <h3 class="srv__nome">${esc(s.nome)}</h3>
              <p class="srv__linha">${esc(s.linha)}</p>
              <a class="btn btn--dourado btn--p srv__btn" href="${esc(waDe('servico', s))}" data-zap="servico-${s.id}" data-servico="${esc(s.nome)}" aria-label="Pedir orçamento de ${esc(s.nome.toLowerCase())} pelo WhatsApp">${icone('whatsapp-logo', 'fill')}Pedir orçamento</a>
            </div>
          </li>`
}
const htmlServicos = () => `<ul class="srvs" role="list" data-revela-lista>${servicos.map(cardServico).join('')}
        </ul>`

// ---------------------------------------------------------------- elenco (src/dados/elenco.json)
// Cartões em pé com a foto real de cada personagem. No celular, faixa de arrastar.
const TAM_EL = '(min-width: 80em) 282px, (min-width: 64em) calc(25vw - 40px), (min-width: 40em) 300px, 74vw'
const cardElenco = (p, i) => `
          <li class="pers" style="--i:${i}">
            <span class="pers__foto"><img data-img="${p.foto}" sizes="${TAM_EL}" alt="${esc(p.alt)}" loading="lazy" decoding="async"></span>
            <div class="pers__corpo">
              <h3 class="pers__nome">${esc(p.nome)}</h3>
              <p class="pers__linha">${esc(p.linha)}</p>
              <a class="btn btn--contorno-vermelho btn--p pers__btn" href="${esc(waDe('personagem', p))}" data-zap="elenco-${p.id}" data-servico="${esc(p.nome)}" aria-label="Quero ${esc(p.nome)} na minha festa: falar no WhatsApp">${icone('whatsapp-logo', 'fill')}Quero este</a>
            </div>
          </li>`
const htmlElenco = () => `<ul class="elenco__lista" role="list" data-revela-lista>${elenco.map(cardElenco).join('')}
        </ul>`

// ---------------------------------------------------------------- galeria (src/dados/galeria.json)
// Faixa contínua: a lista duas vezes, a segunda só de desenho (aria-hidden, alt vazio). A
// altura da faixa é clamp(260px, 22vw + 60px, 400px): as larguras saem da proporção.
// loading="lazy" vem ANTES do src (memória do 058: o clone copia na ordem e baixa na hora).
const fotoGaleria = (copia) => (f) => {
  const m = versoes(f.foto, 'webp').at(-1)?.m || { w: 3, h: 4 }
  const r = m.w / m.h
  const sizes = `(min-width: 96em) ${Math.round(400 * r)}px, (min-width: 40em) calc((22vw + 60px) * ${r.toFixed(3)}), ${Math.round(260 * r)}px`
  return `<li class="gal__foto" style="--r:${r.toFixed(4)}"><img loading="lazy" decoding="async" data-img="${f.foto}" sizes="${sizes}" alt="${copia ? '' : esc(f.alt)}"></li>`
}
const htmlGaleria = () => [false, true].map((copia) => `<ul class="gal__lista" role="list"${copia ? ' aria-hidden="true"' : ''}>${galeria.map(fotoGaleria(copia)).join('')}</ul>`).join('\n          ')

// ---------------------------------------------------------------- depoimentos (src/dados/depoimentos.json)
const iniciais = (nome) => nome.split(' ').filter((p) => p.length > 2).slice(0, 2).map((p) => p[0]).join('')
const htmlDepoimentos = () =>
  depoimentos
    .map(
      (d, i) => `
          <li class="dep" style="--i:${i}">
            <figure>
              ${icone('quotes', 'fill', 'dep__aspas')}
              <blockquote class="dep__texto"><p>${esc(d.texto)}</p></blockquote>
              <figcaption class="dep__quem"><span class="dep__ini" aria-hidden="true">${iniciais(d.nome)}</span><span><strong>${esc(d.nome)}</strong><span class="dep__onde">Avaliação no Google</span></span></figcaption>
            </figure>
          </li>`,
    )
    .join('')

// ---------------------------------------------------------------- dúvidas (src/dados/faq.json)
// Botão de verdade com aria-expanded e aria-controls; a resposta abre pela grade (0fr -> 1fr).
// A primeira começa aberta. Sem JS, todas abertas. Duas colunas fixas (a primeira metade e a
// segunda): em CSS columns, abrir uma pergunta jogaria as outras pra coluna do lado.
const htmlFaq = () => {
  const meio = Math.ceil(faq.length / 2)
  return [faq.slice(0, meio), faq.slice(meio)].map((parte, c) => `<div class="faq__coluna" style="--i:${c}">${parte.map((q, k) => itemFaq(q, c * meio + k)).join('')}
          </div>`).join('\n          ')
}
const itemFaq = (q, i) => `
            <div class="faq__item${i === 0 ? ' faq__item--aberto' : ''}" style="--i:${i}">
              <h3 class="faq__pergunta">
                <button class="faq__botao" type="button" id="faq-b${i + 1}" aria-expanded="${i === 0}" aria-controls="faq-r${i + 1}"><span>${esc(q.pergunta)}</span><span class="faq__mais" aria-hidden="true"></span></button>
              </h3>
              <div class="faq__resposta" id="faq-r${i + 1}" role="region" aria-labelledby="faq-b${i + 1}">
                <div class="faq__miolo"><p>${esc(q.resposta)}</p></div>
              </div>
            </div>`

// ---------------------------------------------------------------- dados estruturados (GEO e Google)
function schema() {
  const id = (h) => `${BASE}/#${h}`
  const negocio = {
    '@type': ['LocalBusiness', 'EntertainmentBusiness'],
    '@id': id('negocio'),
    name: cfg.nome,
    alternateName: cfg.nomeCurto,
    description:
      'A Festolândia Premium Natal Encantado é a linha de Natal da Festolândia Shows e Eventos, empresa de personagens vivos para festas em São Paulo há 20 anos. Leva Papai Noel, Mamãe Noel, duendes músicos com violino ao vivo, Noeletes e o Soldadinho e a Bailarina do Quebra-Nozes para a noite de Natal em casa, condomínios, confraternizações de empresa, shoppings, lojas, escolas e buffets em São Paulo e região.',
    slogan: 'O Papai Noel em quem a criança acredita.',
    url: url('/'),
    image: url('/assets/img/og-natal.jpg'),
    logo: url('/icon-512.png'),
    telephone: `+${cfg.whatsapp}`,
    email: cfg.email,
    address: { '@type': 'PostalAddress', streetAddress: cfg.endereco, addressLocality: cfg.cidade, addressRegion: cfg.uf, addressCountry: 'BR' },
    areaServed: [{ '@type': 'City', name: 'São Paulo' }, { '@type': 'AdministrativeArea', name: 'Grande São Paulo' }],
    openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '09:00', closes: '20:00' }],
    parentOrganization: { '@type': 'Organization', name: cfg.empresa },
    sameAs: [cfg.instagramUrl],
    knowsAbout: ['contratar Papai Noel', 'Papai Noel para festa de Natal', 'visita do Papai Noel na noite de Natal', 'Papai Noel para empresa', 'Papai Noel para condomínio', 'Papai Noel para shopping', 'Mamãe Noel para evento', 'duendes de Natal', 'Noeletes', 'espetáculo de Natal Quebra-Nozes'],
    makesOffer: servicos.map((s) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: s.nome, description: s.linha, areaServed: 'São Paulo, SP' } })),
  }
  const site = { '@type': 'WebSite', '@id': id('site'), name: cfg.nome, url: url('/'), inLanguage: 'pt-BR', publisher: { '@id': id('negocio') } }
  const pagina = { '@type': 'WebPage', '@id': `${url('/')}#pagina`, url: url('/'), name: PAGINA.titulo, description: PAGINA.descricao, inLanguage: 'pt-BR', isPartOf: { '@id': id('site') }, about: { '@id': id('negocio') } }
  const duvidas = { '@type': 'FAQPage', '@id': `${url('/')}#duvidas`, mainEntity: faq.map((q) => ({ '@type': 'Question', name: q.pergunta, acceptedAnswer: { '@type': 'Answer', text: q.resposta } })) }
  return `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': [negocio, site, pagina, duvidas] })}</script>`
}

// ---------------------------------------------------------------- montagem
function montar(secoes, preview = false) {
  usados = new Map()
  const preloads = []
  const nomes = new Set()
  let html = readFileSync(P('src/molde.html'), 'utf8')
  html = html.replace('<!-- @conteudo -->', secoes.filter((n) => n !== '00-header' && n !== '11-rodape').map((n) => `    <!-- @parcial ${n} -->`).join('\n'))
  if (preview) {
    if (!secoes.includes('00-header')) html = html.replace(/<!--\s*@parcial 00-header\s*-->/, '')
    if (!secoes.includes('11-rodape')) html = html.replace(/<!--\s*@parcial 11-rodape\s*-->/, '')
  }
  for (let n = 0; n < 5 && /<!--\s*@parcial\s/.test(html); n++)
    html = html.replace(/<!--\s*@parcial\s+([\w-]+)\s*-->/g, (_, nome) => {
      nomes.add(nome)
      return lerParcial(nome)
    })
  html = html.replace(/[ \t]*<!--\s*@usa\s+([\w\s,-]+?)\s*-->\n?/g, (_, lista) => {
    for (const d of lista.split(/[\s,]+/).filter(Boolean)) {
      if (!existsSync(P('src/css', `${d}.css`)) && !existsSync(P('src/js', `${d}.js`))) avisos.push(`@usa ${d}: não existe css nem js com esse nome`)
      nomes.add(d)
    }
    return ''
  })
  html = html
    .replace('<!-- @servicos -->', htmlServicos)
    .replace('<!-- @elenco -->', htmlElenco)
    .replace('<!-- @galeria -->', htmlGaleria)
    .replace('<!-- @depoimentos -->', htmlDepoimentos)
    .replace('<!-- @faq -->', htmlFaq)
  html = html.replace('<!-- @js -->', () => `<script>${minJs(juntar('src/js', '.js', nomes))}</script>`)
  html = html.replace('<!-- @css -->', () => `<style>${minCss(juntar('src/css', '.css', nomes))}</style>`)
  html = html.replace(/<i data-i="([\w-]+)"(?: data-w="(\w+)")?(?: class="([^"]*)")?><\/i>/g, (_, nome, peso, classe) => icone(nome, peso || 'light', classe || ''))
  html = html.replace(/\{\{pag\.([\w-]+)\}\}/g, (_, k) => esc(PAGINA[k] ?? ''))
  html = html.replace(/\{\{wa:([\w-]+)\}\}/g, (_, chave) => esc(linkWa(chave)))
  html = html.replace(/\{\{cfg\.([\w.]+)\}\}/g, (_, c) => esc(valor(c)))
  html = html.replace(/\{\{ano\}\}/g, String(new Date().getFullYear()))
  // todo WhatsApp abre em outra aba
  html = html.replace(/<a\b(?![^>]*\starget=)([^>]*\shref="https:\/\/wa\.me\/)/g, '<a target="_blank" rel="noopener"$1')
  html = html.replace('<!-- @schema -->', () => (preview ? '' : schema()))
  html = imagens(html, preloads)
  html = html.replace(/<picture([^>]*)>((?:(?!<\/picture>)[\s\S])*?)<\/picture>/g, (tag, a, miolo) =>
    miolo.includes(' data-adiar') ? `<picture${a} data-adiada>${miolo.replace(/ (srcset|src)="/g, ' data-$1="').replace(' data-adiar', '')}</picture>` : tag,
  )
  html = html.replace('<!-- @sprite -->', () => `<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" width="0" height="0" style="position:absolute;overflow:hidden">${[...usados.values()].join('')}</svg>`)
  html = html.replace('<!-- @preload-hero -->', () => linksPreload(preloads))
  html = html.replace(
    '<!-- @meta-dominio -->',
    BASE
      ? `<link rel="canonical" href="${url('/')}">\n  <meta property="og:url" content="${url('/')}">\n  <meta property="og:image" content="${url('/assets/img/og-natal.jpg')}">`
      : '<meta property="og:image" content="/assets/img/og-natal.jpg">',
  )
  return html
}

// ---------------------------------------------------------------- conferência
function verificar(html, rotulo) {
  const $ = cheerio.load(html)
  const ids = {}
  $('[id]').each((_, el) => {
    const id = $(el).attr('id')
    ids[id] = (ids[id] || 0) + 1
  })
  $('script, style').remove()
  const texto = $('body').text()
  const tracos = texto.match(/.{0,30}[—–].{0,30}/g)
  if (tracos) avisos.push(`[${rotulo}] travessão no texto (regra da casa): ${tracos.slice(0, 4).map((s) => JSON.stringify(s.trim())).join(' | ')}`)
  const sobrou = html.match(/\{\{[^}]+\}\}/g)
  if (sobrou) avisos.push(`[${rotulo}] marcadores sem valor: ${[...new Set(sobrou)].join(', ')}`)
  $('img').each((_, el) => {
    const src = ($(el).attr('src') || $(el).attr('data-src') || '?').slice(0, 60)
    if ($(el).attr('alt') === undefined) avisos.push(`[${rotulo}] img sem alt: ${src}`)
    if (!$(el).attr('width') || !$(el).attr('height')) avisos.push(`[${rotulo}] img sem width/height (salto de layout): ${src}`)
  })
  for (const [id, n] of Object.entries(ids)) if (n > 1) avisos.push(`[${rotulo}] id repetido: #${id} (${n}x)`)
  if (!argPreview) {
    $('a[href^="#"]').each((_, el) => {
      const alvo = $(el).attr('href').slice(1)
      if (alvo && !ids[alvo]) avisos.push(`[${rotulo}] âncora sem destino: #${alvo}`)
    })
    if ($('h1').length !== 1) avisos.push(`[${rotulo}] ${$('h1').length} h1 na página (precisa ser 1)`)
  }
}

// ---------------------------------------------------------------- execução
if (process.argv.includes('--publicar')) rmSync(DIST, { recursive: true, force: true })
copiarPasta(P('src/assets'), path.join(DIST, 'assets'))
copiarPasta(P('src/raiz'), DIST)

const kb = (s) => `${(Buffer.byteLength(s) / 1024).toFixed(1)} KB`
if (!argPreview) {
  const html = montar(SECOES)
  verificar(html, 'index')
  gravar(path.join(DIST, 'index.html'), html)
  console.log(`ok dist/index.html ${kb(html)} (${usados.size} ícones no sprite)`)
  gravar(path.join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /preview/\n${BASE ? `Sitemap: ${BASE}/sitemap.xml\n` : ''}`)
  if (BASE) gravar(path.join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${url('/')}</loc><lastmod>${new Date().toISOString().slice(0, 10)}</lastmod></url>\n</urlset>\n`)
  else avisos.push('dominio vazio no site.config.json: sem canonical, sem sitemap e og:image relativo')
  for (const p of cfg.pendencias || []) avisos.push(`pendente: ${p}`)
  if (process.argv.includes('--publicar')) rmSync(path.join(DIST, 'preview'), { recursive: true, force: true })
} else {
  const nome = argPreview.join('+')
  const html = montar(argPreview, true)
  verificar(html, 'preview')
  gravar(path.join(DIST, `preview/${nome}.html`), html)
  console.log(`ok /preview/${nome}.html ${kb(html)}`)
}
if (avisos.length) console.log(`AVISOS:\n  ${[...new Set(avisos)].join('\n  ')}`)
