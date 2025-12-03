import express, { Request, Response } from 'express';
import cors from 'cors';
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

// ROTA [POST] - Criar contato 
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

app.put('/api/contacts/:id', async (request: Request, response: Response) => {
  try {
    const { id } = request.params

    const { name, email, phone } = request.body

    await knex('contacts').where('id', id).update({
      name,
      email,
      phone
    })
    return response.json({ message: 'Contato atualizado!' })

  } catch (error) {
    console.log(error)
    return response.status(500).json({ message: 'Erro ao atulizar contato.' })
  }
})

app.delete('/api/contacts/:id', async (request: Request, response: Response) => {
  try {
    const { id } = request.params

    await knex('contacts').where('id', id).del()

    return response.status(204).send()
  } catch (error) {
    console.log(error)
    return response.status(600).json({ massage: 'Erro ao deletar contato.' })
  }
})

app.get('/api/contacts/:id', async (request: Request, response: Response) => {
  try {
    const { id } = request.params
    const contact = await knex('contact').where('id', id).first()

    if (!contact) {
      return response.status(404).json({ massage: 'Contato não encontado'})
    }
    return response.json(contact)
  }catch (error) {
    return response.status(500).json({ massage: 'Erro ao buscar'})
  }
})

app.listen(port, () => {
  console.log(`🚀 Servidor backend rodando na porta ${port}`);
});