<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const API_URL = 'http://localhost:3000/api/contacts';

const formData = ref({
  name: '',
  email: '',
  phone: ''
});

const getContact = async () => {
  try {
    const id = route.params.id;
    const response = await axios.get(`${API_URL}/${id}`);
    formData.value = response.data;
  } catch (error) {
    alert('Erro ao buscar contato.');
    router.push('/meus-contatos');
  }
};

const updateContact = async () => {
  try {
    const id = route.params.id;
    await axios.put(`${API_URL}/${id}`, formData.value);
    
    alert('Contato atualizado!');
    router.push('/meus-contatos');
    
  } catch (error) {
    console.error(error);
    alert('Erro ao atualizar.');
  }
};

onMounted(() => {
  getContact();
});
</script>

<template>
  <div class="edit-container">
    
    <div class="form-card">
      <h2>✏️ Editar Contato</h2>
      
      <form @submit.prevent="updateContact">

        <div class="input-group">
          <label>Nome</label>
          <input v-model="formData.name" required>
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
          <button type="button" class="btn-cancel" @click="router.push('/meus-contatos')">
            Cancelar
          </button>
          
          <button type="submit" class="btn-save">
            Salvar Alterações
          </button>
        </div>

      </form>
    </div>

  </div>
</template>

<style scoped>
.edit-container {
  max-width: 600px;
  margin: 0 auto;
  padding-top: 20px;
  font-family: 'Segoe UI', sans-serif;
}

.form-card {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  border: 1px solid #e2e8f0;
}

h2 { margin-top: 0; color: #1e293b; margin-bottom: 25px; }

.row { display: flex; gap: 20px; }
.input-group { margin-bottom: 15px; flex-grow: 1; }

label { display: block; font-weight: 600; color: #64748b; margin-bottom: 5px; font-size: 13px; }

input {
  width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px;
  outline: none; box-sizing: border-box; font-size: 15px;
}
input:focus { border-color: #3b82f6; }

.actions { display: flex; gap: 15px; margin-top: 20px; }

/* --- BOTÕES PADRONIZADOS --- */

.btn-save {
  flex-grow: 1;
  padding: 12px;
  background-color: #2563eb; /* Azul da identidade */
  color: white;
  border: none;
  border-radius: 30px; /* Redondo (Pill) */
  font-weight: 600;
  cursor: pointer;
  font-size: 14px;
  box-shadow: 0 4px 6px rgba(37, 99, 235, 0.2); /* Sombra azul */
  transition: all 0.2s ease;
}

.btn-save:hover { 
  background-color: #1d4ed8; 
  transform: scale(1.02); /* Cresce levemente */
}

.btn-cancel {
  padding: 12px 25px;
  background-color: #f1f5f9;
  color: #64748b;
  border: 1px solid #e2e8f0;
  border-radius: 30px; /* Redondo (Pill) */
  font-weight: 600;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.btn-cancel:hover { 
  background-color: #e2e8f0; 
  color: #334155;
}
</style>