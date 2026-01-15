<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ContactList from './components/ContactList.vue';
import Login from './components/Login.vue';

const isLoggedIn = ref(false);

// Verifica se já tem o crachá salvo no navegador ao abrir o site
onMounted(() => {
  const token = localStorage.getItem('token');
  if (token) {
    isLoggedIn.value = true;
  }
});

// Quando o login dá certo
const handleLoginSuccess = () => {
  isLoggedIn.value = true;
};

// Função de Logout (Sair)
const logout = () => {
  localStorage.removeItem('token'); // Rasga o crachá
  localStorage.removeItem('userName');
  isLoggedIn.value = false; // Chuta para a tela de login
};
</script>

<template>
  <div v-if="isLoggedIn">
    <div class="top-bar">
      <span>Agenda Segura 🔒</span>
      <button @click="logout" class="btn-logout">Sair</button>
    </div>
    <ContactList />
  </div>

  <Login v-else @login-success="handleLoginSuccess" />
</template>

<style scoped>
.top-bar {
  background-color: #1e293b;
  color: white;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.btn-logout {
  background-color: #ef4444;
  color: white;
  border: none;
  padding: 5px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.btn-logout:hover {
  background-color: #dc2626;
}
</style>