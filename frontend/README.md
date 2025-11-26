# 📒 Agenda MVP Fullstack

![Status](https://img.shields.io/badge/Status-Concluído-success)
![Stack](https://img.shields.io/badge/Stack-Vue%20%7C%20Node%20%7C%20TypeScript-blue)

Um sistema completo de gerenciamento de contatos desenvolvido para demonstrar a integração entre uma API RESTful robusta e uma interface moderna e reativa.

O projeto aplica conceitos fundamentais de desenvolvimento web: **CRUD**, **Componentização**, **Estilização com Flexbox** e **Consumo de API**.

---

## ✨ Funcionalidades

### 🎨 Frontend (Visual)
- [x] **Listagem de Contatos:** Exibição em cartões modernos (Cards).
- [x] **Busca em Tempo Real:** Filtre contatos por nome ou email instantaneamente.
- [x] **Avatares Automáticos:** Gera as iniciais do nome visualmente (ex: "Maria Silva" -> "MS").
- [x] **Formulário de Cadastro:** Interface limpa para adicionar novos contatos.
- [x] **Exclusão Segura:** Botão de deletar com confirmação de segurança.
- [x] **Design Responsivo:** Layout construído com CSS Flexbox.

### ⚙️ Backend (API)
- [x] **CRUD Completo:** Rotas para Criar, Ler, Atualizar e Deletar.
- [x] **Banco de Dados:** Persistência real de dados com MySQL e Knex.js.
- [x] **Arquitetura:** Separação clara de responsabilidades (Server, Database, Routes).

---

## 🛠️ Tecnologias Utilizadas

| Camada | Tecnologias |
| :--- | :--- |
| **Frontend** | Vue.js 3 (Composition API), Vite, TypeScript, Axios, CSS Scoped |
| **Backend** | Node.js, Express, TypeScript |
| **Database** | MySQL, Knex.js (Query Builder & Migrations) |

---

## 🚀 Como Rodar o Projeto

Este projeto é dividido em duas partes: o Servidor (Backend) e a Interface (Frontend). Você precisará de **dois terminais** abertos.

### 1. Pré-requisitos
* [Node.js](https://nodejs.org/) instalado.
* [MySQL](https://www.mysql.com/) rodando localmente com um banco de dados chamado `agenda_db`.

### 2. Configuração do Backend

No terminal 1, na raiz do projeto:

```bash
# 1. Instalar dependências
npm install

# 2. Configurar Banco de Dados
# (Certifique-se de que o arquivo knexfile.js tem sua senha do MySQL)

# 3. Criar a Tabela (Migration)
npx knex migrate:latest

# 4. Iniciar a API
npm run dev