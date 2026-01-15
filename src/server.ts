import express, { Request, Response } from 'express';
import cors from 'cors';
import { z } from 'zod';
import knex from './database/index'; 
import multer from 'multer'; 
import path from 'path';     
import bcrypt from 'bcryptjs';      // <--- NOVO: Criptografia
import jwt from 'jsonwebtoken';     // <--- NOVO: Token

const app = express();

app.use(express.json());
app.use(cors());

// CHAVE SECRETA (No futuro isso vai para o .env, por enquanto fica aqui)
const JWT_SECRET = 'minha_chave_super_secreta_do_edson';

// --- CONFIGURAÇÃO DO MULTER (UPLOAD DE FOTOS) ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });
app.use('/uploads', express.static('uploads'));

// --- SCHEMAS DE VALIDAÇÃO (ZOD) ---
const registerSchema = z.object({
  name: z.string().min(3, 'Nome precisa de 3 letras'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha precisa de 6 caracteres')
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

const contactSchema = z.object({
  name: z.string().trim().min(3, 'O nome deve ter pelo menos 3 letras'),
  email: z.string().trim().toLowerCase().email('Formato de e-mail inválido'),
  phone: z.string().trim().regex(/^\d{10,11}$/, 'O telefone deve ter 10 ou 11 números'),
  is_favorite: z.preprocess((val) => val === 'true' || val === true, z.boolean()).optional(),
  category_id: z.coerce.number().optional().nullable()
});

const idSchema = z.object({
  id: z.string().regex(/^\d+$/, 'ID inválido').transform(Number)
});

// --- ROTAS DE AUTENTICAÇÃO (NOVAS) ---

// 1. REGISTRAR USUÁRIO
app.post('/api/auth/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password } = registerSchema.parse(req.body);

    // Verifica se já existe
    const userExists = await knex('users').where({ email }).first();
    if (userExists) {
      return res.status(409).json({ message: 'E-mail já cadastrado.' });
    }

    // Embaralha a senha (Hash)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Salva no banco
    await knex('users').insert({
      name,
      email,
      password: hashedPassword
    });

    return res.status(201).json({ message: 'Usuário criado com sucesso!' });
  } catch (error: any) {
    if (error instanceof z.ZodError) return res.status(400).json({ message: error.issues[0].message });
    return res.status(500).json({ message: 'Erro ao registrar.' });
  }
});

// 2. LOGIN (ENTRAR)
app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    // Busca usuário
    const user = await knex('users').where({ email }).first();
    if (!user) {
      return res.status(401).json({ message: 'E-mail ou senha incorretos.' });
    }

    // Compara a senha digitada com a senha embaralhada do banco
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'E-mail ou senha incorretos.' });
    }

    // Gera o Crachá (Token) válido por 1 dia
    const token = jwt.sign({ id: user.id, name: user.name }, JWT_SECRET, { expiresIn: '1d' });

    return res.json({ token, name: user.name });

  } catch (error: any) {
    return res.status(500).json({ message: 'Erro ao fazer login.' });
  }
});


// --- ROTAS DA AGENDA (MANTIDAS) ---

app.get('/', (req: Request, res: Response) => {
  return res.json({ message: 'API da Agenda está rodando!' });
});

app.get('/api/categories', async (req: Request, res: Response) => {
  const categories = await knex('categories').select('*');
  return res.json(categories);
});

app.get('/api/contacts', async (req: Request, res: Response) => {
  const contacts = await knex('contacts')
    .leftJoin('categories', 'contacts.category_id', 'categories.id')
    .select('contacts.*', 'categories.name as category_name');
  return res.json(contacts);
});

app.post('/api/contacts', upload.single('photo'), async (request: Request, response: Response) => {
  try {
    const data = contactSchema.parse(request.body);
    const { name, email, phone, is_favorite, category_id } = data;

    const emailExists = await knex('contacts').where('email', email).first();
    if (emailExists) return response.status(409).json({ message: 'E-mail já cadastrado.' });

    const phoneExists = await knex('contacts').where('phone', phone).first();
    if (phoneExists) return response.status(409).json({ message: 'Telefone já cadastrado.' });

    const photo_path = request.file ? request.file.path : null;

    await knex('contacts').insert({ name, email, phone, is_favorite, category_id, photo_path });

    return response.status(201).json({ message: 'Contato criado com sucesso!' });
  } catch (error: any) {
    if (error instanceof z.ZodError) return response.status(400).json({ message: error.issues[0].message });
    console.log(error);
    return response.status(500).json({ message: 'Erro ao cadastrar.' });
  }
});

app.put('/api/contacts/:id', upload.single('photo'), async (request: Request, response: Response) => {
  try {
    const { id } = idSchema.parse(request.params);
    const data = contactSchema.parse(request.body);
    const { name, email, phone, is_favorite, category_id } = data;

    const emailExists = await knex('contacts').where('email', email).whereNot('id', id).first();
    if (emailExists) return response.status(409).json({ message: 'E-mail em uso.' });

    const phoneExists = await knex('contacts').where('phone', phone).whereNot('id', id).first();
    if (phoneExists) return response.status(409).json({ message: 'Telefone em uso.' });

    const updateData: any = { name, email, phone, is_favorite, category_id };
    if (request.file) {
      updateData.photo_path = request.file.path;
    }

    await knex('contacts').where('id', id).update(updateData);
    return response.json({ message: 'Contato atualizado!' });
  } catch (error: any) {
    if (error instanceof z.ZodError) return response.status(400).json({ message: error.issues[0].message });
    console.log(error);
    return response.status(500).json({ message: 'Erro ao atualizar.' });
  }
});

app.delete('/api/contacts/:id', async (request: Request, response: Response) => {
  try {
    const { id } = idSchema.parse(request.params);
    await knex('contacts').where('id', id).del();
    return response.status(204).send();
  } catch (error: any) {
    return response.status(500).json({ message: 'Erro ao deletar.' });
  }
});

app.get('/api/contacts/:id', async (request: Request, response: Response) => {
  try {
    const { id } = idSchema.parse(request.params);
    const contact = await knex('contacts').where('id', id).first();
    if (!contact) return response.status(404).json({ message: 'Contato não encontrado' });
    return response.json(contact);
  } catch (error: any) {
    return response.status(500).json({ message: 'Erro ao buscar.' });
  }
});

app.get('/api/stats', async (req: Request, res: Response) => {
  try {
    const stats = await knex('contacts')
      .leftJoin('categories', 'contacts.category_id', 'categories.id')
      .select('categories.name as category')
      .count('contacts.id as total')
      .groupBy('categories.name');
    return res.json(stats);
  } catch (error) {
    return res.status(500).json({ message: 'Erro nas estatísticas' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend rodando na porta ${PORT} com Login!`);
});