# Influencer Meta Tags - Server-Side Implementation

## Overview

Meta tags para compartilhamento em redes sociais (Instagram, Facebook, Twitter) agora são **injetadas server-side** pelo middleware SSR, permitindo que bots de crawling vejam as informações personalizadas para cada influenciador.

## Architecture

### Files

1. **src-ssr/middleware/influencer-meta-tags.js**
   - Middleware SSR que intercepta requisições para rotas de influenciador
   - Injeta meta tags dinâmicas no HTML antes de enviar ao cliente/bot
   - Valida slug contra lista de influenciadores

2. **src/pages/InfluencerPage.vue**
   - Página que recebe o slug da URL (ex: /:slug)
   - Salva influenciador no localStorage
   - Redireciona para homepage (/)
   - Mantém setMetaTags() para navegação client-side

3. **quasar.config.js**
   - Registra middleware na fila de processamento (antes de 'render')

## How It Works

### Request Flow (Bot Crawling)

```
Bot request: GET /julia-souto
    ↓
Express/Node server receives request
    ↓
influencer-meta-tags.js middleware checks if slug is valid
    ↓
If valid: Injects meta tags into HTML response
    ↓
Bot receives HTML with personalized meta tags
    ↓
Bot parses og:title, og:description, og:image, etc.
    ↓
Bot renders preview with influencer's name
```

### Request Flow (User Navigation)

```
User clicks link: /julia-souto
    ↓
Browser requests HTML from server
    ↓
influencer-meta-tags.js middleware injects meta tags (for SEO)
    ↓
Vue app hydrates and mounts InfluencerPage component
    ↓
onMounted hook:
  - Saves influencer to localStorage
  - Sets client-side meta tags
  - Calls router.replace('/') to redirect to homepage
    ↓
User sees homepage with influencer tracking active
```

## Testing

### 1. Test Bot Crawling (Meta Tags in Response)

```bash
# Check if meta tags are in the HTML response
curl -s https://ticketpe.com.br/julia-souto | grep -A2 "og:title"

# Expected output:
# <meta property="og:title" content="Descubra os melhores eventos em Pernambuco - Recomendado pela Julia Souto" />
```

### 2. Test Instagram Preview

1. Go to Meta's Debug Tool: https://developers.facebook.com/tools/debug/
2. Enter URL: `https://ticketpe.com.br/julia-souto`
3. Click "Scrape Again"
4. Verify preview shows Julia Souto's name in og:title and og:description

### 3. Test Client-Side Navigation

1. Open browser DevTools
2. Navigate to `http://localhost:9000/julia-souto`
3. Check Console: No errors
4. Verify redirect to homepage
5. Check localStorage:
   ```javascript
   localStorage.getItem('landingticket_influencer')
   // Should return: "Julia Souto"
   ```

### 4. Test Invalid Slug

```bash
curl -s https://ticketpe.com.br/invalid-slug
# Should redirect to /404
```

## Adding New Influencers

Novos influenciadores são adicionados em `src/composables/useInfluencerTracking.js`:

```javascript
export const INFLUENCER_NAMES = {
  'new-influencer': 'New Influencer Name',
  // ...
}
```

O middleware automaticamente reconhecerá o novo slug e injetará meta tags quando necessário.

## Implementation Details

### Meta Tags Injetadas

Para cada influenciador válido:

```html
<title>Ticketpe - Compartilhado por {INFLUENCER_NAME}</title>
<meta property="og:title" content="Descubra os melhores eventos em Pernambuco - Recomendado pela {INFLUENCER_NAME}" />
<meta property="og:description" content="Compre ingressos para eventos incríveis em Pernambuco através da recomendação de {INFLUENCER_NAME}. Acesso exclusivo e ofertas especiais no Ticketpe!" />
<meta property="og:url" content="https://ticketpe.com.br/{slug}" />
<meta property="og:image" content="https://ticketpe.com.br/icon-512.png" />
<meta property="og:type" content="website" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Descubra os melhores eventos - {INFLUENCER_NAME}" />
<meta name="twitter:description" content="Compre ingressos recomendados pela {INFLUENCER_NAME}" />
<link rel="canonical" href="https://ticketpe.com.br/{slug}" />
```

### Why Server-Side?

- ✅ Bots fazem crawling server-side (não executam JavaScript)
- ✅ Meta tags devem estar no HTML servido pelo servidor
- ✅ Redirecionamento JavaScript não interfere com crawling
- ✅ SEO melhorado com URLs canônicas específicas por influenciador
- ❌ setTimeout é ineficaz para bots

## Monitoring

Para monitorar se meta tags estão sendo injetadas corretamente:

1. Habilite logging no middleware
2. Adicione ao quasar.config.js:
   ```javascript
   // Quando Influencer-META-Tags middleware detecta e injeta tags
   console.log(`[Influencer Meta Tags] Slug: ${slug}, Name: ${influencerName}`)
   ```

3. Verifique logs em produção para requisições de bots

## Troubleshooting

### Meta tags não aparecem no bot

1. Verify slug exists in `INFLUENCER_NAMES`
2. Check if middleware is registered in `quasar.config.js`
3. Verify middleware file exists: `src-ssr/middleware/influencer-meta-tags.js`
4. Restart dev server after changes

### User not seeing homepage redirect

1. Check browser console for errors
2. Verify localStorage is not disabled
3. Check if influencer slug is valid

### Instagram preview still showing generic content

1. Use Facebook's Debug Tool to rescrape
2. Wait 24-48 hours for cache to clear
3. Verify meta tags are in HTML response with `curl`
