<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/contacts';

const formData = ref({
  name: '',
  email: '',
  phone: '',
});

const handleSubmit = async () => {
  try {
    await axios.post(API_URL, formData.value);
    alert('Contato criado com sucesso!');

    // Limpa
    formData.value = { name: '', email: '', phone: '' };
    
    // Recarrega a página para atualizar a lista
    window.location.reload(); 

  } catch (error) {
    console.error('Erro:', error);
    alert('Erro ao cadastrar.');
  }
};
</script>

<template>
  <div class="form-card">
    <h2>Novo Contato</h2>
    
    <form @submit.prevent="handleSubmit">

      <div class="input-group">
        <label>Nome</label>
        <input v-model="formData.name" required placeholder="Ex: João Silva">
      </div>

      <div class="row">
        
        <div class="input-group">
          <label>Email</label>
          <input v-model="formData.email" type="email" required placeholder="email@exemplo.com">
        </div>

        <div class="input-group">
          <label>Telefone</label>
          <input v-model="formData.phone" required placeholder="(00) 00000-0000">
        </div>

      </div>

      <button type="submit" class="btn-save">Salvar Contato</button>
    </form>

  </div>
</template>

<style scoped>
.form-card {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05) ;
  margin-bottom: 30px;
  border: 1px solid #e2e8f0
}

h2{
  margin-top: 0%;
  color: #1e293b;
  margin-bottom: 20px;
  font-size: 20px;
}

.row{
  display: flex;
  gap: 20px;
}



</style>