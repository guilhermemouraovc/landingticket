<template>
  <section class="video-banner-section">
    <div class="video-banner-wrap">
      <a
        :href="link"
        :aria-label="ariaLabel"
        :target="isExternalLink ? '_blank' : undefined"
        :rel="isExternalLink ? 'noopener noreferrer' : undefined"
        class="video-banner"
      >
        <video
          ref="videoElement"
          muted
          loop
          playsinline
          preload="auto"
          class="banner-video"
        >
          <source :src="videoSrc" type="video/webm" />
          Your browser does not support the video tag.
        </video>
      </a>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'

const props = defineProps({
  video: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  poster: {
    type: String,
    default: '',
  },
  ariaLabel: {
    type: String,
    default: 'Clique para acessar o grupo do WhatsApp',
  },
})

const videoElement = ref(null)

const videoSrc = computed(() => {
  return props.video
})

// Determine if link is external (starts with http/https)
const isExternalLink = computed(() => {
  return props.link.startsWith('http://') || props.link.startsWith('https://')
})

onMounted(() => {
  if (videoElement.value) {
    // Attempt to play the video
    const playPromise = videoElement.value.play()

    if (playPromise !== undefined) {
      playPromise
        .catch(() => {
          // Autoplay was prevented. iOS and some browsers require user interaction
          // Listen for user interaction to start playback
          const startPlayback = () => {
            videoElement.value.play().catch(() => {
              // Silently fail if play fails
            })
            document.removeEventListener('touchstart', startPlayback)
            document.removeEventListener('click', startPlayback)
          }

          // Add event listeners for user interaction
          document.addEventListener('touchstart', startPlayback, { once: true })
          document.addEventListener('click', startPlayback, { once: true })
        })
    }

    // Ensure video continues looping even if it stalls
    videoElement.value.addEventListener('ended', () => {
      videoElement.value.currentTime = 0
      videoElement.value.play().catch(() => {
        // Silently fail if play fails
      })
    })
  }
})
</script>

<style scoped>
.video-banner-section {
  background-color: #2a3447;
  padding: 20px 0;
  overflow: hidden;
}

.video-banner-wrap {
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  padding: 0 80px;
  box-sizing: border-box;
  background-color: #2a3447;
}

.video-banner {
  display: block;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 100%;
  background-color: #000;
  aspect-ratio: 1920 / 200;
  text-decoration: none;
  cursor: pointer;
  /* Prevent any hover effects and transitions */
  transition: none;
}

.video-banner:hover {
  /* Explicitly disable hover effects */
  opacity: 1;
  transform: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.banner-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Mobile */
@media (max-width: 599px) {
  .video-banner-section {
    padding: 10px 0;
    overflow: hidden;
  }

  .video-banner-wrap {
    padding: 0 16px;
    max-width: 100%;
  }

  .video-banner {
    max-width: 100%;
    aspect-ratio: 1920 / 200;
    border-radius: 8px;
  }

  .banner-video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

/* Tablet */
@media (min-width: 600px) and (max-width: 1023px) {
  .video-banner-section {
    overflow: hidden;
  }

  .video-banner-wrap {
    padding: 0 40px;
    max-width: 100%;
  }

  .video-banner {
    max-width: 100%;
    aspect-ratio: 1920 / 200;
  }

  .banner-video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

/* Desktop médio */
@media (min-width: 1024px) and (max-width: 1439px) {
  .video-banner-section {
    overflow: hidden;
  }

  .video-banner-wrap {
    padding: 0 40px;
    max-width: 100%;
  }

  .video-banner {
    max-width: 100%;
    aspect-ratio: 1920 / 200;
  }

  .banner-video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

/* Desktop grande */
@media (min-width: 1440px) {
  .video-banner-section {
    overflow: hidden;
  }

  .video-banner-wrap {
    max-width: 1760px;
  }

  .video-banner {
    aspect-ratio: 1920 / 200;
  }

  .banner-video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
