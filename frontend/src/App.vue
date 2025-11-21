<script setup lang="ts">
import { ref } from 'vue';
// 1. IMPORTAÇÃO FINAL: Importa os dois componentes que você acabou de escrever
import ContactForm from './components/ContactForm.vue'; 
import ContactList from './components/ContactList.vue'; 

interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
}

const contacts = ref<Contact[]>([]);
</script>

<template>
  <section class="area-contatos">
    
    <div class="topo">


  
      <h1>Minha Agenda</h1>
      <span class="contador">{{ contacts.length }} contatos</span>
    </div>

    <div v-if="contacts.length === 0" class="vazio">
      <p>Nenhum contato encontrado.</p>
    </div>

    <div v-else class="grade-de-cartoes">
       <div v-for="contact in contacts" :key="contact.id" class="cartao">
          </div>
    </div>

  </section>
</template>

<style scoped>
</style>