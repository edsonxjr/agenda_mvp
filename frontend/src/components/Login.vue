<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';

const emit = defineEmits(['login-success']);

const isRegister = ref(false);
const selectedFile = ref<File | null>(null);
const imagePreview = ref<string | null>(null);

const formData = ref({
    name: '',
    email: '',
    password: ''
});

// Função para capturar o arquivo e gerar o preview
const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
        selectedFile.value = file;
        imagePreview.value = URL.createObjectURL(file); // Cria um link temporário para a imagem
    }
};

const handleSubmit = async () => {
    try {
        const endpoint = isRegister.value ? '/register' : '/login';
        const url = `http://localhost:3000/api/auth${endpoint}`;

        let dataToSend: any;

        if (isRegister.value) {
            // No Cadastro, usamos FormData por causa da FOTO
            const fd = new FormData();
            fd.append('name', formData.value.name);
            fd.append('email', formData.value.email);
            fd.append('password', formData.value.password);
            if (selectedFile.value) {
                fd.append('photo', selectedFile.value);
            }
            dataToSend = fd;
        } else {
            // No Login, podemos usar JSON comum
            dataToSend = formData.value;
        }

        const response = await axios.post(url, dataToSend);

        if (isRegister.value) {
            alert('Conta criada com sucesso! Faça o login agora.');
            isRegister.value = false;
            // Limpa os campos após cadastrar
            selectedFile.value = null;
            imagePreview.value = null;
        } else {
            // LOGIN COM SUCESSO!
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userName', response.data.name);
            // SALVA A FOTO NO NAVEGADOR
            localStorage.setItem('userPhoto', response.data.photo_path || '');

            emit('login-success');
        }

    } catch (error: any) {
        console.error(error);
        alert(error.response?.data?.message || 'Erro ao processar sua solicitação.');
    }
};
</script>

<template>
    <div class="login-container">
        <div class="card">
            <div class="logo-area">
                <span class="logo-emoji">{{ isRegister ? '📝' : '🔐' }}</span>
                <h2>{{ isRegister ? 'Criar Conta' : 'Acesso Restrito' }}</h2>
            </div>

            <form @submit.prevent="handleSubmit">

                <div v-if="isRegister" class="photo-upload">
                    <div class="avatar-preview">
                        <img v-if="imagePreview" :src="imagePreview" class="preview-img" />
                        <span v-else class="placeholder">👤</span>
                    </div>
                    <label for="file-input" class="btn-file">Escolher Foto</label>
                    <input id="file-input" type="file" @change="handleFileChange" accept="image/*" hidden>
                </div>

                <div v-if="isRegister" class="input-group">
                    <label>Nome</label>
                    <input v-model="formData.name" placeholder="Seu nome completo" required>
                </div>

                <div class="input-group">
                    <label>E-mail</label>
                    <input v-model="formData.email" type="email" placeholder="email@exemplo.com" required>
                </div>

                <div class="input-group">
                    <label>Senha</label>
                    <input v-model="formData.password" type="password" placeholder="Mínimo 6 caracteres" required>
                </div>

                <button type="submit" class="btn-primary">
                    {{ isRegister ? 'Cadastrar Minha Conta' : 'Entrar na Agenda' }}
                </button>
            </form>

            <div class="switch-mode">
                <p v-if="isRegister">
                    Já tem uma conta? <a href="#" @click.prevent="isRegister = false">Fazer Login</a>
                </p>
                <p v-else>
                    Novo por aqui? <a href="#" @click.prevent="isRegister = true">Criar Conta</a>
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
    background-color: #f8fafc;
    font-family: 'Segoe UI', sans-serif;
}

.card {
    background: white;
    padding: 40px;
    border-radius: 16px;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
}

.logo-area {
    text-align: center;
    margin-bottom: 30px;
}

.logo-emoji {
    font-size: 40px;
    display: block;
    margin-bottom: 10px;
}

h2 {
    color: #1e293b;
    font-size: 22px;
    margin: 0;
}

/* Estilos da Foto de Perfil */
.photo-upload {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;
}

.avatar-preview {
    width: 80px;
    height: 80px;
    background-color: #f1f5f9;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;
    border: 2px dashed #cbd5e1;
    overflow: hidden;
}

.preview-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.placeholder {
    font-size: 40px;
    color: #94a3b8;
}

.btn-file {
    font-size: 12px;
    font-weight: 600;
    color: #2563eb;
    cursor: pointer;
    padding: 4px 12px;
    border-radius: 20px;
    background: #eff6ff;
}

.btn-file:hover {
    background: #dbeafe;
}

/* Inputs e Botões */
.input-group {
    margin-bottom: 15px;
}

label {
    display: block;
    font-size: 13px;
    font-weight: 600;
    color: #64748b;
    margin-bottom: 6px;
}

input {
    width: 100%;
    padding: 12px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    box-sizing: border-box;
    outline: none;
    transition: all 0.2s;
}

input:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.btn-primary {
    width: 100%;
    padding: 14px;
    background-color: #2563eb;
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 700;
    cursor: pointer;
    font-size: 15px;
    margin-top: 10px;
    transition: background 0.2s;
}

.btn-primary:hover {
    background-color: #1d4ed8;
}

.switch-mode {
    margin-top: 25px;
    text-align: center;
    font-size: 14px;
    color: #64748b;
}

a {
    color: #2563eb;
    text-decoration: none;
    font-weight: 700;
}
</style>