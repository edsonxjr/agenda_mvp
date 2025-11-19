<script setup lang="ts">
// Define a estrutura básica de um contato para o TypeScript
interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
}

import { ref, onMounted } from 'vue'; 
import axios from 'axios'; 

const API_URL = 'http://localhost:3000/api/contacts'; 

// Variável Reativa: Guarda a lista de contatos.
const contacts = ref<Contact[]>([]); 

// Função que busca os dados da API
const fetchContacts = async () => {
  try {
    const response = await axios.get(API_URL);
    contacts.value = response.data; 

    // A linha pedida para confirmação:
    console.log("✅ Lista de contatos carregada com sucesso!"); 

  } catch (error) {
    console.error('Erro ao buscar contatos:', error);
  }
};

// Hook de Ciclo de Vida

onMounted(() => {

  fetchContacts();

});

</script>



<template>

  <div class="list-container">

    <h2>Lista de Contatos</h2>

    <ul>

      <li v-for="contact in contacts" :key="contact.id">

        <strong>{{ contact.name }}</strong>

        <p>Email: {{ contact.email }}</p>

        <p>Telefone: {{ contact.phone }}</p>

      </li>

    </ul>

  </div>

</template>



<style scoped>

.list-container {

  margin-top: 20px;

}

ul {

  list-style-type: none;

  padding: 0;

}

li {

  border: 1px solid #eee;

  padding: 15px;

  margin-bottom: 10px;

  border-radius: 8px;

  background-color: #f9f9f9;

}

strong {

  font-size: 1.2em;

  display: block;

  margin-bottom: 5px;

}

p {

  margin: 5px 0;

}

</style>
