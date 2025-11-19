<script lang="ts">
import { defineComponent, ref } from 'vue';
import axios from 'axios';

export default defineComponent({
  name: 'ContactForm',
  setup() {
    // URL base da nossa API
    const API_URL = 'http://localhost:3000/api/contacts';

    // 1. Variável Reativa: Armazena os dados digitados nos campos do formulário
    const formData = ref({
      name: '',
      email: '',
      phone: '',
    });

    // 2. Função para lidar com o envio do formulário
    const handleSubmit = async () => {
      try {
        // 3. Envia os dados (formData.value) para a rota POST da sua API
        await axios.post(API_URL, formData.value);

        // Mensagem de sucesso para o usuário
        alert('Contato criado com sucesso!');
        
        // 4. Limpa o formulário após o sucesso
        formData.value = {
          name: '',
          email: '',
          phone: '',
        };

        // Idealmente, aqui emitiríamos um evento para ContactList atualizar sem F5.
        // Mas por enquanto, a recarga manual resolve.

      } catch (error) {
        console.error('Erro ao cadastrar contato:', error);
        alert('Erro ao cadastrar contato. Verifique o console.');
      }
    };

    return {
      formData,
      handleSubmit,
    };
  },
});
</script>

<template>
  <div class="form-container">
    <h2>Adicionar Novo Contato</h2>
    
    <form @submit.prevent="handleSubmit">
      
      <div>
        <label for="name">Nome:</label>
        <input type="text" id="name" v-model="formData.name" required>
      </div>

      <div>
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="formData.email" required>
      </div>

      <div>
        <label for="phone">Telefone:</label>
        <input type="text" id="phone" v-model="formData.phone" required>
      </div>

      <button type="submit">Salvar Contato</button>
    </form>
  </div>
</template>

<style scoped>
.form-container {
    border: 1px solid #ccc;
    padding: 20px;
    margin-bottom: 30px;
    border-radius: 8px;
}
label {
    font-weight: bold;
    margin-top: 10px;
}
input {
    display: block;
    margin-bottom: 15px;
    padding: 10px;
    width: 90%;
    border: 1px solid #ddd;
    border-radius: 4px;
}
button {
    padding: 10px 15px;
    background-color: #42b883;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}
</style>