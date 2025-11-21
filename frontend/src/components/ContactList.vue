<script setup lang="ts">
interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
}

import { ref, onMounted } from 'vue';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/contacts';
const contacts = ref<Contact[]>([]);

// BUSCAR
const fetchContacts = async () => {
  try {
    const response = await axios.get(API_URL);
    contacts.value = response.data;
  } catch (error) {
    console.error('Erro ao buscar:', error);
  }
};

// DELETAR
const deleteContact = async (id: number) => {
  if (!confirm('Tem certeza?')) return;
  try {
    await axios.delete(`${API_URL}/${id}`);
    contacts.value = contacts.value.filter(c => c.id !== id);
    alert('Deletado!');
  } catch (error) {
    console.error('Erro ao deletar:', error);
  }
};

onMounted(() => {
  fetchContacts();
});
</script>

<template>
  <div class="list-container">
    <h2>
      Lista de Contatos 
      <span v-if="contacts.length > 0">({{ contacts.length }})</span>
    </h2>
    
    <p v-if="contacts.length === 0">Nenhum contato encontrado.</p>
    
    <ul>
      <li v-for="contact in contacts" :key="contact.id">
        <div class="info">
          <strong>{{ contact.name }}</strong>
          <p>📧 {{ contact.email }}</p>
          <p>📱 {{ contact.phone }}</p>
        </div>
        <button @click="deleteContact(contact.id)" class="delete-btn">Excluir</button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.list-container { margin-top: 30px; }
ul { padding: 0; list-style: none; }
li { 
  border: 1px solid #ddd; 
  padding: 15px; 
  margin-bottom: 10px; 
  border-radius: 8px; 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
}
strong { display: block; margin-bottom: 5px; font-size: 1.1em; }
p { margin: 2px 0; color: #555; }
.delete-btn { 
  background: #ff4444; 
  color: white; 
  border: none; 
  padding: 8px 12px; 
  border-radius: 4px; 
  cursor: pointer; 
}
</style>