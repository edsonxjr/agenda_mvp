<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="layout">
    <div class="page-content">
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
.layout {
  font-family: sans-serif;
  max-width: 800px;
  margin: 0 auto;
  color: #333;
}

header {
  background-color: #f8f9fa;
  padding: 15px;
  margin-bottom: 30px;
  border-bottom: 1px solid #ddd;
}

nav {
  display: flex;
  gap: 15px;
  justify-content: center;
}

nav a {
  text-decoration: none;
  color: #666;
  font-weight: bold;
  padding: 5px 10px;
}

nav a.router-link-active {
  color: #2563eb;
  background: #eef2ff;
  border-radius: 5px;
}
</style>