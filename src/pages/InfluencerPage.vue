<template>
  <q-page class="flex flex-center">
    <q-spinner-dots size="50px" color="warning" />
  </q-page>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useHead } from 'quasar'
import { useInfluencerTracking, INFLUENCER_SLUGS, INFLUENCER_NAMES } from 'src/composables/useInfluencerTracking'

const router = useRouter()
const route = useRoute()
const { saveInfluencer } = useInfluencerTracking()

onMounted(() => {
  const slug = route.params.slug

  // Validate if it's a valid influencer slug
  if (slug && INFLUENCER_SLUGS.has(slug)) {
    const influencerName = INFLUENCER_NAMES[slug]
    const baseUrl = 'https://ticketpe.com.br'
    const influencerUrl = `${baseUrl}/${slug}`

    // Set dynamic meta tags for social sharing
    useHead({
      title: `Ticketpe - Compartilhado por ${influencerName}`,
      meta: {
        ogTitle: {
          property: 'og:title',
          content: `Descubra os melhores eventos em Pernambuco - Recomendado pela ${influencerName}`,
        },
        ogDescription: {
          property: 'og:description',
          content: `Compre ingressos para eventos incríveis em Pernambuco através da recomendação de ${influencerName}. Acesso exclusivo e ofertas especiais no Ticketpe!`,
        },
        ogUrl: {
          property: 'og:url',
          content: influencerUrl,
        },
        ogImage: {
          property: 'og:image',
          content: `${baseUrl}/icon-512.png`,
        },
        ogType: {
          property: 'og:type',
          content: 'website',
        },
        twitterCard: {
          name: 'twitter:card',
          content: 'summary_large_image',
        },
        twitterTitle: {
          name: 'twitter:title',
          content: `Descubra os melhores eventos - ${influencerName}`,
        },
        twitterDescription: {
          name: 'twitter:description',
          content: `Compre ingressos recomendados pela ${influencerName}`,
        },
      },
      link: {
        canonical: {
          rel: 'canonical',
          href: influencerUrl,
        },
      },
    })

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
