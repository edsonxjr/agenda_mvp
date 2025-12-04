<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

// Importa os componentes que vamos mostrar nas janelas
import ContactList from '../components/ContactList.vue';
import ContactForm from '../components/ContactForm.vue';
import BaseModal from '../components/BaseModal.vue';

const totalContacts = ref(0);
const loading = ref(true);
const API_URL = 'http://localhost:3000/api/contacts';

// Controle dos Modais (Popups)
const showList = ref(false);
const showForm = ref(false);

// Função para buscar o total
const loadStats = async () => {
    try {
        const response = await axios.get(API_URL);
        totalContacts.value = response.data.length;
    } catch (error) { console.error(error); }
    finally { loading.value = false; }
};

// Função chamada quando fechamos um modal (para atualizar o contador)
const handleClose = () => {
    showList.value = false;
    showForm.value = false;
    loadStats(); // Recarrega o número de contatos
};

onMounted(() => { loadStats(); });
</script>

<template>
    <div class="dashboard-container">

        <div class="hero">
            <h1>👋 Olá, Gestor!</h1>
            <p>Gerencie sua agenda sem sair desta tela.</p>
        </div>

        <div class="stats-section">
            <div class="stat-card-premium">
                <div class="stat-content">
                    <span class="stat-label">Total na Agenda</span>
                    <h2 class="stat-value">{{ loading ? '...' : totalContacts }}</h2>
                    <span class="stat-sub">Pessoas cadastradas</span>
                </div>
                <div class="stat-icon-bg">👥</div>
            </div>
        </div>

        <div class="section-title">Acesso Rápido</div>

        <div class="menu-grid">

            <div class="nav-card primary" @click="showList = true">
                <div class="card-icon">📋</div>
                <h3>Minha Lista</h3>
                <p>Visualizar e gerenciar contatos.</p>
                <span class="link-text">Abrir Lista &rarr;</span>
            </div>

            <div class="nav-card success" @click="showForm = true">
                <div class="card-icon">➕</div>
                <h3>Novo Contato</h3>
                <p>Cadastrar uma nova pessoa.</p>
                <span class="link-text">Abrir Formulário &rarr;</span>
            </div>

        </div>

        <BaseModal v-if="showList" @close="handleClose">
            <ContactList />
        </BaseModal>

        <BaseModal v-if="showForm" @close="handleClose">
            <ContactForm />
        </BaseModal>

    </div>
</template>

<style scoped>
/* (Mantive o mesmo CSS bonito de antes, só mudei o cursor do nav-card) */
.dashboard-container {
    max-width: 800px;
    margin: 0 auto;
    font-family: 'Segoe UI', sans-serif;
    color: #333;
}

.hero {
    text-align: center;
    margin-bottom: 30px;
    padding: 20px 0;
}

.hero h1 {
    margin: 0;
    font-size: 28px;
    color: #1e293b;
}

.hero p {
    color: #64748b;
    margin-top: 8px;
}

/* Stats Card */
.stats-section {
    display: flex;
    justify-content: center;
    margin-bottom: 40px;
}

.stat-card-premium {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    width: 100%;
    max-width: 400px;
    border-radius: 20px;
    padding: 30px;
    color: white;
    position: relative;
    overflow: hidden;
    box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.4);
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: transform 0.2s;
}

.stat-card-premium:hover {
    transform: translateY(-3px);
}

.stat-content {
    position: relative;
    z-index: 2;
}

.stat-value {
    font-size: 56px;
    margin: 0;
    font-weight: 800;
    line-height: 1;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.stat-label {
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 1px;
    opacity: 0.9;
}

.stat-sub {
    font-size: 14px;
    opacity: 0.8;
    margin-top: 5px;
    display: block;
}

.stat-icon-bg {
    position: absolute;
    right: -10px;
    bottom: -20px;
    font-size: 120px;
    opacity: 0.15;
    transform: rotate(-15deg);
    user-select: none;
}

/* Menu */
.section-title {
    font-size: 14px;
    font-weight: 700;
    color: #94a3b8;
    text-transform: uppercase;
    margin-bottom: 15px;
}

.menu-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
}

.nav-card {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    padding: 25px;
    transition: all 0.2s ease;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
    cursor: pointer;
    /* Importante para indicar que é clicável */
}

.nav-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 20px rgba(0, 0, 0, 0.06);
    border-color: #cbd5e1;
}

.card-icon {
    font-size: 28px;
    margin-bottom: 12px;
}

.nav-card h3 {
    margin: 0 0 8px 0;
    font-size: 18px;
    color: #1e293b;
}

.nav-card p {
    margin: 0 0 15px 0;
    color: #64748b;
    font-size: 13px;
    line-height: 1.4;
}

.link-text {
    font-weight: bold;
    font-size: 13px;
    margin-top: auto;
}

.nav-card.primary {
    border-top: 4px solid #2563eb;
}

.nav-card.primary .link-text {
    color: #2563eb;
}

.nav-card.success {
    border-top: 4px solid #10b981;
}

.nav-card.success .link-text {
    color: #10b981;
}

@media (max-width: 600px) {
    .menu-grid {
        grid-template-columns: 1fr;
    }
}
</style>