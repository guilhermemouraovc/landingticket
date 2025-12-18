import { onMounted, ref } from 'vue'

/**
 * Composable para gerenciar SEO dinamicamente
 * Permite atualizar meta tags, Open Graph, Twitter Cards e structured data
 * Compatível com Quasar Framework usando manipulação direta do DOM
 */
export function useSEO(options = {}) {
  const seoOptions = ref({
    title: options.title || 'Ticketpe - Descubra os Melhores Eventos em Pernambuco',
    description:
      options.description ||
      'Descubra e reserve ingressos para os melhores eventos em Pernambuco. Shows, festas, teatro, esportes e muito mais. Sua experiência começa aqui no Ticketpe!',
    image: options.image || 'https://ticketpe.com.br/icon-512.png',
    url: options.url || 'https://ticketpe.com.br',
    type: options.type || 'website',
    keywords:
      options.keywords ||
      'eventos, ingressos, Pernambuco, Recife, shows, festas, teatro, entretenimento, cultura',
    canonical: options.canonical || null,
    structuredData: options.structuredData || null,
    noindex: options.noindex || false,
  })

  // Função para calcular valores derivados
  const getCanonicalUrl = () => {
    return (
      seoOptions.value.canonical ||
      (seoOptions.value.url && seoOptions.value.url !== 'https://ticketpe.com.br'
        ? seoOptions.value.url
        : 'https://ticketpe.com.br/')
    )
  }

  const getFullTitle = () => {
    const title = seoOptions.value.title
    return title.includes('Ticketpe') ? title : `${title} | Ticketpe`
  }

  // Função para atualizar ou criar meta tag
  const updateMetaTag = (nameOrProperty, value, isProperty = false) => {
    if (typeof document === 'undefined') return

    const attribute = isProperty ? 'property' : 'name'
    const selector = `meta[${attribute}="${nameOrProperty}"]`

    let element = document.querySelector(selector)
    if (!element) {
      element = document.createElement('meta')
      element.setAttribute(attribute, nameOrProperty)
      document.head.appendChild(element)
    }
    element.setAttribute('content', value)
  }

  // Função para atualizar ou criar link tag
  const updateLinkTag = (rel, href) => {
    if (typeof document === 'undefined') return

    let element = document.querySelector(`link[rel="${rel}"]`)
    if (!element) {
      element = document.createElement('link')
      element.setAttribute('rel', rel)
      document.head.appendChild(element)
    }
    element.setAttribute('href', href)
  }

  // Função para atualizar structured data
  const updateStructuredData = (data, index = 0) => {
    if (typeof document === 'undefined' || !data) return

    // Remove structured data antigo com o mesmo índice
    const existingScript = document.querySelector(
      `script[type="application/ld+json"][data-seo-dynamic="${index}"]`,
    )
    if (existingScript) {
      existingScript.remove()
    }

    // Adiciona novo structured data
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.setAttribute('data-seo-dynamic', String(index))
    script.textContent = JSON.stringify(data)
    document.head.appendChild(script)
  }

  // Função para limpar todos os structured data dinâmicos
  const clearStructuredData = () => {
    if (typeof document === 'undefined') return
    const existingScripts = document.querySelectorAll(
      'script[type="application/ld+json"][data-seo-dynamic]',
    )
    existingScripts.forEach((script) => script.remove())
  }

  // Função para aplicar todas as meta tags
  const applySEOTags = () => {
    if (typeof document === 'undefined') return

    const opts = seoOptions.value
    const fullTitle = getFullTitle()
    const canonicalUrl = getCanonicalUrl()

    // Atualiza título
    document.title = fullTitle

    // Meta tags básicas
    updateMetaTag('description', opts.description)
    updateMetaTag('keywords', opts.keywords)
    updateMetaTag('author', 'Ticketpe')
    updateMetaTag('robots', opts.noindex ? 'noindex, nofollow' : 'index, follow')

    // Open Graph / Facebook
    updateMetaTag('og:type', opts.type, true)
    updateMetaTag('og:url', opts.url, true)
    updateMetaTag('og:title', fullTitle, true)
    updateMetaTag('og:description', opts.description, true)
    updateMetaTag('og:image', opts.image, true)
    updateMetaTag('og:image:alt', fullTitle, true)
    updateMetaTag('og:image:width', '1200', true)
    updateMetaTag('og:image:height', '630', true)
    updateMetaTag('og:site_name', 'Ticketpe', true)
    updateMetaTag('og:locale', 'pt_BR', true)

    // Twitter Card
    updateMetaTag('twitter:card', 'summary_large_image')
    updateMetaTag('twitter:url', opts.url)
    updateMetaTag('twitter:title', fullTitle)
    updateMetaTag('twitter:description', opts.description)
    updateMetaTag('twitter:image', opts.image)

    // Canonical URL
    updateLinkTag('canonical', canonicalUrl)

    // Structured data
    // Limpa structured data antigo primeiro
    clearStructuredData()

    if (opts.structuredData) {
      // Se é array, adiciona múltiplos scripts
      if (Array.isArray(opts.structuredData)) {
        opts.structuredData.forEach((data, index) => {
          updateStructuredData(data, index)
        })
      } else {
        updateStructuredData(opts.structuredData, 0)
      }
    }
  }

  // Aplica as tags quando o componente é montado
  onMounted(() => {
    applySEOTags()
  })

  return {
    updateSEO: (newOptions) => {
      // Permite atualizar SEO dinamicamente
      Object.assign(seoOptions.value, newOptions)
      applySEOTags()
    },
  }
}

