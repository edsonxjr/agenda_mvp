<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import BaseModal from './BaseModal.vue';
import ContactForm from './ContactForm.vue';

interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  is_favorite?: boolean;
  category_name?: string;
  photo_path?: string;
  birth_date?: string; // Adicionado campo de data
}

interface Stat {
  category: string | null;
  total: number;
}

const SERVER_URL = 'http://localhost:3000';

const contacts = ref<Contact[]>([]);
const stats = ref<Stat[]>([]);
const searchTerm = ref('');
const showModal = ref(false);
const editingId = ref<number | undefined>(undefined);
const isLoading = ref(true);

// --- FUNÇÃO PARA CHECAR ANIVERSÁRIO ---
const isBirthday = (date: string | null | undefined) => {
  if (!date) return false;

  const today = new Date();
  const birth = new Date(date);

  // Usamos o UTC para evitar erros de fuso horário na data vinda do banco
  return today.getUTCDate() === birth.getUTCDate() &&
    today.getUTCMonth() === birth.getUTCMonth();
};

const fetchStats = async () => {
  try {
    const response = await axios.get(`${SERVER_URL}/api/stats`);
    stats.value = response.data;
  } catch (error) { console.error(error); }
};

const fetchContacts = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get(`${SERVER_URL}/api/contacts`);
    contacts.value = response.data;
    fetchStats();
  } catch (error) {
    console.error(error);
  } finally {
    setTimeout(() => { isLoading.value = false; }, 400);
  }
};

const toggleFavorite = async (contact: any) => {
  const oldValue = contact.is_favorite;
  contact.is_favorite = !oldValue;
  try {
    await axios.put(`${SERVER_URL}/api/contacts/${contact.id}`, { ...contact, is_favorite: contact.is_favorite });
  } catch (error) { contact.is_favorite = oldValue; }
}

const deleteContact = async (id: number) => {
  if (!confirm('Tem certeza que deseja excluir?')) return;
  try {
    await axios.delete(`${SERVER_URL}/api/contacts/${id}`);
    fetchContacts();
  } catch (e) { alert('Erro ao deletar'); }
};

const openWhatsApp = (phone: string) => {
  const cleanNumber = phone.replace(/\D/g, '');
  const finalNumber = cleanNumber.length <= 11 ? `55${cleanNumber}` : cleanNumber;
  window.open(`https://wa.me/${finalNumber}`, '_blank');
};

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

const openCreate = () => { editingId.value = undefined; showModal.value = true; }
const openEdit = (id: number) => { editingId.value = id; showModal.value = true; }
const handleSuccess = () => { showModal.value = false; fetchContacts(); }

const getInitials = (name?: string | null) => {
  if (!name) return '?';
  return name.trim().split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}

const getPhotoUrl = (path: string) => `${SERVER_URL}/${path}`;

onMounted(() => fetchContacts());
</script>

