<script setup lang="ts">
import ContactList from '../components/ContactList.vue';
import { RouterLink } from 'vue-router';
</script>

<template>
  <div class="page-container">
    
    <div class="back-link">
      <RouterLink to="/" class="btn-back">⬅ Voltar ao Início</RouterLink>
    </div>

    <h1>📋 Gerenciar Contatos</h1>

    <ContactList />
    
  </div>
</template>

<style scoped>
.page-container {
  padding-top: 20px;
  max-width: 800px; /* Limita a largura para ficar alinhado */
  margin: 0 auto;   /* Centraliza */
}

.back-link {
  margin-bottom: 20px;
}

.btn-back {
  text-decoration: none;
  color: #64748b;
  font-weight: 600;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 8px 12px;
  border-radius: 6px;
  transition: background 0.2s;
}

.btn-back:hover {
  background-color: #f1f5f9;
  color: #334155;
}

h1 {
  margin-bottom: 20px;
  color: #1e293b;
  font-size: 24px;
}
</style>