// Galeria em faixa contínua. A duração sai do comprimento (34 px/s), pra a velocidade ser a
// mesma em qualquer tela. As fotos à direita ficam fora da faixa cortada, e o lazy do Chrome
// só pediria quando entrassem (chegam em branco, memória do 080): perto da seção, todas
// passam pra eager. A faixa para fora da tela (não gasta quadro à toa) e no botão de pausa.
;(() => {
  const gal = document.querySelector('.gal')
  const trilho = gal?.querySelector('.gal__trilho')
  const botao = document.querySelector('.gal__pausa')
  if (!gal || !trilho) return
  const rotulo = botao?.querySelector('.gal__rotulo')
  let pausadoPeloBotao = false

  const medir = () => {
    const uma = trilho.querySelector('.gal__lista')
    if (uma) trilho.style.setProperty('--dur', `${Math.max(30, Math.round(uma.getBoundingClientRect().width / 34))}s`)
  }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(
      ([e], io) => {
        if (!e.isIntersecting) return
        gal.querySelectorAll('img[loading="lazy"]').forEach((img) => (img.loading = 'eager'))
        io.disconnect()
        medir()
      },
      { rootMargin: '700px 0px' },
    ).observe(gal)
    new IntersectionObserver(([e]) => gal.classList.toggle('gal--parada', pausadoPeloBotao || !e.isIntersecting)).observe(gal)
  }
  addEventListener('resize', medir, { passive: true })

  botao?.addEventListener('click', () => {
    pausadoPeloBotao = !pausadoPeloBotao
    botao.setAttribute('aria-pressed', String(pausadoPeloBotao))
    if (rotulo) rotulo.textContent = pausadoPeloBotao ? 'Continuar as fotos' : 'Pausar as fotos'
    gal.classList.toggle('gal--parada', pausadoPeloBotao)
  })
})()
