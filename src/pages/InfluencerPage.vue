<template>
  <q-page class="flex flex-center">
    <q-spinner-dots size="50px" color="warning" />
  </q-page>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useInfluencerTracking, INFLUENCER_SLUGS, INFLUENCER_NAMES } from 'src/composables/useInfluencerTracking'

const router = useRouter()
const route = useRoute()
const { saveInfluencer } = useInfluencerTracking()

function setMetaTags(influencerName, slug) {
  const baseUrl = 'https://ticketpe.com.br'
  const influencerUrl = `${baseUrl}/${slug}`

  // Update page title
  document.title = `Ticketpe - Compartilhado por ${influencerName}`

  // Helper function to set or update meta tag
  const setMeta = (property, content, isProperty = true) => {
    let tag = isProperty
      ? document.querySelector(`meta[property="${property}"]`)
      : document.querySelector(`meta[name="${property}"]`)

    if (!tag) {
      tag = document.createElement('meta')
      if (isProperty) {
        tag.setAttribute('property', property)
      } else {
        tag.setAttribute('name', property)
      }
      document.head.appendChild(tag)
    }
    tag.setAttribute('content', content)
  }

  // Set Open Graph tags
  setMeta('og:title', `Descubra os melhores eventos em Pernambuco - Recomendado pela ${influencerName}`)
  setMeta('og:description', `Compre ingressos para eventos incríveis em Pernambuco através da recomendação de ${influencerName}. Acesso exclusivo e ofertas especiais no Ticketpe!`)
  setMeta('og:url', influencerUrl)
  setMeta('og:image', `${baseUrl}/icon-512.png`)
  setMeta('og:type', 'website')

  // Set Twitter tags
  setMeta('twitter:card', 'summary_large_image', false)
  setMeta('twitter:title', `Descubra os melhores eventos - ${influencerName}`, false)
  setMeta('twitter:description', `Compre ingressos recomendados pela ${influencerName}`, false)

  // Update or create canonical link
  let canonical = document.querySelector('link[rel="canonical"]')
  if (!canonical) {
    canonical = document.createElement('link')
    canonical.setAttribute('rel', 'canonical')
    document.head.appendChild(canonical)
  }
  canonical.setAttribute('href', influencerUrl)
}

onMounted(() => {
  const slug = route.params.slug

  // Validate if it's a valid influencer slug
  if (slug && INFLUENCER_SLUGS.has(slug)) {
    const influencerName = INFLUENCER_NAMES[slug]

    // Set meta tags
    setMetaTags(influencerName, slug)

    // Save influencer tracking
    saveInfluencer(slug)

    // Small delay to ensure meta tags are set before redirect
    // Facebook/Instagram bots need time to read the tags
    setTimeout(() => {
      router.replace('/')
    }, 100)
  } else {
    // Invalid slug, redirect to 404
    router.replace('/404')
  }
})
</script>
