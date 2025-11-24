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

</template>

<style scoped>

</style>