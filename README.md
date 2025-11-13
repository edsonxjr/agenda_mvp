# 🎯 Agenda de Contatos - MVP

![Status](https://img.shields.io/badge/Status-Em_Desenvolvimento-blue)

Projeto simples de uma Agenda de Contatos (CRUD completo) desenvolvido para fins de estudo, focado em praticar a integração entre um backend Node.js e um frontend Vue.js.

## 🛠️ Tecnologias Utilizadas

Este projeto é dividido em duas partes principais:

### 🏛️ Backend (Pasta Raiz)
* **Node.js**
* **TypeScript**
* **Express.js**: Para criação do servidor e das rotas da API REST.
* **MySQL**: Banco de dados relacional.
* **Knex.js**: Query Builder do SQL e gerenciador de Migrations.
* **CORS**: Para permitir a comunicação com o frontend.

### 🎨 Frontend (Pasta `/frontend`)
* **Vue.js 3**: (Composition API e `<script setup>`)
* **TypeScript**
* **Vite**: Ferramenta de build e servidor de desenvolvimento.
* **Axios**: Para fazer as requisições HTTP para o backend.

---

## ✨ Funcionalidades Principais

* [✅] Listar todos os contatos cadastrados.
* [✅] Adicionar um novo contato (Nome, Email, Telefone).
* [✅] Editar as informações de um contato existente.
* [✅] Remover um contato da agenda.

---

## 🚀 Como Rodar o Projeto

Você precisará de dois terminais abertos: um para o Backend e outro para o Frontend.

**Pré-requisitos:**
* [Node.js](https://nodejs.org/en/) (v18+)
* [MySQL](https://www.mysql.com/) (ou um container Docker com MySQL)
* Um gerenciador de pacotes (NPM, que já vem com o Node).

### 1. Clonar o Repositório
```bash
git clone [https://github.com/edsonxjr/agenda_mvp.git](https://github.com/edsonxjr/agenda_mvp.git)
cd agenda_mvp