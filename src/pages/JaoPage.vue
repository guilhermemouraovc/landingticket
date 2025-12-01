<template>
  <q-page class="flex flex-center">
    <q-spinner-dots size="50px" color="warning" />
  </q-page>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useInfluencerTracking } from 'src/composables/useInfluencerTracking'

const router = useRouter()
const { saveInfluencer } = useInfluencerTracking()

onMounted(() => {
  // Salva o tracking do influenciador
  saveInfluencer('jao')

  // Redireciona para a home
  router.replace('/')
})
</script>

