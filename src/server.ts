import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { z } from 'zod';
import knex from './database/index';
import multer from 'multer';
import path from 'path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Estendemos o Request para aceitar o campo userId
interface AuthRequest extends Request {
  userId?: number;
}

const app = express();
app.use(express.json());
app.use(cors());

const JWT_SECRET = 'minha_chave_super_secreta_do_edson';

// --- MIDDLEWARE DE PROTEÇÃO (O GUARDA) ---
const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Token não fornecido.' });
  }

  // O header vem assim: "Bearer eyJhbGci..."
  // Queremos só a parte do código depois do espaço
  const [, token] = authHeader.split(' ');

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    // Coloca o ID do usuário dentro da requisição para as rotas usarem
    req.userId = decoded.id;
    next(); // Pode passar!
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido.' });
  }
};

// --- CONFIGURAÇÃO MULTER ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });
app.use('/uploads', express.static('uploads'));

// --- SCHEMAS ---
const registerSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

// --- ROTAS PÚBLICAS (Qualquer um acessa) ---

app.post('/api/auth/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password } = registerSchema.parse(req.body);
    const userExists = await knex('users').where({ email }).first();
    if (userExists) return res.status(409).json({ message: 'Email já existe.' });

    const hashedPassword = await bcrypt.hash(password, 10);
    await knex('users').insert({ name, email, password: hashedPassword });
    return res.status(201).json({ message: 'Criado!' });
  } catch (error) { return res.status(500).json({ message: 'Erro ao criar.' }); }
});

app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const user = await knex('users').where({ email }).first();
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ message: 'Email ou senha errados.' });
    }
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1d' });
    return res.json({ token, name: user.name });
  } catch (error) { return res.status(500).json({ message: 'Erro no login.' }); }
});

// --- ROTAS PRIVADAS (Só com Token) ---
// Note o "authMiddleware" antes das funções!

// 1. LISTAR (Só os MEUS contatos)
app.get('/api/contacts', authMiddleware, async (req: AuthRequest, res: Response) => {
  const contacts = await knex('contacts')
    .leftJoin('categories', 'contacts.category_id', 'categories.id')
    .select('contacts.*', 'categories.name as category_name')
    .where('contacts.user_id', req.userId); // <--- O FILTRO MÁGICO

  return res.json(contacts);
});

// 2. CRIAR (Salva com o MEU id)
app.post('/api/contacts', authMiddleware, upload.single('photo'), async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, phone, is_favorite, category_id } = req.body;
    const photo_path = req.file ? req.file.path : null;

    // Tratamento de dados básico
    const catId = (category_id && category_id !== 'null') ? Number(category_id) : null;
    const isFav = is_favorite === 'true';

    await knex('contacts').insert({
      name, email, phone,
      is_favorite: isFav,
      category_id: catId,
      photo_path,
      user_id: req.userId // <--- SALVA O DONO AQUI
    });

    return res.status(201).json({ message: 'Criado!' });
  } catch (error) { console.log(error); return res.status(500).json({ message: 'Erro.' }); }
});

// 3. ESTATÍSTICAS (Só as MINHAS)
app.get('/api/stats', authMiddleware, async (req: AuthRequest, res: Response) => {
  const stats = await knex('contacts')
    .leftJoin('categories', 'contacts.category_id', 'categories.id')
    .select('categories.name as category')
    .count('contacts.id as total')
    .where('contacts.user_id', req.userId) // <--- ESTATÍSTICA PRIVADA
    .groupBy('categories.name');
  return res.json(stats);
});

// 4. DELETAR (Só se for MEU)
app.delete('/api/contacts/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  await knex('contacts')
    .where({ id, user_id: req.userId }) // Garante que não apago contato dos outros
    .del();
  return res.status(204).send();
});

// 5. ATUALIZAR (Só se for MEU)
app.put('/api/contacts/:id', authMiddleware, upload.single('photo'), async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  // ... lógica de atualização simplificada ...
  const updateData: any = { ...req.body };
  if (req.file) updateData.photo_path = req.file.path;

  delete updateData.photo; // Limpa campo desnecessário

  await knex('contacts')
    .where({ id, user_id: req.userId }) // <--- SEGURANÇA
    .update(updateData);

  return res.json({ message: 'Atualizado' });
});

// Listar categorias e buscar um contato específico
app.get('/api/categories', async (req, res) => {
  const cats = await knex('categories').select('*');
  res.json(cats);
});

app.get('/api/contacts/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const contact = await knex('contacts').where({ id, user_id: req.userId }).first();
  if (!contact) return res.status(404).json({ message: 'Não encontrado' });
  res.json(contact);
});

const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Servidor Privado rodando na porta ${PORT}`));