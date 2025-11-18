import express, { Request, Response } from 'express';
import cors from 'cors';
// 1. IMPORTANTE: Importa a conexão do banco
import knex from './database/index';

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

// --- ROTAS ---

// Rota de Teste
app.get('/', (req: Request, res: Response) => {
  return res.json({ message: 'API da Agenda está rodando!' });
});

// ROTA [GET] - Listar contatos
app.get('/api/contacts', async (req: Request, res: Response) => {
  const contacts = await knex('contacts').select('*');
  return res.json(contacts);
});

// ROTA [POST] - Criar contato (A que estamos fazendo agora)
app.post('/api/contacts', async (request: Request, response: Response) => {
  try {
    // 1. Pega os dados do corpo da requisição
    const { name, email, phone } = request.body;

    // 2. Insere no banco de dados
    await knex('contacts').insert({
      name,
      email,
      phone
    });

    // 3. Responde com sucesso (201 = Criado)
    return response.status(201).json({ message: 'Contato criado com sucesso!' });

  } catch (error) {
    console.log(error);
    return response.status(500).json({ message: 'Erro ao cadastrar contato.' });
  }
});

app.listen(port, () => {
  console.log(`🚀 Servidor backend rodando na porta ${port}`);
});