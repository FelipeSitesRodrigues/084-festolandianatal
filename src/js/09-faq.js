// Acordeão das dúvidas: abre e fecha pelo botão (aria-expanded). A fechada fica inerte, pra
// o leitor de tela e o Tab não entrarem no texto escondido. Várias podem ficar abertas.
;(() => {
  document.querySelectorAll('.faq__item').forEach((item) => {
    const botao = item.querySelector('.faq__botao')
    const resposta = item.querySelector('.faq__resposta')
    if (!botao || !resposta) return
    const definir = (abrir) => {
      item.classList.toggle('faq__item--aberto', abrir)
      botao.setAttribute('aria-expanded', String(abrir))
      resposta.inert = !abrir
    }
    definir(item.classList.contains('faq__item--aberto'))
    botao.addEventListener('click', () => definir(botao.getAttribute('aria-expanded') !== 'true'))
  })
})()
