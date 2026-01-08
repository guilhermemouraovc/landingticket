/**
 * SSR Middleware para gerar meta tags dinâmicas para URLs de influenciadores
 * Intercepta requisições para /:slug e injeta meta tags personalizadas no HTML
 *
 * Bots do Facebook/Instagram fazem crawl server-side, então as meta tags devem
 * estar presentes no HTML servido pelo servidor, não apenas no DOM do cliente.
 */

import { INFLUENCER_NAMES } from '../../src/composables/useInfluencerTracking.js'

const INFLUENCER_SLUGS = new Set(Object.keys(INFLUENCER_NAMES))

export default function (ssrContext) {
  // Hook para processar a resposta HTML antes de enviar ao cliente/bot
  ssrContext.onSend.push((context) => {
    const slug = context.req.url.split('/')[1] // Extrai o slug da URL

    // Verifica se é uma rota válida de influenciador
    if (slug && INFLUENCER_SLUGS.has(slug) && context.res.getHeader('content-type')?.includes('text/html')) {
      const influencerName = INFLUENCER_NAMES[slug]
      const baseUrl = 'https://ticketpe.com.br'
      const influencerUrl = `${baseUrl}/${slug}`

      // HTML das meta tags dinâmicas a serem injetadas
      const metaTags = `
    <title>Ticketpe - Compartilhado por ${influencerName}</title>
    <meta property="og:title" content="Descubra os melhores eventos em Pernambuco - Recomendado pela ${influencerName}" />
    <meta property="og:description" content="Compre ingressos para eventos incríveis em Pernambuco através da recomendação de ${influencerName}. Acesso exclusivo e ofertas especiais no Ticketpe!" />
    <meta property="og:url" content="${influencerUrl}" />
    <meta property="og:image" content="${baseUrl}/icon-512.png" />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Descubra os melhores eventos - ${influencerName}" />
    <meta name="twitter:description" content="Compre ingressos recomendados pela ${influencerName}" />
    <link rel="canonical" href="${influencerUrl}" />`

      // Injeta as meta tags no HTML antes do fechamento da tag </head>
      const html = context.body
      if (typeof html === 'string') {
        context.body = html.replace(
          '</head>',
          `${metaTags}
  </head>`
        )
      }
    }
  })
}
