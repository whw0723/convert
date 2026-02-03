<script setup lang="ts">
import ContentConverter from './components/ContentConverter.vue'
</script>

<template>
  <div class="app-container">
    <ContentConverter />
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  background: linear-gradient(180deg, #f5f7fa 0%, #e4e7ed 100%);
  padding: 40px 20px;
}
</style>
