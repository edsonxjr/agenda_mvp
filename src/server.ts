import express, { Request, Response } from 'express';
import cors from 'cors';
import knex from './database/index';

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

// --- ROTAS ---

// Teste inicial
app.get('/', (req: Request, res: Response) => {
  return res.json({ message: 'API da Agenda está rodando!' });
});

// Listar todos
app.get('/api/contacts', async (req: Request, res: Response) => {
  const contacts = await knex('contacts').select('*');
  return res.json(contacts);
});

// Criar novo
app.post('/api/contacts', async (request: Request, response: Response) => {
  try {
    const { name, email, phone } = request.body;

    await knex('contacts').insert({ name, email, phone });

    return response.status(201).json({ message: 'Contato criado com sucesso!' });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ message: 'Erro ao cadastrar contato.' });
  }
});

// Atualizar
app.put('/api/contacts/:id', async (request: Request, response: Response) => {
  try {
    const { id } = request.params;
    const { name, email, phone } = request.body;

    await knex('contacts').where('id', id).update({ name, email, phone });
    
    return response.json({ message: 'Contato atualizado!' });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ message: 'Erro ao atualizar contato.' });
  }
});

// Deletar
app.delete('/api/contacts/:id', async (request: Request, response: Response) => {
  try {
    const { id } = request.params;

    await knex('contacts').where('id', id).del();

    return response.status(204).send();
  } catch (error) {
    console.log(error);
    return response.status(500).json({ message: 'Erro ao deletar contato.' });
  }
});

// Buscar um (Pelo ID)
app.get('/api/contacts/:id', async (request: Request, response: Response) => {
  try {
    const { id } = request.params;
    
    const contact = await knex('contacts').where('id', id).first();

    if (!contact) {
      return response.status(404).json({ message: 'Contato não encontrado' });
    }
    
    return response.json(contact);
  } catch (error) {
    return response.status(500).json({ message: 'Erro ao buscar' });
  }
});

app.listen(port, () => {
  console.log(`🚀 Servidor backend rodando na porta ${port}`);
});