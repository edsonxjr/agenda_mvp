<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import ContactList from './components/ContactList.vue';
import Login from './components/Login.vue';

// Ajuste: Usando link temporário para não travar o Vite se o arquivo local não existir
const logoImg = 'https://cdn-icons-png.flaticon.com/512/295/295128.png';

const isLoggedIn = ref(false);
const userName = ref('');
const userPhoto = ref<string | null>(null);

const userInitial = computed(() => userName.value ? userName.value.charAt(0).toUpperCase() : '?');

const checkAuth = () => {
  const token = localStorage.getItem('token');
  const savedName = localStorage.getItem('userName');
  if (token) {
    isLoggedIn.value = true;
    userName.value = savedName || 'Usuário';
  }
};

onMounted(checkAuth);
const handleLoginSuccess = () => { checkAuth(); };
const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userName');
  isLoggedIn.value = false;
};
</script>

<template>
  <div v-if="isLoggedIn" class="app-layout">
    <div class="header-container">
      <header class="pill-header">
        <div class="brand">
          <img :src="logoImg" alt="Logo" class="app-logo">
          <h1 class="app-title">Agenda<strong>Segura</strong></h1>
        </div>

        <div class="v-divider"></div>

        <div class="user-section">
          <span class="user-name">{{ userName }}</span>
          <div class="user-avatar">
            <img v-if="userPhoto" :src="userPhoto" class="avatar-img" />
            <span v-else>{{ userInitial }}</span>
          </div>
          <button @click="logout" class="btn-exit" title="Sair">
            <span class="icon">✕</span>
          </button>
        </div>
      </header>
    </div>

    <main class="content">
      <ContactList />
    </main>
  </div>
  <Login v-else @login-success="handleLoginSuccess" />
</template>

<style scoped>
.app-layout {
  min-height: 100vh;
  background-color: #f8fafc;
  font-family: 'Segoe UI', system-ui, sans-serif;
}

.header-container {
  position: fixed;
  top: 15px;
  /* Ajustado para flutuar melhor */
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  z-index: 1000;
  padding: 0 20px;
}

.pill-header {
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  /* Borda mais suave */
  padding: 5px 6px 5px 14px;
  border-radius: 100px;
  display: flex;
  align-items: center;
  gap: 12px;
  /* Sombra mais profunda para dar volume */
  box-shadow: 0 4px 20px -5px rgba(0, 0, 0, 0.1);
}

.brand {
  display: flex;
  align-items: center;
  gap: 8px;
}

.app-logo {
  width: 20px;
  height: 20px;
  object-fit: contain;
}

.app-title {
  font-size: 14px;
  color: #1e293b;
  margin: 0;
  letter-spacing: -0.2px;
}

.app-title strong {
  color: #2563eb;
}

.v-divider {
  width: 1px;
  height: 16px;
  background-color: #e2e8f0;
}

.user-section {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-name {
  font-size: 13px;
  font-weight: 600;
  color: #475569;
}

.user-avatar {
  width: 28px;
  height: 28px;
  background-color: #e0e7ff;
  color: #4338ca;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 800;
  overflow: hidden;
  transition: transform 0.2s;
}

.user-avatar:hover {
  transform: scale(1.1);
}

.btn-exit {
  background: #f1f5f9;
  border: none;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  font-size: 10px;
  transition: all 0.2s;
}

.btn-exit:hover {
  background-color: #fee2e2;
  color: #ef4444;
}

.content {
  padding-top: 90px;
  max-width: 850px;
  margin: 0 auto;
}
</style>