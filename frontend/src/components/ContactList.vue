<script setup lang="ts">
interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
}

import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router'; // Importar router para o botão de editar

const router = useRouter(); // Instancia o router
const API_URL = 'http://localhost:3000/api/contacts';
const contacts = ref<Contact[]>([]);
const searchTerm = ref('');

// Filtro de busca
const filteredContacts = computed(() => {
  if (searchTerm.value === '') return contacts.value;
  return contacts.value.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.value.toLowerCase())
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

// Função para navegar para edição
const editContact = (id: number) => {
  router.push(`/editar/${id}`);
}

onMounted(() => { fetchContacts(); });
</script>

<template>
  <div class="container">

    <div class="header">
      <h2>Meus Contatos</h2>
      <p>{{ contacts.length }} contatos salvos</p>
    </div>

    <div class="actions-bar">

      <div class="search-pill">
        <span class="search-icon">🔍</span>

        <input type="text" placeholder="Buscar..." v-model="searchTerm">

        <button class="btn-search-inside">
          Busca
        </button>
      </div>

      <RouterLink to="/novo-contato" class="btn-add">
        + Novo
      </RouterLink>

    </div>

    <div class="contact-list">
      <p v-if="filteredContacts.length === 0" class="empty-msg">
        Nenhum contato encontrado.
      </p>

      <div v-for="contact in filteredContacts" :key="contact.id" class="card">
        <div class="avatar">{{ getInitials(contact.name) }}</div>

        <div class="info">
          <h3>{{ contact.name }}</h3>
          <span class="email">{{ contact.email }}</span>
          <span class="phone">{{ contact.phone }}</span>
        </div>

        <div class="actions">
          <button class="icon-btn edit" @click="editContact(contact.id)">✏️</button>
          <button class="icon-btn delete" @click="deleteContact(contact.id)">🗑️</button>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
/* Container e Header */
.container {
  font-family: 'Segoe UI', sans-serif;
  color: #333;
  max-width: 800px;
  margin: 0 auto;
  padding-bottom: 50px;
}

.header {
  margin-bottom: 25px;
}

.header h2 {
  margin: 0;
  font-size: 24px;
  color: #1e293b;
}

.header p {
  color: #64748b;
  margin: 5px 0 20px 0;
  font-size: 14px;
}

/* --- BARRA DE AÇÕES --- */
.actions-bar {
  display: flex;
  justify-content: center;
  /* Centraliza tudo */
  align-items: center;
  gap: 10px;
  margin-bottom: 30px;
}

/* Cápsula de Busca */
.search-pill {
  display: flex;
  align-items: center;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 50px;
  padding: 4px;
  width: 500px;
  /* Largura fixa */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.02);
  transition: box-shadow 0.2s;
}

.search-pill:focus-within {
  box-shadow: 0 4px 10px rgba(37, 99, 235, 0.15);
  border-color: #bfdbfe;
}

/* IMPORTANTE: Adicionei o CSS da lupa de volta */
.search-icon {
  padding-left: 15px;
  font-size: 16px;
  color: #94a3b8;
  pointer-events: none;
}

.search-pill input {
  border: none;
  background: transparent;
  flex-grow: 1;
  padding: 10px;
  font-size: 15px;
  outline: none;
  color: #333;
}

/* Botão Azul Dentro */
.btn-search-inside {
  background-color: #2563eb;
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 30px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  /* Adicionei transition all */
}

.btn-search-inside:hover {
  background-color: #1d4ed8;
  transform: scale(1.05);
}

/* Botão Novo Fora */
.btn-add {
  background-color: #10b981;
  /* Verde */
  color: white;
  text-decoration: none;
  padding: 10px 20px;
  border-radius: 30px;
  font-weight: 600;
  font-size: 14px;
  white-space: nowrap;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
}

.btn-add:hover {
  background-color: #059669;
  transform: scale(1.05);
  /* Efeito de crescer */
  box-shadow: 0 4px 10px rgba(16, 185, 129, 0.3);
}

/* Cards */
.contact-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.card {
  display: flex;
  align-items: center;
  gap: 15px;
  background: white;
  border: 1px solid #e2e8f0;
  padding: 15px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: transform 0.1s;
}

.card:hover {
  transform: translateY(-2px);
}

.avatar {
  width: 45px;
  height: 45px;
  background-color: #dbeafe;
  color: #1e40af;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  flex-shrink: 0;
}

.info {
  flex-grow: 1;
}

.info h3 {
  margin: 0 0 4px 0;
  font-size: 16px;
}

.info span {
  display: block;
  font-size: 13px;
  color: #64748b;
}

.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 6px;
}

.icon-btn:hover {
  background-color: #f1f5f9;
  border-radius: 4px;
}

.empty-msg {
  text-align: center;
  color: #94a3b8;
  margin-top: 20px;
}
</style>