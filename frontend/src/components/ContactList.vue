<script setup lang="ts">
// 1. Interfaces
interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  is_favorite?: boolean;
  category_name?: string;
}

interface Stat {
  category: string | null;
  total: number;
}

import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import BaseModal from './BaseModal.vue';
import ContactForm from './ContactForm.vue';

const API_URL = import.meta.env.VITE_API_URL;

const contacts = ref<Contact[]>([]);
const stats = ref<Stat[]>([]); // <--- Onde guardamos os números
const searchTerm = ref('');
const showModal = ref(false);
const editingId = ref<number | undefined>(undefined);

// --- DASHBOARD: BUSCAR ESTATÍSTICAS ---
const fetchStats = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/stats');
    stats.value = response.data;
  } catch (error) {
    console.error('Erro ao carregar estatísticas', error);
  }
};

// --- CONTATOS ---
const fetchContacts = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/contacts');
    contacts.value = response.data;
    fetchStats(); // Atualiza os números também
  } catch (error) { console.error(error); }
};

const toggleFavorite = async (contact: any) => {
  const oldValue = contact.is_favorite;
  contact.is_favorite = !oldValue;
  try {
    await axios.put(`${API_URL}/${contact.id}`, { ...contact, is_favorite: contact.is_favorite });
  } catch (error) {
    contact.is_favorite = oldValue;
  }
}

const deleteContact = async (id: number) => {
  if (!confirm('Tem certeza?')) return;
  try {
    await axios.delete(`${API_URL}/${id}`);
    fetchContacts(); // Recarrega tudo para atualizar os números
  } catch (e) { alert('Erro ao deletar'); }
};

// Filtro e Ordenação
const filteredContacts = computed(() => {
  let list = contacts.value;
  if (searchTerm.value) {
    list = list.filter(c => c.name.toLowerCase().includes(searchTerm.value.toLowerCase()));
  }
  return [...list].sort((a: any, b: any) => {
    if (b.is_favorite && !a.is_favorite) return 1;
    if (!b.is_favorite && a.is_favorite) return -1;
    return a.name.localeCompare(b.name);
  });
});

// Modal
const openCreate = () => { editingId.value = undefined; showModal.value = true; }
const openEdit = (id: number) => { editingId.value = id; showModal.value = true; }
const handleSuccess = () => { showModal.value = false; fetchContacts(); }

const getInitials = (name?: string | null) => {
  if (!name) return '?';
  return (name.trim().substring(0, 2) || '?').toUpperCase();
}

onMounted(() => fetchContacts());
</script>

<template>
  <div class="container">

    <div class="header">
      <h2>Painel de Controle</h2>
    </div>

    <div class="stats-row">
      <div v-for="(stat, index) in stats" :key="index" class="stat-card">
        <h3>{{ stat.total }}</h3>
        <p>{{ stat.category || 'Sem Categoria' }}</p>
      </div>

      <div class="stat-card total-card">
        <h3>{{ contacts.length }}</h3>
        <p>Total Geral</p>
      </div>
    </div>

    <div class="actions-bar">
      <div class="search-pill">
        <span class="search-icon">🔍</span>
        <input type="text" placeholder="Buscar..." v-model="searchTerm">
      </div>
      <button class="btn-add" @click="openCreate">+ Novo</button>
    </div>

    <div class="contact-list">
      <p v-if="filteredContacts.length === 0" class="empty-msg">Nenhum contato.</p>

      <div v-for="contact in filteredContacts" :key="contact.id" class="card">
        <div class="favorite-star" @click="toggleFavorite(contact)">
          {{ contact.is_favorite ? '⭐' : '☆' }}
        </div>
        <div class="avatar" :class="{ 'avatar-fav': contact.is_favorite }">
          {{ getInitials(contact.name) }}
        </div>
        <div class="info">
          <h3>{{ contact.name }}</h3>
          <span v-if="contact.category_name" class="category-badge">
            {{ contact.category_name }}
          </span>
          <span class="email">{{ contact.email }}</span>
          <span class="phone">{{ contact.phone }}</span>
        </div>
        <div class="actions">
          <button class="icon-btn edit" @click="openEdit(contact.id)">✏️</button>
          <button class="icon-btn delete" @click="deleteContact(contact.id)">🗑️</button>
        </div>
      </div>
    </div>

    <BaseModal v-if="showModal" @close="showModal = false">
      <ContactForm :id="editingId" @close="showModal = false" @saved="handleSuccess" />
    </BaseModal>

  </div>
</template>

<style scoped>
.container {
  font-family: 'Segoe UI', sans-serif;
  color: #333;
  max-width: 800px;
  margin: 0 auto;
  padding-bottom: 50px;
}

.header {
  margin-bottom: 20px;
  text-align: center;
}

/* 3. ESTILO DOS CARTÕES */
.stats-row {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
  justify-content: center;
  flex-wrap: wrap;
}

.stat-card {
  background: white;
  padding: 15px 25px;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  text-align: center;
  min-width: 100px;
  border: 1px solid #e2e8f0;
}

.stat-card h3 {
  margin: 0;
  font-size: 28px;
  color: #2563eb;
}

.stat-card p {
  margin: 5px 0 0 0;
  font-size: 13px;
  color: #64748b;
  font-weight: 600;
  text-transform: uppercase;
}

.total-card {
  background-color: #2563eb;
  border: none;
}

.total-card h3 {
  color: white;
}

.total-card p {
  color: #bfdbfe;
}

.actions-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.search-pill {
  display: flex;
  align-items: center;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 50px;
  padding: 4px;
  width: 100%;
  max-width: 500px;
}

.search-pill input {
  border: none;
  background: transparent;
  flex-grow: 1;
  padding: 10px;
  font-size: 15px;
  outline: none;
}

.search-icon {
  padding-left: 15px;
}

.btn-add {
  background-color: #10b981;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 30px;
  font-weight: 600;
  cursor: pointer;
}

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
  position: relative;
  padding-left: 45px;
}

.favorite-star {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 20px;
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

.avatar-fav {
  background-color: #fef08a;
  color: #854d0e;
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

.category-badge {
  display: inline-block !important;
  background-color: #e0e7ff;
  color: #4338ca;
  font-size: 11px !important;
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 600;
  margin-bottom: 4px;
  text-transform: uppercase;
}

.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 6px;
}
</style>