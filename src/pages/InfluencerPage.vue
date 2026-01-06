<template>
  <q-page class="flex flex-center">
    <q-spinner-dots size="50px" color="warning" />
  </q-page>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useInfluencerTracking, INFLUENCER_SLUGS } from 'src/composables/useInfluencerTracking'

const router = useRouter()
const route = useRoute()
const { saveInfluencer } = useInfluencerTracking()

onMounted(() => {
  const slug = route.params.slug

  // Validate if it's a valid influencer slug
  if (slug && INFLUENCER_SLUGS.has(slug)) {
    // Save influencer tracking
    saveInfluencer(slug)
    // Redirect to home
    router.replace('/')
  } else {
    // Invalid slug, redirect to 404
    router.replace('/404')
  }
})
</script>
