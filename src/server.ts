import express, { Request, Response } from 'express';
import cors from 'cors';
import { z } from 'zod';
import knex from './database/index';

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

// --- SCHEMAS DE VALIDAÇÃO (ZOD) ---

// 1. Validação dos Dados do Contato (Com Sanitização)
const contactSchema = z.object({
  name: z.string()
    .trim() // Limpa espaços no começo/fim
    .min(3, 'O nome deve ter pelo menos 3 letras'),
    
  email: z.string()
    .trim()
    .toLowerCase() // Força minúsculo para padronizar
    .email('Formato de e-mail inválido'),
    
  phone: z.string()
    .trim()
    .regex(/^\d{10,11}$/, 'O telefone deve ter 10 ou 11 números (apenas dígitos)')
});

// 2. Validação de ID (para rotas GET/:id, PUT/:id, DELETE/:id)
const idSchema = z.object({
  id: z.coerce.number().positive('O ID deve ser um número positivo')
});

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

// ROTA [POST] - Criar novo
app.post('/api/contacts', async (request: Request, response: Response) => {
  try {
    // 1. Validação Zod (Formato + Limpeza)
    const data = contactSchema.parse(request.body);
    const { name, email, phone } = data;

    // 2. Validação de Integridade (Duplicidade de E-mail)
    const emailExists = await knex('contacts').where('email', email).first();
    if (emailExists) {
      return response.status(409).json({ message: 'Este e-mail já está cadastrado.' });
    }

    // 3. Validação de Integridade (Duplicidade de Telefone)
    const phoneExists = await knex('contacts').where('phone', phone).first();
    if (phoneExists) {
      return response.status(409).json({ message: 'Este telefone já está cadastrado.' });
    }

    // 4. Inserção
    await knex('contacts').insert({ name, email, phone });

    return response.status(201).json({ message: 'Contato criado com sucesso!' });

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return response.status(400).json({ message: error.issues[0].message });
    }
    console.log(error);
    return response.status(500).json({ message: 'Erro ao cadastrar contato.' });
  }
});

// ROTA [PUT] - Atualizar
app.put('/api/contacts/:id', async (request: Request, response: Response) => {
  try {
    // Valida se ID é número
    const { id } = idSchema.parse(request.params);
    
    // Valida o formato dos dados com Zod
    const data = contactSchema.parse(request.body);
    const { name, email, phone } = data;

    // Verifica duplicidade de E-mail (excluindo o próprio ID)
    const emailExists = await knex('contacts')
      .where('email', email)
      .whereNot('id', id)
      .first();

    if (emailExists) {
      return response.status(409).json({ message: 'Este e-mail já está em uso por outro contato.' });
    }

    // Verifica duplicidade de Telefone (excluindo o próprio ID)
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
    if (error instanceof z.ZodError) {
      return response.status(400).json({ message: error.issues[0].message });
    }
    
    console.log(error);
    return response.status(500).json({ message: 'Erro ao atualizar contato.' });
  }
});

// ROTA [DELETE] - Deletar
app.delete('/api/contacts/:id', async (request: Request, response: Response) => {
  try {
    const { id } = idSchema.parse(request.params);

    await knex('contacts').where('id', id).del();

    return response.status(204).send();
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return response.status(400).json({ message: 'ID inválido.' });
    }
    console.log(error);
    return response.status(500).json({ message: 'Erro ao deletar contato.' });
  }
});

// ROTA [GET ÚNICO] - Buscar um
app.get('/api/contacts/:id', async (request: Request, response: Response) => {
  try {
    const { id } = idSchema.parse(request.params);

    const contact = await knex('contacts').where('id', id).first();

    if (!contact) {
      return response.status(404).json({ message: 'Contato não encontrado' });
    }

    return response.json(contact);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return response.status(400).json({ message: 'ID inválido.' });
    }
    return response.status(500).json({ message: 'Erro ao buscar' });
  }
});

app.listen(port, () => {
  console.log(`🚀 Servidor backend rodando na porta ${port}`);
});