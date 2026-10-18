// Contadores da faixa de provas: quando a faixa entra na tela, cada número conta de zero até
// o valor (o HTML já traz o valor final: sem JS, ou com "reduzir movimento", fica parado).
;(() => {
  const nums = document.querySelectorAll('[data-conta]')
  if (!nums.length || !('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const formatar = (el, v) => {
    if (el.hasAttribute('data-decimal')) return v.toFixed(1).replace('.', ',')
    const n = Math.round(v)
    return el.hasAttribute('data-milhar') ? n.toLocaleString('pt-BR') : String(n)
  }
  const contar = (el) => {
    const alvo = Number(el.dataset.conta)
    const dur = 1600
    // a largura do valor final fica reservada: o texto ao lado não anda enquanto conta
    el.style.display = 'inline-block'
    el.style.minWidth = `${el.getBoundingClientRect().width}px`
    el.style.textAlign = 'right'
    const t0 = performance.now()
    const passo = (t) => {
      const p = Math.min(1, (t - t0) / dur)
      const e = 1 - Math.pow(1 - p, 4)
      el.textContent = formatar(el, alvo * e)
      if (p < 1) requestAnimationFrame(passo)
    }
    requestAnimationFrame(passo)
  }
  const io = new IntersectionObserver(
    (entradas) => {
      for (const e of entradas) {
        if (!e.isIntersecting) continue
        io.unobserve(e.target)
        contar(e.target)
      }
    },
    { threshold: 0.6 },
  )
  nums.forEach((el) => io.observe(el))
})()
