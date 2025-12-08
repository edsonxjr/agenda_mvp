import { email, z } from 'zod';
import express, { Request, Response } from 'express';
import cors from 'cors';
import knex from './database/index';

const app = express();
const port = 3000;
const contactSchema = z.object({
  name: z.string().min(3, 'O nome deve tee pelo menos 3 letras'),
  email: z.string().email('Formato de e-mail invalido'),
  phone: z.string().regex(/^\d{10,11}$/, 'O telefone deve ter 10 ou 11 números (apenas dígitos)')
})

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
    const data = contactSchema.parse(request.body);
    const { name, email, phone } = data;

    await knex('contacts').insert({ name, email, phone });

    return response.status(201).json({ message: 'Contato criado com sucesso!' });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return response.status(400).json({ message: error.issues[0].message })
    }
    console.log(error);
    return response.status(500).json({ message: 'Erro ao cadastrar contato.' });
  }
});

app.put('/api/contacts/:id', async (request: Request, response: Response) => {
  try {
    const { id } = request.params;
    
    // Valida o formato dos dados com Zod
    const data = contactSchema.parse(request.body);
    const { name, email, phone } = data;

    // Verifica se e-mail já existe em OUTRO contato
    const emailExists = await knex('contacts')
      .where('email', email)
      .whereNot('id', id) // Importante: ignora o próprio usuário na busca
      .first();

    if (emailExists) {
      return response.status(409).json({ message: 'Este e-mail já está em uso por outro contato.' });
    }

    // Verifica se telefone já existe em OUTRO contato
    const phoneExists = await knex('contacts')
      .where('phone', phone)
      .whereNot('id', id)
      .first();

    if (phoneExists) {
      return response.status(409).json({ message: 'Este telefone já está em uso por outro contato.' });
    }

    // Atualiza no banco
    await knex('contacts').where('id', id).update({ name, email, phone });
    
    return response.json({ message: 'Contato atualizado!' });

  } catch (error: any) {
    // Captura erros de validação (Zod)
    if (error instanceof z.ZodError) {
      return response.status(400).json({ message: error.issues[0].message });
    }
    
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

app.post('/api/contacts', async (request: Request, response: Response) => {
  try {
    const { name, email, phone } = request.body;


    const emailExists = await knex('contacts').where('email', email).first();

    if (emailExists) {
      return response.status(409).json({ message: 'Este e-mail já está cadastrado.' });
    }
    await knex('contacts').insert({
      name,
      email,
      phone
    });
    return response.status(201).json({ message: 'Contato criado com sucesso!' });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ message: 'Erro ao cadastrar contato.' });
  }
});
app.listen(port, () => {
  console.log(`🚀 Servidor backend rodando na porta ${port}`);
});