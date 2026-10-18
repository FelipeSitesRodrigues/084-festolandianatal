// Menu do celular: o botão abre o menu em tela cheia. Fecha no Esc, no clique num link e
// quando a tela passa pra largura do computador. Enquanto aberto, o resto da página fica
// inerte (o foco não escapa pro conteúdo por trás) e a página não rola.
;(() => {
  const topo = document.getElementById('topo')
  const botao = topo?.querySelector('.topo__menu')
  const menu = document.getElementById('menu-cel')
  if (!botao || !menu) return
  const fora = [document.getElementById('conteudo'), document.getElementById('rodape'), document.querySelector('.zap-flutuante')].filter(Boolean)
  let aberto = false

  const definir = (abrir) => {
    if (abrir === aberto) return
    aberto = abrir
    botao.setAttribute('aria-expanded', String(abrir))
    botao.setAttribute('aria-label', abrir ? 'Fechar o menu' : 'Abrir o menu')
    topo.classList.toggle('topo--menu', abrir)
    document.documentElement.style.overflow = abrir ? 'hidden' : ''
    fora.forEach((el) => (el.inert = abrir))
    if (abrir) {
      menu.hidden = false
      requestAnimationFrame(() => menu.classList.add('menu-cel--aberto'))
      menu.querySelector('a')?.focus({ preventScroll: true })
    } else {
      menu.classList.remove('menu-cel--aberto')
      setTimeout(() => !aberto && (menu.hidden = true), 360)
    }
  }

  botao.addEventListener('click', () => definir(!aberto))
  menu.addEventListener('click', (e) => e.target.closest('a') && definir(false))
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && aberto) {
      definir(false)
      botao.focus()
    }
  })
  matchMedia('(min-width: 68.75em)').addEventListener('change', (e) => e.matches && definir(false))
})()
