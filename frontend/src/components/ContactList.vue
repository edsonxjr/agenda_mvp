<script setup lang="ts">
interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
}

import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/contacts';
const contacts = ref<Contact[]>([]);
const searchTerm = ref('');

// Filtro de busca
const filteredContacts = computed(() => {
  if (searchTerm.value === '') return contacts.value;
  return contacts.value.filter(contact => 
    contact.name.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

const fetchContacts = async () => {
  try {
    const response = await axios.get(API_URL);
    contacts.value = response.data;
  } catch (error) { console.error(error); }
};

const getInitials = (name: string) => {
  if (!name) return '?'; // Proteção se o nome vier vazio
  const parts = name.trim().split(' ');
  
  if (parts.length >= 2) {
    // O '?' diz: "Se existir, pegue o caractere. Se não, não quebre."
    return (parts[0]?.charAt(0) + parts[1]?.charAt(0)).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}


const deleteContact = async (id: number) => {
  if (!confirm('Tem certeza?')) return;
  try {
    await axios.delete(`${API_URL}/${id}`);
    contacts.value = contacts.value.filter(c => c.id !== id);
  } catch (error) { alert('Erro ao deletar'); }
};

onMounted(() => { fetchContacts(); });
</script>

<template>
  <div class="container">
    
    <div class="header">
      <h2>Meus Contatos</h2>
      <p>{{ contacts.length }} contatos salvos</p>
    </div>

    <div class="actions-bar">
      <input type="text" placeholder="Buscar..." v-model="searchTerm">
      <button onclick="document.getElementById('name').focus()">+ Adicionar</button>
    </div>

    <div class="contact-list">
       <p v-if="filteredContacts.length === 0">Nenhum contato encontrado.</p>

       <div v-for="contact in filteredContacts" :key="contact.id" class="card">
          
          <div class="avatar">{{ getInitials(contact.name) }}</div>
          
          <div class="info">
            <h3>{{ contact.name }}</h3>
            <span>{{ contact.email }}</span>
            <span>{{ contact.phone }}</span>
          </div>

          <div class="actions">
            <button class="icon-btn">✏️</button>
            <button class="icon-btn" @click="deleteContact(contact.id)">🗑️</button>
          </div>

       </div>
       </div>

  </div>
</template>

<style scoped>
/* Cole o CSS aqui depois para ficar bonito */
</style>