/**
 * Helper para criar structured data de Event
 * @param {Object} event - Dados do evento
 * @returns {Object} Structured data no formato Schema.org
 */
export function createEventStructuredData(event) {
  if (!event) return null

  const baseUrl = 'https://ticketpe.com.br'
  const eventUrl = event.shareUrl || `${baseUrl}/event/${event.slug || event.id}`

  // Formata data no formato ISO 8601
  const formatDate = (dateString) => {
    if (!dateString) return null
    try {
      const date = new Date(dateString)
      return date.toISOString()
    } catch {
      return null
    }
  }

  // Cria ofertas (preços)
  const offers = []
  if (event.days && event.days.length > 0) {
    event.days.forEach((day) => {
      if (day.hasPrice && day.fullPrice) {
        offers.push({
          '@type': 'Offer',
          price: day.fullPrice,
          priceCurrency: 'BRL',
          availability: 'https://schema.org/InStock',
          url: eventUrl,
          validFrom: formatDate(day.date) || formatDate(event.start_date),
        })
      }
    })
  } else if (event.hasPrice && event.fullPrice) {
    offers.push({
      '@type': 'Offer',
      price: event.fullPrice,
      priceCurrency: 'BRL',
      availability: 'https://schema.org/InStock',
      url: eventUrl,
      validFrom: formatDate(event.start_date),
    })
  }

  // Se não há preço, adiciona oferta genérica
  if (offers.length === 0) {
    offers.push({
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'BRL',
      availability: 'https://schema.org/InStock',
      url: eventUrl,
    })
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description: event.description || event.title,
    image: event.image || `${baseUrl}/icon-512.png`,
    url: eventUrl,
    startDate: formatDate(event.start_date) || formatDate(event.date),
    endDate: formatDate(event.end_date) || formatDate(event.start_date) || formatDate(event.date),
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: event.location || 'Local a definir',
      address: {
        '@type': 'PostalAddress',
        addressLocality: event.city || 'Recife',
        addressRegion: event.state || 'PE',
        addressCountry: 'BR',
      },
    },
    organizer: {
      '@type': 'Organization',
      name: 'Ticketpe',
      url: baseUrl,
    },
    offers: offers.length === 1 ? offers[0] : offers,
  }
}

/**
 * Helper para criar structured data de BreadcrumbList
 * @param {Array} breadcrumbs - Array de {label, url}
 * @returns {Object} Structured data no formato Schema.org
 */
export function createBreadcrumbStructuredData(breadcrumbs) {
  if (!breadcrumbs || breadcrumbs.length === 0) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.label,
      item: crumb.url || null,
    })),
  }
}
