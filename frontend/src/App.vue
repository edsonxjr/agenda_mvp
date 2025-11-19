<script setup lang="ts">
// 1. IMPORTAÇÃO FINAL: Importa os dois componentes que você acabou de escrever
import ContactForm from './components/ContactForm.vue'; 
import ContactList from './components/ContactList.vue'; 
</script>

<template>
  <main>
    <h1>Agenda MVP (Frontend)</h1>
    
    <ContactForm /> 
    
    <ContactList />
  </main>
</template>

<style scoped>
main {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: sans-serif;
}
/* Estilos globais (opcional) */
</style>