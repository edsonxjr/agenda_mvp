<script setup lang="ts">
// Importamos APENAS as ferramentas do roteador
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="layout">
    
    <header>
      <nav>
        <RouterLink to="/">🏠 Home</RouterLink>
        <RouterLink to="/meus-contatos">📋 Lista</RouterLink>
        <RouterLink to="/novo-contato">➕ Novo</RouterLink>
      </nav>
    </header>

    <div class="page-content">
      <RouterView />
    </div>

  </div>
</template>

<style scoped>
/* (Mantenha o CSS que já estava aqui, ou use este básico) */
.layout {
  font-family: sans-serif;
  max-width: 800px;
  margin: 0 auto;
}
header {
  background-color: #f8f9fa;
  padding: 15px;
  margin-bottom: 20px;
  border-bottom: 1px solid #ddd;
}
nav {
  display: flex;
  gap: 15px;
  justify-content: center;
}
nav a {
  text-decoration: none;
  color: #333;
  font-weight: bold;
}
nav a.router-link-active {
  color: #2563eb;
}
</style>