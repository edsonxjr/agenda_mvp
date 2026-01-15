<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';

const emit = defineEmits(['login-success']);

// Controla se está na tela de "Entrar" ou "Cadastrar"
const isRegister = ref(false);

const formData = ref({
    name: '',
    email: '',
    password: ''
});

const handleSubmit = async () => {
    try {
        const endpoint = isRegister.value ? '/register' : '/login';
        const url = `http://localhost:3000/api/auth${endpoint}`;

        const response = await axios.post(url, formData.value);

        if (isRegister.value) {
            alert('Conta criada! Agora faça login.');
            isRegister.value = false; // Volta para tela de login
        } else {
            // LOGIN COM SUCESSO!
            const token = response.data.token;
            const userName = response.data.name;

            // Salva o crachá no navegador para não precisar logar de novo se der F5
            localStorage.setItem('token', token);
            localStorage.setItem('userName', userName);

            // Avisa o App que deu certo
            emit('login-success');
        }

    } catch (error: any) {
        console.error(error);
        alert(error.response?.data?.message || 'Erro ao processar.');
    }
};
</script>

<template>
    <div class="login-container">
        <div class="card">
            <h2>{{ isRegister ? '📝 Criar Conta' : '🔐 Acesso Restrito' }}</h2>

            <form @submit.prevent="handleSubmit">

                <div v-if="isRegister" class="input-group">
                    <label>Nome</label>
                    <input v-model="formData.name" placeholder="Seu nome" required>
                </div>

                <div class="input-group">
                    <label>E-mail</label>
                    <input v-model="formData.email" type="email" placeholder="email@exemplo.com" required>
                </div>

                <div class="input-group">
                    <label>Senha</label>
                    <input v-model="formData.password" type="password" placeholder="******" required>
                </div>

                <button type="submit" class="btn-primary">
                    {{ isRegister ? 'Cadastrar' : 'Entrar' }}
                </button>

            </form>

            <div class="switch-mode">
                <p v-if="isRegister">
                    Já tem conta? <a href="#" @click.prevent="isRegister = false">Fazer Login</a>
                </p>
                <p v-else>
                    Novo aqui? <a href="#" @click.prevent="isRegister = true">Criar Conta</a>
                </p>
            </div>
        </div>
    </div>
</template>

<style scoped>
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f1f5f9;
}

.card {
    background: white;
    padding: 40px;
    border-radius: 12px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
    text-align: center;
}

h2 {
    color: #1e293b;
    margin-bottom: 25px;
}

.input-group {
    margin-bottom: 15px;
    text-align: left;
}

label {
    display: block;
    font-size: 14px;
    font-weight: 600;
    color: #64748b;
    margin-bottom: 5px;
}

input {
    width: 100%;
    padding: 12px;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    box-sizing: border-box;
    outline: none;
    transition: border-color 0.2s;
}

input:focus {
    border-color: #3b82f6;
}

.btn-primary {
    width: 100%;
    padding: 12px;
    background-color: #2563eb;
    color: white;
    border: none;
    border-radius: 6px;
    font-weight: bold;
    cursor: pointer;
    font-size: 16px;
    margin-top: 10px;
}

.btn-primary:hover {
    background-color: #1d4ed8;
}

.switch-mode {
    margin-top: 20px;
    font-size: 14px;
    color: #64748b;
}

a {
    color: #2563eb;
    text-decoration: none;
    font-weight: 600;
}

a:hover {
    text-decoration: underline;
}
</style>