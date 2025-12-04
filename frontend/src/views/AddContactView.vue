<script setup lang="ts">
import ContactForm from '../components/ContactForm.vue';
import { RouterLink } from 'vue-router';
</script>

<template>
  <div class="page-container">
    
    <div class="back-link">
      <RouterLink to="/" class="btn-back">⬅ Voltar ao Início</RouterLink>
    </div>

    <ContactForm />
    
  </div>
</template>

<style scoped>
.page-container {
  padding-top: 20px;
}

/* Mesmo estilo para manter padrão */
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
</style>