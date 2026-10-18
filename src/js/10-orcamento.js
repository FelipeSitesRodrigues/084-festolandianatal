// Formulário do orçamento. Mora num <template> e entra quando a seção chega a 900 px da tela,
// no clique de um link #orcamento (em captura, antes da rolagem) ou chegando com #orcamento
// no endereço: no HTML, os campos e o preenchimento automático do Chrome pesavam no primeiro
// quadro (memória do 080). Depois de montado: valida no envio (e de novo a cada campo
// corrigido), monta a mensagem e abre o WhatsApp numa aba nova. Estados: erro (aria-invalid e
// texto embaixo do campo), carregando no botão e sucesso com link de reserva.
;(() => {
  const numero = '{{cfg.whatsapp}}'
  const molde = document.getElementById('orc-form-molde')
  const lugar = document.getElementById('orc-form-lugar')
  const secao = document.getElementById('orcamento')
  if (!molde || !lugar) return
  let montado = false

  const montar = () => {
    if (montado) return
    montado = true
    lugar.append(molde.content.cloneNode(true))
    lugar.classList.add('orc__form--montado')
    ligar(lugar.querySelector('form'))
  }
  if (location.hash === '#orcamento') montar()
  else if ('IntersectionObserver' in window)
    new IntersectionObserver(
      ([e], io) => {
        if (!e.isIntersecting) return
        io.disconnect()
        montar()
      },
      { rootMargin: '900px 0px' },
    ).observe(secao || lugar)
  else montar()
  document.addEventListener('click', (e) => e.target.closest('a[href$="#orcamento"]') && montar(), true)

  function ligar(form) {
    const f = form.elements
    const sucesso = form.querySelector('.form__sucesso')
    const reserva = form.querySelector('.form__link')
    const enviar = form.querySelector('.form__enviar')
    const digitos = (s) => s.replace(/\D/g, '')

    // a data mínima é hoje
    const hoje = new Date()
    f.data.min = new Date(hoje.getTime() - hoje.getTimezoneOffset() * 60000).toISOString().slice(0, 10)

    // máscara do WhatsApp: (11) 91234-5678
    f.whatsapp.addEventListener('input', () => {
      const d = digitos(f.whatsapp.value).slice(0, 11)
      let v = d
      if (d.length > 2) v = `(${d.slice(0, 2)}) ${d.slice(2)}`
      if (d.length > 6) v = `(${d.slice(0, 2)}) ${d.slice(2, d.length - 4)}-${d.slice(-4)}`
      f.whatsapp.value = v
    })
    f.criancas.addEventListener('input', () => (f.criancas.value = digitos(f.criancas.value).slice(0, 4)))

    const regras = {
      nome: (v) => v.trim().length >= 2 || 'Digite seu nome.',
      whatsapp: (v) => [10, 11].includes(digitos(v).length) || 'Digite o WhatsApp com DDD.',
      tipo: (v) => !!v || 'Escolha o tipo de evento.',
      data: (v) => !!v || 'Escolha a data da festa.',
      aceite: (_, el) => el.checked || 'Marque a autorização pra gente poder responder.',
    }
    const conferir = (nome) => {
      const el = f[nome]
      const r = regras[nome](el.value, el)
      const erro = document.getElementById(`f-${nome}-erro`)
      const ok = r === true
      el.setAttribute('aria-invalid', String(!ok))
      if (erro) erro.textContent = ok ? '' : r
      return ok
    }
    let tentou = false
    form.addEventListener('input', (e) => tentou && e.target.name in regras && conferir(e.target.name))
    form.addEventListener('change', (e) => tentou && e.target.name in regras && conferir(e.target.name))

    const dataBr = (iso) => iso.split('-').reverse().join('/')
    form.addEventListener('submit', (e) => {
      e.preventDefault()
      tentou = true
      const invalidos = Object.keys(regras).filter((n) => !conferir(n))
      if (invalidos.length) {
        f[invalidos[0]].focus()
        return
      }
      const elenco = [...form.querySelectorAll('input[name="elenco"]:checked')].map((c) => c.value)
      const linhas = [
        'Olá! Vim pelo site do Natal Encantado e quero um orçamento.',
        '',
        `*Nome:* ${f.nome.value.trim()}`,
        `*WhatsApp:* ${f.whatsapp.value}`,
        `*Evento:* ${f.tipo.value}`,
        `*Data:* ${dataBr(f.data.value)}${f.horario.value ? ` às ${f.horario.value}` : ''}`,
      ]
      if (f.criancas.value) linhas.push(`*Crianças:* ${f.criancas.value}`)
      if (elenco.length) linhas.push(`*Elenco:* ${elenco.join(', ')}`)
      const obs = f.mensagem.value.trim()
      if (obs) linhas.push(`*Mensagem:* ${obs}`)
      const link = `https://wa.me/${numero}?text=${encodeURIComponent(linhas.join('\n'))}`
      enviar.setAttribute('aria-busy', 'true')
      const aba = window.open(link, '_blank', 'noopener')
      reserva.href = link
      sucesso.hidden = false
      setTimeout(() => enviar.removeAttribute('aria-busy'), 1200)
      ;(window.dataLayer = window.dataLayer || []).push({ event: 'formulario_enviado', tipo: f.tipo.value, elenco: elenco.join(', ') })
      if (typeof window.fbq === 'function') window.fbq('track', 'Lead', { tipo: f.tipo.value })
      if (!aba) sucesso.focus?.()
    })
  }
})()