<template>
  <div class="container">
    <div class="header">
      <h2>Meus Contatos</h2>
    </div>

    <div class="stats-row">
      <div v-for="(stat, index) in stats" :key="index" class="stat-card">
        <h3>{{ stat.total }}</h3>
        <p>{{ stat.category || 'Geral' }}</p>
      </div>
      <div class="stat-card total-card">
        <h3>{{ contacts.length }}</h3>
        <p>Total</p>
      </div>
    </div>

    <div class="actions-bar">
      <div class="search-box">
        <span class="search-icon">🔍</span>
        <input type="text" placeholder="Buscar contato..." v-model="searchTerm">
      </div>
      <button class="btn-add" @click="openCreate">+ Novo</button>
    </div>

    <div v-if="isLoading" class="loading-container">
      <div class="spinner"></div>
      <p>Carregando...</p>
    </div>

    <div v-else class="contact-list">
      <p v-if="filteredContacts.length === 0" class="empty-msg">Nenhum contato encontrado.</p>

      <div v-for="contact in filteredContacts" :key="contact.id" class="card">
        <div class="favorite-star" @click="toggleFavorite(contact)">
          <span :class="{ 'star-active': contact.is_favorite }">
            {{ contact.is_favorite ? '⭐' : '☆' }}
          </span>
        </div>

        <div class="avatar-wrapper">
          <img v-if="contact.photo_path" :src="getPhotoUrl(contact.photo_path)" class="avatar-img" alt="Foto" />
          <div v-else class="avatar" :class="{ 'avatar-fav': contact.is_favorite }">
            {{ getInitials(contact.name) }}
          </div>
        </div>

        <div class="info">
          <div class="name-row">
            <h3>{{ contact.name }}</h3>

            <span v-if="isBirthday(contact.birth_date)" class="bday-icon" title="Aniversariante do dia!">
              🎂
            </span>

            <span v-if="contact.category_name" class="category-badge">
              {{ contact.category_name }}
            </span>
          </div>
          <span class="details">{{ contact.phone }} • {{ contact.email }}</span>
        </div>

        <div class="actions">
          <button class="icon-btn whatsapp" @click="openWhatsApp(contact.phone)" title="Enviar WhatsApp">
            <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp"
              class="wpp-icon" />
          </button>
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
/* (Mantenha seus estilos anteriores e adicione estes novos abaixo) */

.bday-icon {
  font-size: 18px;
  cursor: help;
  animation: bounce 1s infinite;
  display: inline-block;
}

@keyframes bounce {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-5px);
  }
}

/* Restante do seu CSS existente... */
.container {
  font-family: 'Segoe UI', sans-serif;
  color: #333;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  margin-bottom: 20px;
  text-align: center;
}

.header h2 {
  margin: 0;
  color: #1e293b;
}

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
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  text-align: center;
  min-width: 100px;
  border: 1px solid #e2e8f0;
}

.stat-card h3 {
  margin: 0;
  font-size: 24px;
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
  gap: 15px;
  margin-bottom: 20px;
}

.search-box {
  flex-grow: 1;
  display: flex;
  align-items: center;
  background: white;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 0 12px;
}

.search-box input {
  border: none;
  flex-grow: 1;
  padding: 12px;
  font-size: 15px;
  outline: none;
}

.btn-add {
  background-color: #10b981;
  color: white;
  border: none;
  padding: 0 25px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  font-size: 15px;
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
  padding-left: 50px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.03);
}

.favorite-star {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 22px;
  color: #cbd5e1;
}

.star-active {
  color: #f59e0b;
}

.avatar-wrapper {
  width: 50px;
  height: 50px;
  flex-shrink: 0;
}

.avatar {
  width: 100%;
  height: 100%;
  background-color: #dbeafe;
  color: #1e40af;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 18px;
}

.avatar-fav {
  background-color: #fef08a;
  color: #854d0e;
}

.avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e2e8f0;
}

.info {
  flex-grow: 1;
}

.name-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 5px;
}

.info h3 {
  margin: 0;
  font-size: 17px;
  color: #1e293b;
}

.details {
  display: block;
  font-size: 14px;
  color: #64748b;
}

.category-badge {
  background-color: #eff6ff;
  color: #2563eb;
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 12px;
  font-weight: 700;
  text-transform: uppercase;
}

.actions {
  display: flex;
  gap: 5px;
}

.icon-btn {
  background: #f1f5f9;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-btn:hover {
  background-color: #e2e8f0;
}

.wpp-icon {
  width: 20px;
  height: 20px;
  display: block;
}

.whatsapp:hover {
  background-color: #25D366 !important;
}

.delete:hover {
  background-color: #fee2e2;
  color: #ef4444;
}

.loading-container {
  text-align: center;
  padding: 40px;
  color: #64748b;
}

.spinner {
  margin: 0 auto 15px auto;
  width: 30px;
  height: 30px;
  border: 3px solid #e2e8f0;
  border-top: 3px solid #2563eb;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>