<script setup lang="ts">
interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
}

// 1. ADICIONADO: 'computed' na importação
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/contacts';
const contacts = ref<Contact[]>([]);

// 2. ADICIONADO: Variável que o seu input pede
const searchTerm = ref('');

// 3. ADICIONADO: Variável que o seu v-if pede
const filteredContacts = computed(() => {
  // Lógica mínima: se não tiver busca, retorna tudo
  if (searchTerm.value === '') return contacts.value;
  // Senão, filtra pelo nome
  return contacts.value.filter(contact => 
    contact.name.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

const fetchContacts = async () => {
  try {
    const response = await axios.get(API_URL);
    contacts.value = response.data;
  } catch (error) {
    console.error(error);
  }
};

onMounted(() => { fetchContacts(); });
</script>

<template>
  <div class="container">
    <!-- 1. CABEÇALHO -->

    <div class="header">
      <h2>Meus Contatos</h2>
      <p>{{ contacts.length }} contatos salvos</p>
    </div>

    <!-- 2. BARRA DE AÇÕES -->

    <div class="actioins-bar">
      <input type="text" placeholder="Buscar..." v-model="searchTerm">
      <button> Adicionar </button>
    </div>

    <!-- 3. A LISTA DE CARTÕES -->

    <div class="contact-list">
      <p v-if="filteredContacts.length === 0">Nenhum contato encontrado.</p>
    </div>


  </div>

</template>

<style></style>