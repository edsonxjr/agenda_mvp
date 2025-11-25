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
  if (!name) return '?';
  const parts = name.trim().split(' ').filter(part => part.length > 0);
  
  if (parts.length >= 2) {
    const first = parts[0]?.[0] || '';
    const second = parts[1]?.[0] || '';
    return (first + second).toUpperCase();
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
      <button onclick="document.getElementById('name').focus()"> Adicionar </button>
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
.container {
  font-family: 'Segoe UI', sans-serif; /* Fonte mais bonita */
  color: #333;
  max-width: 800px;
  margin: 0 auto;
  padding-bottom: 50px;
}

.header { margin-bottom: 25px; }
.header h2 { margin: 0; }
.header p { margin: 5px 0 0 0; color: #666; font-size: 14px; }

.actions-bar {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

input {
  flex-grow: 1;
  padding: 12px 15px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
}
input:focus { border-color: #2563eb; }

.btn-add {
  background-color: #2563eb;
  color: white;
  border: none;
  padding: 0 25px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer; 
}
.btn-add:hover { background-color: #1d4ed8; }

.contact-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.card {
  background: white;
  display: flex;
  
  align-items: center; 
  padding: 16px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  gap: 15px; 
}

.avatar {
  width: 45px; height: 45px;
  border-radius: 50%;
  background-color: #dbeafe;
  color: #1e40af;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  flex-shrink: 0; 
}

.info { flex-grow: 1; }
.info h3 { margin: 0 0 5px 0; font-size: 16px; }
.info span { display: block; font-size: 13px; color: #666; }

.actions { display: flex; gap: 8px; }

.icon-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
}
.icon-btn:hover { background-color: #f1f5f9; }
</style>