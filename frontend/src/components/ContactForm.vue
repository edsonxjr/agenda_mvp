<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';

interface Category {
  id: number;
  name: string;
}

const props = defineProps<{ id?: number }>();
const emit = defineEmits(['close', 'saved']);

const API_URL = import.meta.env.VITE_API_URL;
const SERVER_URL = 'http://localhost:3000';

const formData = ref({
  name: '',
  email: '',
  phone: '',
  category_id: '' as string | number,
  is_favorite: false,
  birth_date: '' // 1. AJUSTE: Adicionado campo de data
});

const selectedFile = ref<File | null>(null);
const previewUrl = ref<string | null>(null);
const isEditing = ref(false);
const errors = ref({ name: '', email: '', phone: '' });
const categories = ref<Category[]>([]);

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];
    selectedFile.value = file;
    previewUrl.value = URL.createObjectURL(file);
  }
};

const validateForm = () => {
  let isValid = true;
  errors.value = { name: '', email: '', phone: '' };
  if (formData.value.name.trim().length < 3) { errors.value.name = 'Mínimo 3 letras.'; isValid = false; }
  const phoneDigits = formData.value.phone.replace(/\D/g, '');
  if (phoneDigits.length < 10) { errors.value.phone = 'Mínimo 10 números.'; isValid = false; }
  if (!formData.value.email.includes('@')) { errors.value.email = 'E-mail inválido.'; isValid = false; }
  return isValid;
};

const fetchCategories = async () => {
  try {
    const response = await axios.get(`${SERVER_URL}/api/categories`);
    categories.value = response.data;
  } catch (error) { console.error(error); }
};

const loadContact = async () => {
  errors.value = { name: '', email: '', phone: '' };
  selectedFile.value = null;
  previewUrl.value = null;

  if (!props.id) {
    formData.value = { name: '', email: '', phone: '', category_id: '', is_favorite: false, birth_date: '' };
    isEditing.value = false;
    return;
  }

  isEditing.value = true;
  try {
    const response = await axios.get(`${API_URL}/${props.id}`);
    const data = response.data;

    formData.value = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      category_id: data.category_id || '',
      is_favorite: Boolean(data.is_favorite),
      // 2. AJUSTE: Trata a data para o formato do calendário (YYYY-MM-DD)
      birth_date: data.birth_date ? data.birth_date.split('T')[0] : ''
    };

    if (data.photo_path) {
      previewUrl.value = `${SERVER_URL}/${data.photo_path}`;
    }
  } catch (error) {
    alert('Erro ao carregar.');
    emit('close');
  }
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  const data = new FormData();
  data.append('name', formData.value.name);
  data.append('email', formData.value.email);
  data.append('phone', formData.value.phone);
  data.append('is_favorite', String(formData.value.is_favorite));

  // 3. AJUSTE: Adicionando a data no FormData
  if (formData.value.birth_date) {
    data.append('birth_date', formData.value.birth_date);
  }

  if (formData.value.category_id) {
    data.append('category_id', String(formData.value.category_id));
  }

  if (selectedFile.value) {
    data.append('photo', selectedFile.value);
  }

  try {
    if (isEditing.value) {
      await axios.put(`${API_URL}/${props.id}`, data);
      alert('Contato atualizado!');
    } else {
      await axios.post(API_URL, data);
      alert('Contato criado!');
    }
    emit('saved');
    emit('close');
  } catch (error: any) {
    console.error(error);
    alert(error.response?.data?.message || 'Erro ao salvar.');
  }
};

watch(() => props.id, loadContact);
onMounted(() => { fetchCategories(); loadContact(); });
</script>

<template>
  <div class="form-wrapper">
    <h2>{{ isEditing ? '✏️ Editar Contato' : '📸 Novo Contato' }}</h2>

    <form @submit.prevent="handleSubmit">
      <div class="photo-section">
        <div class="photo-preview" v-if="previewUrl">
          <img :src="previewUrl" alt="Prévia">
        </div>
        <div class="photo-placeholder" v-else>👤</div>
        <label class="custom-file-upload">
          <input type="file" @change="handleFileChange" accept="image/*">
          Escolher Foto
        </label>
      </div>

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

      <div class="input-group">
        <label>Data de Nascimento</label>
        <input v-model="formData.birth_date" type="date" class="date-input">
      </div>

      <div class="input-group">
        <label>Categoria</label>
        <select v-model="formData.category_id" class="select-input">
          <option value="">Sem Categoria</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
        </select>
      </div>

      <div class="checkbox-group">
        <label>
          <input type="checkbox" v-model="formData.is_favorite">
          Marcar como Favorito ⭐
        </label>
      </div>

      <div class="actions">
        <button type="button" class="btn-cancel" @click="$emit('close')">Cancelar</button>
        <button type="submit" class="btn-save">{{ isEditing ? 'Salvar Alterações' : 'Criar Contato' }}</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
/* (Mantenha seus estilos anteriores e adicione este para o campo de data) */
.date-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  outline: none;
  background-color: white;
  font-family: inherit;
}

/* Reutilize os estilos que você já tinha no arquivo original */
h2 {
  margin-top: 0;
  color: #1e293b;
  margin-bottom: 20px;
  text-align: center;
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

input:not([type="checkbox"]):not([type="file"]),
.select-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  outline: none;
  box-sizing: border-box;
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

.btn-cancel {
  padding: 12px 20px;
  background-color: #f1f5f9;
  color: #64748b;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
}

.photo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.photo-preview {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #3b82f6;
  margin-bottom: 10px;
}

.photo-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-placeholder {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  margin-bottom: 10px;
}

input[type="file"] {
  display: none;
}

.custom-file-upload {
  border: 1px solid #cbd5e1;
  padding: 6px 12px;
  cursor: pointer;
  border-radius: 4px;
  font-size: 13px;
  background: #f8fafc;
}

.checkbox-group {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
}

.checkbox-group input {
  width: auto;
  margin-right: 8px;
}
</style>