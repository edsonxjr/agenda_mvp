<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';

// 1. Aceita um ID opcional (se vier, é edição)
const props = defineProps<{
  id?: number
}>();

// 2. Emite eventos para avisar o pai (Lista)
const emit = defineEmits(['close', 'saved']);

const API_URL = 'http://localhost:3000/api/contacts';
const formData = ref({ name: '', email: '', phone: '' });
const isEditing = ref(false);

// Função para buscar dados (se for edição)
const loadContact = async () => {
  if (!props.id) {
    formData.value = { name: '', email: '', phone: '' }; // Limpa
    isEditing.value = false;
    return;
  }

  isEditing.value = true;
  try {
    const response = await axios.get(`${API_URL}/${props.id}`);
    formData.value = response.data;
  } catch (error) {
    alert('Erro ao carregar contato.');
    emit('close');
  }
};

// Salvar (Inteligente: decide entre POST ou PUT)
const handleSubmit = async () => {
  try {
    if (isEditing.value) {
      // EDITAR
      await axios.put(`${API_URL}/${props.id}`, formData.value);
      alert('Contato atualizado!');
    } else {
      // CRIAR
      await axios.post(API_URL, formData.value);
      alert('Contato criado!');
    }

    // Avisa a lista para atualizar e fecha o modal
    emit('saved');
    emit('close');

  } catch (error) {
    console.error(error);
    alert('Erro ao salvar.');
  }
};

// Monitora mudança no ID (para limpar ou carregar quando abre/fecha)
watch(() => props.id, loadContact);

onMounted(() => {
  loadContact();
});
</script>

<template>
  <div class="form-wrapper">
    <h2>{{ isEditing ? '✏️ Editar Contato' : '➕ Novo Contato' }}</h2>

    <form @submit.prevent="handleSubmit">
      <div class="input-group">
        <label>Nome</label>
        <input v-model="formData.name" required placeholder="Ex: João Silva">
      </div>

      <div class="row">
        <div class="input-group">
          <label>Email</label>
          <input v-model="formData.email" type="email" required>
        </div>
        <div class="input-group">
          <label>Telefone</label>
          <input v-model="formData.phone" required>
        </div>
      </div>

      <div class="actions">
        <button type="button" class="btn-cancel" @click="$emit('close')">Cancelar</button>
        <button type="submit" class="btn-save">
          {{ isEditing ? 'Salvar Alterações' : 'Criar Contato' }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
/* Reutilizando seu estilo bonito */
h2 {
  margin-top: 0;
  color: #1e293b;
  margin-bottom: 20px;
}

.row {
  display: flex;
  gap: 20px;
}

.input-group {
  margin-bottom: 15px;
  flex-grow: 1;
}

label {
  display: block;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 5px;
  font-size: 13px;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  outline: none;
  box-sizing: border-box;
}

input:focus {
  border-color: #3b82f6;
}

.actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.btn-save {
  flex-grow: 1;
  padding: 12px;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
}

.btn-save:hover {
  background-color: #1d4ed8;
}

.btn-cancel {
  padding: 12px 20px;
  background-color: #f1f5f9;
  color: #64748b;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
}

.btn-cancel:hover {
  background-color: #e2e8f0;
}
</style>