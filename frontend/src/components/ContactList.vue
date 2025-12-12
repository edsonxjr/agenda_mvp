<script setup lang="ts">
// 1. ATUALIZAÇÃO DA INTERFACE (Adicionei is_favorite)
interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  is_favorite?: boolean;
}

import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import BaseModal from './BaseModal.vue';
import ContactForm from './ContactForm.vue';

const API_URL = import.meta.env.VITE_API_URL;
const contacts = ref<Contact[]>([]);
const searchTerm = ref('');

const toggleFavorite = async (contact: any) => {
  const oldValue = contact.is_favorite;

  contact.is_favorite = !oldValue;

  try {
    // Envia para o backend
    await axios.put(`${API_URL}/${contact.id}`, {
      ...contact,
      is_favorite: contact.is_favorite
    }); 
  } catch (error) {
    console.error('Erro ao favoritar', error);
    alert('Erro ao salvar favorito.');
    contact.is_favorite = oldValue; // Desfaz erro
  }
}

// Controle do Modal
const showModal = ref(false);
const editingId = ref<number | undefined>(undefined);

// --- AÇÕES DO MODAL ---
const openCreate = () => {
  editingId.value = undefined;
  showModal.value = true;
}

const openEdit = (id: number) => {
  editingId.value = id;
  showModal.value = true;
}

const handleSuccess = () => {
  showModal.value = false;
  fetchContacts();
}

// 3. ORDENAÇÃO (Favoritos no Topo)
const filteredContacts = computed(() => {
  let list = contacts.value;

  // Filtro de busca
  if (searchTerm.value) {
    list = list.filter(c =>
      c.name.toLowerCase().includes(searchTerm.value.toLowerCase())
    );
  }

  // Lógica de Ordenação: Cria uma cópia e ordena
  return [...list].sort((a: any, b: any) => {
    // Se B é favorito e A não é, B vem primeiro
    if (b.is_favorite && !a.is_favorite) return 1;
    if (!b.is_favorite && a.is_favorite) return -1;
    return a.name.localeCompare(b.name);
  });
});

const fetchContacts = async () => {
  try {
    const response = await axios.get(API_URL);
    contacts.value = response.data;
  } catch (error) { console.error(error); }
};

const deleteContact = async (id: number) => {
  if (!confirm('Tem certeza?')) return;
  try {
    await axios.delete(`${API_URL}/${id}`);
    contacts.value = contacts.value.filter(c => c.id !== id);
  } catch (e) { alert('Erro ao deletar'); }
};

const getInitials = (name?: string | null) => {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    const a = parts[0]?.[0] ?? '';
    const b = parts[1]?.[0] ?? '';
    return (a + b).toUpperCase() || '?';
  }
  return (name.trim().substring(0, 2) || '?').toUpperCase();
}

onMounted(() => fetchContacts());
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
        <button class="btn-search-inside">Busca</button>
      </div>

      <button class="btn-add" @click="openCreate">
        + Novo
      </button>
    </div>

    <div class="contact-list">
      <p v-if="filteredContacts.length === 0" class="empty-msg">Nenhum contato.</p>

      <div v-for="contact in filteredContacts" :key="contact.id" class="card">

        <div class="favorite-star" @click="toggleFavorite(contact)"
          :title="contact.is_favorite ? 'Desfavoritar' : 'Favoritar'">
          {{ contact.is_favorite ? '⭐' : '☆' }}
        </div>

        <div class="avatar" :class="{ 'avatar-fav': contact.is_favorite }">
          {{ getInitials(contact.name) }}
        </div>

        <div class="info">
          <h3>{{ contact.name }}</h3>
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

.actions-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-bottom: 30px;
}

.search-pill {
  display: flex;
  align-items: center;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 50px;
  padding: 4px;
  width: 500px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.02);
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

.search-icon {
  padding-left: 15px;
}

.btn-search-inside {
  background-color: #2563eb;
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 30px;
  font-weight: 600;
  cursor: pointer;
}

.btn-add {
  background-color: #10b981;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 30px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s;
}

.btn-add:hover {
  transform: scale(1.05);
}

.contact-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

/* 5. ESTILOS DA ESTRELA E CARD */
.card {
  display: flex;
  align-items: center;
  gap: 15px;
  background: white;
  border: 1px solid #e2e8f0;
  padding: 15px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  position: relative;
  /* Necessário para posicionar a estrela */
  padding-left: 45px;
  /* Abre espaço na esquerda para a estrela */
}

.favorite-star {
  position: absolute;
  left: 12px;
  /* Cola na esquerda */
  top: 50%;
  transform: translateY(-50%);
  /* Centraliza verticalmente */
  cursor: pointer;
  font-size: 20px;
  user-select: none;
}

.favorite-star:hover {
  transform: translateY(-50%) scale(1.2);
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

/* Cor especial para o avatar de favorito */
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
</style>