import { createApp } from 'vue';
import App from './App.vue';
import axios from 'axios';

// Configuração do Token para as requisições
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const app = createApp(App);
app.mount('#app');