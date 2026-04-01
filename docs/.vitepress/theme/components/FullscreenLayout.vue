<template>
  <div class="fullscreen-iframe">
    <iframe
      :src="src"
      width="100%"
      height="100%"
      frameborder="0"
      allow="autoplay"
    />
  </div>
</template>

<script setup>
defineProps({
  src: {
    type: String,
    required: true
  }
})
</script>

<style scoped>
.fullscreen-iframe {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  background: #fff;
}

.fullscreen-iframe iframe {
  display: block;
  border: none;
}
</style>
