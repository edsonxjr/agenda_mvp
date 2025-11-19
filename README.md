# 📞 Agenda MVP Fullstack

![Status](https://img.shields.io/badge/Status-100%25%20Conclu%C3%ADdo-success)

Este projeto é um *Mínimo Produto Viável* (MVP) de uma aplicação Fullstack, desenvolvida para gerenciar uma lista simples de contatos. Ele demonstra a **integração completa e funcional** de um Backend em Node.js com um Frontend em Vue.js, focando nas operações CRUD.

---

## ⚙️ Tecnologias Utilizadas

| Módulo | Tecnologias | Descrição |
| :--- | :--- | :--- |
| **Backend** | Node.js, Express, TypeScript, Knex.js | Servidor RESTful com tipagem forte e Knex para manipulação de dados (CRUD completo). |
| **Banco de Dados** | MySQL | Banco de dados relacional para persistência de dados. |
| **Frontend** | Vue.js 3, TypeScript, Axios, **Vite** | Interface reativa que consome as rotas da API (Formulário e Listagem). |

---

## 🚀 Como Rodar o Projeto

Você precisará de dois terminais abertos simultaneamente: um para o Backend (API) e um para o Frontend (UI).

### 1. Pré-requisitos
* [Node.js](https://nodejs.org/) (v18+ recomendado)
* [MySQL Server](https://www.mysql.com/)

### 2. Configuração e Migrações (Executar na Pasta Raiz)

1.  Crie o banco de dados vazio chamado `agenda_db` no seu MySQL.
2.  Instale as dependências do Backend:
    ```bash
    npm install
    ```
3.  Execute as migrações (criação da tabela `contacts`):
    ```bash
    npx knex migrate:latest
    ```

### 3. Iniciando o Backend (API)

Inicie o servidor Node/Express para a API (porta `3000`):

```bash
npm run dev