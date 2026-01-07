<template>
  <section class="video-banner-section">
    <div class="video-banner-wrap">
      <div class="video-banner">
        <video autoplay muted loop playsinline class="banner-video">
          <source :src="videoSrc" type="video/webm" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  video: {
    type: String,
    required: true,
  },
  poster: {
    type: String,
    default: '',
  },
})

const videoSrc = computed(() => {
  return props.video
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
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 100%;
  background-color: #000;
  aspect-ratio: 1920 / 200;
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
