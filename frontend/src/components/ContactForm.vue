<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';

const props = defineProps<{ id?: number }>();
const emit = defineEmits(['close', 'saved']);

const API_URL = 'http://localhost:3000/api/contacts';

const formData = ref({ name: '', email: '', phone: '' });
const isEditing = ref(false);
const errors = ref({ name: '', email: '', phone: '' });

const validateForm = () => {
  let isValid = true;
  errors.value = { name: '', email: '', phone: '' };

  if (formData.value.name.trim().length < 3) {
    errors.value.name = 'O nome precisa ter pelo menos 3 letras.';
    isValid = false;
  }

  const phoneDigits = formData.value.phone.replace(/\D/g, '');
  if (phoneDigits.length < 10) {
    errors.value.phone = 'Telefone inválido (mínimo 10 números).';
    isValid = false;
  }

  if (!formData.value.email.includes('@')) {
    errors.value.email = 'E-mail inválido.';
    isValid = false;
  }

  return isValid;
};

const loadContact = async () => {
  errors.value = { name: '', email: '', phone: '' };

  if (!props.id) {
    formData.value = { name: '', email: '', phone: '' };
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

const handleSubmit = async () => {
  if (!validateForm()) return;

  try {
    if (isEditing.value) {
      await axios.put(`${API_URL}/${props.id}`, formData.value);
      alert('Contato atualizado!');
    } else {
      await axios.post(API_URL, formData.value);
      alert('Contato criado!');
    }

    emit('saved');
    emit('close');

  } catch (error: any) {
    console.error(error);

    if (error.response && error.response.status === 409) {
      const msg = error.response.data.message.toLowerCase();
      if (msg.includes('email') || msg.includes('e-mail')) {
        errors.value.email = error.response.data.message;
      } else if (msg.includes('telefone') || msg.includes('phone')) {
        errors.value.phone = error.response.data.message;
      } else {
        alert(error.response.data.message);
      }
    } else {
      alert('Erro ao salvar.');
    }
  }
};

watch(() => props.id, loadContact);

onMounted(() => { loadContact(); });
</script>

<template>
  <div class="form-wrapper">
    <h2>{{ isEditing ? '✏️ Editar Contato' : '➕ Novo Contato' }}</h2>

    <form @submit.prevent="handleSubmit">

      <div class="input-group">
        <label>Nome</label>
        <input v-model="formData.name" placeholder="Ex: João Silva" :class="{ 'input-error': errors.name }">
        <span v-if="errors.name" class="error-msg">{{ errors.name }}</span>
      </div>

      <div class="row">
        <div class="input-group">
          <label>Email</label>
          <input v-model="formData.email" type="email" placeholder="email@exemplo.com"
            :class="{ 'input-error': errors.email }">
          <span v-if="errors.email" class="error-msg">{{ errors.email }}</span>
        </div>

        <div class="input-group">
          <label>Telefone</label>
          <input v-model="formData.phone" placeholder="(00) 00000-0000" :class="{ 'input-error': errors.phone }">
          <span v-if="errors.phone" class="error-msg">{{ errors.phone }}</span>
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
  transition: border-color 0.2s;
}

input:focus {
  border-color: #3b82f6;
}

.input-error {
  border-color: #ef4444 !important;
  background-color: #fef2f2;
}

.error-msg {
  color: #ef4444;
  font-size: 12px;
  font-weight: bold;
  margin-top: 4px;
  display: block;
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